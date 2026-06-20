"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";

const TYPE_COLORS: Record<string, string> = {
  normal: "bg-gray-500", fire: "bg-orange-500", water: "bg-blue-500",
  electric: "bg-yellow-400 text-black", grass: "bg-green-500", ice: "bg-cyan-300 text-black",
  fighting: "bg-red-700", poison: "bg-purple-500", ground: "bg-amber-600",
  flying: "bg-indigo-300 text-black", psychic: "bg-pink-500", bug: "bg-lime-500 text-black",
  rock: "bg-yellow-700", ghost: "bg-purple-700", dragon: "bg-indigo-600",
  dark: "bg-gray-700", steel: "bg-gray-400 text-black", fairy: "bg-pink-300 text-black",
};
const TYPE_NAMES: Record<string, string> = {
  normal: "一般", fire: "火", water: "水", electric: "电", grass: "草",
  ice: "冰", fighting: "格斗", poison: "毒", ground: "地面", flying: "飞行",
  psychic: "超能力", bug: "虫", rock: "岩石", ghost: "幽灵", dragon: "龙",
  dark: "恶", steel: "钢", fairy: "妖精",
};
const GEN_RANGES: Record<string, [number, number]> = {
  "全部": [1, 9999],
  "红/蓝": [1, 151], "金/银": [152, 251], "红宝石/蓝宝石": [252, 386],
  "钻石/珍珠": [387, 493], "黑色/白色": [494, 649], "X/Y": [650, 721],
  "太阳/月亮": [722, 809], "剑/盾": [810, 905], "朱/紫": [906, 1025],
};

type SortMode = "usage-desc" | "usage-asc" | "bst-desc" | "bst-asc" | "id-asc";

interface Pokemon {
  id: number; name: string; nameZh: string; types: string[];
  baseStats: { hp: number; atk: number; def: number; spa: number; spd: number; spe: number };
  hasMega?: boolean; usage: number; rank: number; winRate: number; teams: number; role: string;
}

