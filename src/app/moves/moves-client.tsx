"use client";

import { useState, useMemo } from "react";

const TYPE_COLORS: Record<string, string> = {
  normal: "bg-gray-500", fire: "bg-orange-500", water: "bg-blue-500",
  electric: "bg-yellow-400", grass: "bg-green-500", ice: "bg-cyan-300",
  fighting: "bg-red-700", poison: "bg-purple-500", ground: "bg-amber-600",
  flying: "bg-indigo-300", psychic: "bg-pink-500", bug: "bg-lime-500",
  rock: "bg-yellow-700", ghost: "bg-purple-700", dragon: "bg-indigo-600",
  dark: "bg-gray-700", steel: "bg-gray-400", fairy: "bg-pink-300",
};
const TYPE_NAMES: Record<string, string> = {
  normal: "一般", fire: "火", water: "水", electric: "电", grass: "草",
  ice: "冰", fighting: "格斗", poison: "毒", ground: "地面", flying: "飞行",
  psychic: "超能", bug: "虫", rock: "岩石", ghost: "幽灵", dragon: "龙",
  dark: "恶", steel: "钢", fairy: "妖精",
};
const CAT_ICONS: Record<string, string> = {
  physical: "⚔️", special: "✨", status: "🔄",
};

interface Move {
  id: number; name: string; type: string; category: string;
  power: number | null; accuracy: number | null; pp: number;
  priority: number; description: string;
  nameZh?: string; descZh?: string; tip?: string;
  championsChange?: boolean | string;
}

export function MovesClient({ moves }: { moves: Move[] }) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [catFilter, setCatFilter] = useState("");
  const [showTips, setShowTips] = useState(false);
  const [champOnly, setChampOnly] = useState(false);

  const filtered = useMemo(() => {
    return moves.filter((m) => {
      if (search && !m.name.includes(search.toLowerCase()) && 
          !(m.nameZh && m.nameZh.includes(search))) return false;
      if (typeFilter && m.type !== typeFilter) return false;
      if (catFilter && m.category !== catFilter) return false;
      if (champOnly && !m.championsChange) return false;
      return true;
    });
  }, [moves, search, typeFilter, catFilter, champOnly]);

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <input
          type="text"
          placeholder="搜索招式（中文/英文）..."
          className="px-3 py-2 rounded-lg bg-card border border-border text-sm flex-1 min-w-48"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className="px-3 py-2 rounded-lg bg-card border border-border text-sm"
          value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
          <option value="">全部属性</option>
          {Object.entries(TYPE_NAMES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select className="px-3 py-2 rounded-lg bg-card border border-border text-sm"
          value={catFilter} onChange={(e) => setCatFilter(e.target.value)}>
          <option value="">全部分类</option>
          <option value="physical">物理</option>
          <option value="special">特殊</option>
          <option value="status">变化</option>
        </select>
        <button
          className={`px-3 py-2 rounded-lg text-sm font-medium transition ${showTips ? "bg-primary text-primary-foreground" : "bg-card border border-border"}`}
          onClick={() => setShowTips(!showTips)}>
          💡 使用建议
        </button>
        <button
          className={`px-3 py-2 rounded-lg text-sm font-medium transition ${champOnly ? "bg-orange-500 text-white" : "bg-card border border-border"}`}
          onClick={() => setChampOnly(!champOnly)}>
          🔥 Champions改动
        </button>
      </div>

      <p className="text-sm text-primary font-medium">共 {filtered.length} 个招式</p>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-muted-foreground border-b border-border">
              <th className="py-2 px-2">招式名</th>
              <th className="py-2 px-2">属性</th>
              <th className="py-2 px-2">分类</th>
              <th className="py-2 px-2 text-right">威力</th>
              <th className="py-2 px-2 text-right">命中</th>
              <th className="py-2 px-2 text-right">PP</th>
              {showTips && <th className="py-2 px-2">使用建议</th>}
            </tr>
          </thead>
          <tbody>
            {filtered.slice(0, 100).map((m) => (
              <tr key={m.id} className="border-b border-border/50 hover:bg-card/50 transition">
                <td className="py-2 px-2">
                  <div className="font-medium">{m.nameZh || m.name}</div>
                  {m.nameZh && <div className="text-xs text-muted-foreground">{m.name}</div>}
                  {m.descZh && <div className="text-xs text-muted-foreground mt-0.5">{m.descZh}</div>}
                </td>
                <td className="py-2 px-2">
                  <span className={`px-2 py-0.5 text-xs text-white rounded ${TYPE_COLORS[m.type]}`}>
                    {TYPE_NAMES[m.type]}
                  </span>
                </td>
                <td className="py-2 px-2">
                  <span className="text-xs">{CAT_ICONS[m.category]} {m.category === "physical" ? "物理" : m.category === "special" ? "特殊" : "变化"}</span>
                </td>
                <td className="py-2 px-2 text-right font-mono font-bold">{m.power || "-"}</td>
                <td className="py-2 px-2 text-right font-mono">{m.accuracy || "-"}</td>
                <td className="py-2 px-2 text-right font-mono">{m.pp}</td>
                {showTips && (
                  <td className="py-2 px-2 text-xs text-amber-300 max-w-xs">{m.tip ? `💡 ${m.tip}` : ""}</td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length > 100 && (
          <p className="text-sm text-muted-foreground text-center mt-4">显示前 100 条，请使用搜索缩小范围</p>
        )}
      </div>
    </div>
  );
}
