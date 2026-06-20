#!/usr/bin/env python3
"""
PokeCamp data parser — parses raw text from pokecamp.cc/zh/champions/pokemon/{id}
Usage: python parse-pokecamp.py data/raw/pokecamp-*.txt > data/meta-usage.json

Workflow:
1. Fetch: curl/mcp_ddg each pokemon page -> save to data/raw/pokecamp-{id}.txt
2. Parse: this script reads all raw files -> outputs structured JSON
3. Merge: combine with existing evaluations
"""
import re, json, glob, sys, os

def parse_pokecamp_text(raw: str) -> dict:
    data = {"usage": 0, "rank": 0, "teams": 0, "winRate": 0,
            "nature": [], "abilities": [], "items": [], "moves": [], "teammates": [], "sp": {}}
    
    m = re.search(r'使用率([\d.]+)%', raw)
    if m: data["usage"] = float(m.group(1))
    m = re.search(r'排名(\d+)', raw)
    if m: data["rank"] = int(m.group(1))
    m = re.search(r'队伍(\d+)', raw)
    if m: data["teams"] = int(m.group(1))
    m = re.search(r'胜率([\d.]+)%', raw)
    if m: data["winRate"] = float(m.group(1))
    
    def extract_pairs(text, max_items=12):
        text = re.sub(r'^.*?/ 双打', '', text)
        pairs, seen = [], set()
        for match in re.finditer(r'([^\d%]+?)([\d.]+)%', text):
            full_name = match.group(1).strip()
            pct = float(match.group(2))
            if not full_name or pct <= 0: continue
            name = full_name
            half = len(name) // 2
            if half > 0 and name[:half] == name[half:]: name = name[:half]
            elif half > 0 and name[:half+1] == name[half+1:]: name = name[:half+1]
            name = name.strip()
            if name and name not in seen and len(name) < 15:
                seen.add(name)
                pairs.append({"name": name, "pct": pct})
                if len(pairs) >= max_items: break
        return pairs
    
    sections = [("特性Limitless", "abilities", "道具", 5),
                ("道具Limitless", "items", "招式", 10),
                ("招式Limitless", "moves", "常见队友", 15),
                ("常见队友Limitless", "teammates", "相关队伍", 12)]
    for marker, key, end_marker, limit in sections:
        parts = raw.split(marker)
        if len(parts) > 1:
            chunk = parts[1].split(end_marker)[0] if end_marker in parts[1] else parts[1][:2000]
            data[key] = extract_pairs(chunk, limit)
    
    # Nature
    parts = raw.split("性格Limitless")
    if len(parts) > 1:
        ntext = re.sub(r'^.*?/ 双打', '', parts[-1][:500])
        for name, pct in re.findall(r'([^\d%]{2,3})([\d.]+)%', ntext):
            name = name.strip()
            if name and float(pct) > 0 and len(name) <= 3 and name not in [n['name'] for n in data['nature']]:
                data["nature"].append({"name": name, "pct": float(pct)})
    
    # SP from Min+N patterns
    stat_keys = ["hp", "atk", "def", "spa", "spd", "spe"]
    stats_section = raw.split("特性")[0] if "特性" in raw else raw[:1000]
    sp_values = re.findall(r'Min\+(\d+)', stats_section)
    sp = {k: 0 for k in stat_keys}
    for i, v in enumerate(sp_values):
        if i < 6: sp[stat_keys[i]] = int(v)
    data["sp"] = sp
    
    return data

if __name__ == "__main__":
    raw_dir = os.path.join(os.path.dirname(__file__), "..", "data", "raw")
    files = sorted(glob.glob(os.path.join(raw_dir, "pokecamp-*.txt")))
    
    result = {}
    for f in files:
        pid = re.search(r'pokecamp-(\d+)\.txt', f)
        if not pid: continue
        with open(f, 'r') as fh:
            raw = fh.read()
        if len(raw) < 100: continue  # skip empty/no-data pages
        parsed = parse_pokecamp_text(raw)
        if parsed["usage"] > 0:
            result[pid.group(1)] = parsed
            print(f"  #{pid.group(1)}: {parsed['usage']}% R{parsed['rank']}", file=sys.stderr)
    
    # Merge with existing evaluations if available
    eval_file = os.path.join(os.path.dirname(__file__), "..", "data", "evaluations.json")
    if os.path.exists(eval_file):
        with open(eval_file) as f:
            evals = json.load(f)
        for pid, ev in evals.items():
            if pid in result:
                result[pid].update(ev)
    
    print(json.dumps(result, ensure_ascii=False, indent=2))