export function PokedexClient({
  pokemon, totalWithUsage, totalTeams
}: {
  pokemon: Pokemon[]; totalWithUsage: number; totalTeams: number;
}) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [genFilter, setGenFilter] = useState("全部");
  const [megaFilter, setMegaFilter] = useState<"all" | "mega" | "non-mega">("all");
  const [sortMode, setSortMode] = useState<SortMode>("usage-desc");
  const [showAll, setShowAll] = useState(false); // show 0% usage pokemon
  const [usageMin, setUsageMin] = useState(0);

  const filtered = useMemo(() => {
    let list = [...pokemon];

    // Search
    if (search) {
      const s = search.toLowerCase();
      list = list.filter(p => p.name.includes(s) || p.nameZh.includes(search));
    }
    // Type
    if (typeFilter) list = list.filter(p => p.types.includes(typeFilter));
    // Gen
    if (genFilter !== "全部") {
      const [min, max] = GEN_RANGES[genFilter];
      list = list.filter(p => p.id >= min && p.id <= max);
    }
    // Mega
    if (megaFilter === "mega") list = list.filter(p => p.hasMega);
    if (megaFilter === "non-mega") list = list.filter(p => !p.hasMega);
    // Usage filter
    if (!showAll) list = list.filter(p => p.usage > usageMin);
    // Sort
    switch (sortMode) {
      case "usage-desc": list.sort((a, b) => b.usage - a.usage); break;
      case "usage-asc": list.sort((a, b) => a.usage - b.usage || a.id - b.id); break;
      case "bst-desc": list.sort((a, b) => bst(b) - bst(a)); break;
      case "bst-asc": list.sort((a, b) => bst(a) - bst(b)); break;
      case "id-asc": list.sort((a, b) => a.id - b.id); break;
    }
    return list;
  }, [pokemon, search, typeFilter, genFilter, megaFilter, sortMode, showAll, usageMin]);

  return (
    <div className="space-y-4">
      {/* Header Stats */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-2xl font-bold">使用率排行</h1>
          <p className="text-sm text-muted-foreground mt-1">
            <span className="text-primary font-medium">M-B</span>
            {" · "}基于 Limitless 公开赛事统计{" · "}
            <span className="text-primary">{totalTeams}</span> 支队伍
            {" · "}更新于 2026-06-19
          </p>
        </div>
        <div className="text-sm text-muted-foreground">
          筛选 <span className="text-primary font-bold">{filtered.length}</span>/{pokemon.length}
        </div>
      </div>

      {/* Filters Row 1 */}
      <div className="flex flex-wrap gap-2 items-center">
        <input
          type="text"
          placeholder="搜索..."
          className="px-3 py-1.5 rounded-lg bg-card border border-border text-sm w-40"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className="px-2 py-1.5 rounded-lg bg-card border border-border text-sm"
          value={sortMode} onChange={(e) => setSortMode(e.target.value as SortMode)}>
          <option value="usage-desc">使用率高</option>
          <option value="usage-asc">使用率低</option>
          <option value="bst-desc">种族值降序</option>
          <option value="bst-asc">种族值升序</option>
          <option value="id-asc">图鉴编号</option>
        </select>
        <select className="px-2 py-1.5 rounded-lg bg-card border border-border text-sm"
          value={genFilter} onChange={(e) => setGenFilter(e.target.value)}>
          {Object.keys(GEN_RANGES).map(g => <option key={g} value={g}>{g === "全部" ? "世代 全部" : g}</option>)}
        </select>
        <select className="px-2 py-1.5 rounded-lg bg-card border border-border text-sm"
          value={megaFilter} onChange={(e) => setMegaFilter(e.target.value as "all"|"mega"|"non-mega")}>
          <option value="all">Mega 全部</option>
          <option value="mega">仅 Mega</option>
          <option value="non-mega">非 Mega</option>
        </select>
        <label className="flex items-center gap-1 text-xs text-muted-foreground cursor-pointer">
          <input type="checkbox" checked={showAll} onChange={(e) => setShowAll(e.target.checked)}
            className="rounded border-border" />
          显示无数据
        </label>
      </div>

      {/* Filters Row 2: Type pills */}
      <div className="flex flex-wrap gap-1">
        <button
          className={`px-2 py-0.5 text-xs rounded-full transition ${!typeFilter ? "bg-primary text-primary-foreground" : "bg-card border border-border hover:bg-card/80"}`}
          onClick={() => setTypeFilter("")}>
          全部
        </button>
        {Object.entries(TYPE_NAMES).map(([key, label]) => (
          <button key={key}
            className={`px-2 py-0.5 text-xs rounded-full transition ${typeFilter === key ? TYPE_COLORS[key] + " text-white" : "bg-card border border-border hover:bg-card/80"}`}
            onClick={() => setTypeFilter(typeFilter === key ? "" : key)}>
            {label}
          </button>
        ))}
      </div>

      {/* Pokemon Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
        {filtered.map((p) => (
          <Link key={p.id} href={`/pokedex/${p.name}`}
            className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border hover:border-primary/50 hover:bg-card/80 transition group">
            {/* Sprite */}
            <div className="w-14 h-14 flex-shrink-0 relative">
              <Image
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.id}.png`}
                alt={p.nameZh}
                width={56} height={56}
                className="pixelated"
                unoptimized
              />
            </div>
            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm truncate">{p.nameZh}</span>
                {p.hasMega && <span className="px-1 py-0 text-[10px] rounded bg-purple-500/20 text-purple-300 font-medium">M</span>}
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="text-[10px] text-muted-foreground">#{String(p.id).padStart(3, "0")}</span>
                {p.types.map(t => (
                  <span key={t} className={`px-1.5 py-0 text-[10px] rounded ${TYPE_COLORS[t]} text-white`}>
                    {TYPE_NAMES[t]}
                  </span>
                ))}
              </div>
              {p.usage > 0 && (
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-primary font-bold">{p.usage.toFixed(1)}%</span>
                  <span className="text-[10px] text-muted-foreground">R{p.rank}</span>
                  {p.winRate > 0 && <span className={`text-[10px] ${p.winRate >= 50 ? "text-green-400" : "text-red-400"}`}>{p.winRate.toFixed(0)}%胜</span>}
                </div>
              )}
              {p.role && <p className="text-[10px] text-amber-300/80 mt-0.5 truncate">{p.role}</p>}
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-muted-foreground py-12">无匹配结果，试试调整筛选条件</p>
      )}
    </div>
  );
}

function bst(p: Pokemon) {
  const s = p.baseStats;
  return s.hp + s.atk + s.def + s.spa + s.spd + s.spe;
}
