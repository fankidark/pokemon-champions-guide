"use client";

import { useState, useMemo } from "react";

const TYPE_COLORS: Record<string, string> = {
  normal: "bg-gray-400", fire: "bg-orange-500", water: "bg-blue-500",
  electric: "bg-yellow-400", grass: "bg-green-500", ice: "bg-cyan-300",
  fighting: "bg-red-700", poison: "bg-purple-500", ground: "bg-amber-600",
  flying: "bg-indigo-300", psychic: "bg-pink-500", bug: "bg-lime-500",
  rock: "bg-yellow-700", ghost: "bg-purple-700", dragon: "bg-indigo-600",
  dark: "bg-gray-700", steel: "bg-gray-400", fairy: "bg-pink-300",
};

const CATEGORY_ICONS: Record<string, string> = {
  physical: "💥",
  special: "✨",
  status: "📊",
};

interface MoveItem {
  id: number;
  name: string;
  type: string;
  category: string;
  power: number | null;
  accuracy: number | null;
  pp: number;
  priority: number;
  description: string;
  championsChange?: string;
}

export function MovesClient({ moves }: { moves: MoveItem[] }) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [catFilter, setCatFilter] = useState<string | null>(null);
  const [changesOnly, setChangesOnly] = useState(false);

  const filtered = useMemo(() => {
    return moves.filter((m) => {
      if (search && !m.name.includes(search.toLowerCase())) return false;
      if (typeFilter && m.type !== typeFilter) return false;
      if (catFilter && m.category !== catFilter) return false;
      if (changesOnly && !m.championsChange) return false;
      return true;
    });
  }, [moves, search, typeFilter, catFilter, changesOnly]);

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-primary mb-6">⚡ 技能百科</h1>

      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          placeholder="搜索招式..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <select
          value={typeFilter || ""}
          onChange={(e) => setTypeFilter(e.target.value || null)}
          className="px-3 py-2 rounded-lg bg-card border border-border text-foreground"
        >
          <option value="">全部属性</option>
          {Object.keys(TYPE_COLORS).map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <select
          value={catFilter || ""}
          onChange={(e) => setCatFilter(e.target.value || null)}
          className="px-3 py-2 rounded-lg bg-card border border-border text-foreground"
        >
          <option value="">全部分类</option>
          <option value="physical">物理</option>
          <option value="special">特殊</option>
          <option value="status">变化</option>
        </select>
        <button
          onClick={() => setChangesOnly(!changesOnly)}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            changesOnly ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground"
          }`}
        >
          🔥 Champions 改动
        </button>
      </div>

      <div className="text-sm text-muted-foreground mb-4">共 {filtered.length} 个招式</div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted-foreground">
              <th className="py-2 px-2">招式名</th>
              <th className="py-2 px-2">属性</th>
              <th className="py-2 px-2">分类</th>
              <th className="py-2 px-2">威力</th>
              <th className="py-2 px-2">命中</th>
              <th className="py-2 px-2">PP</th>
              <th className="py-2 px-2 hidden md:table-cell">Champions 改动</th>
            </tr>
          </thead>
          <tbody>
            {filtered.slice(0, 100).map((m) => (
              <tr key={m.id} className={`border-b border-border/50 hover:bg-accent/30 ${m.championsChange ? "bg-yellow-500/5" : ""}`}>
                <td className="py-2 px-2 font-medium">{m.name}</td>
                <td className="py-2 px-2">
                  <span className={`px-1.5 py-0.5 text-[10px] font-medium text-white rounded ${TYPE_COLORS[m.type]}`}>
                    {m.type}
                  </span>
                </td>
                <td className="py-2 px-2">{CATEGORY_ICONS[m.category]} {m.category}</td>
                <td className="py-2 px-2 font-mono">{m.power ?? "—"}</td>
                <td className="py-2 px-2 font-mono">{m.accuracy ?? "—"}</td>
                <td className="py-2 px-2 font-mono">{m.pp}</td>
                <td className="py-2 px-2 text-xs text-yellow-400 hidden md:table-cell">
                  {m.championsChange || ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {filtered.length > 100 && (
        <p className="text-center text-muted-foreground py-4 text-sm">显示前 100 条结果，请使用搜索缩小范围</p>
      )}
    </main>
  );
}
