"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

const TYPE_COLORS: Record<string, string> = {
  normal: "bg-gray-400", fire: "bg-orange-500", water: "bg-blue-500",
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

const ALL_TYPES = Object.keys(TYPE_COLORS);
const TIERS = ["S", "A", "B", "C", "D"];

interface PokemonItem {
  id: number;
  name: string;
  nameZh: string;
  types: string[];
  sprite: string;
  usage: number;
  tier: string;
  isMega: boolean;
  isNew: boolean;
}

export function PokedexClient({ pokemon }: { pokemon: PokemonItem[] }) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [tierFilter, setTierFilter] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return pokemon.filter((p) => {
      if (search) {
        const q = search.toLowerCase();
        if (!p.name.includes(q) && !p.nameZh.includes(q) && !String(p.id).includes(q)) return false;
      }
      if (typeFilter && !p.types.includes(typeFilter)) return false;
      if (tierFilter && p.tier !== tierFilter) return false;
      return true;
    });
  }, [pokemon, search, typeFilter, tierFilter]);

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-primary mb-6">📖 宝可梦图鉴</h1>

      {/* Search */}
      <input
        type="text"
        placeholder="搜索宝可梦名称/编号..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-md mb-4 px-4 py-2 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
      />

      {/* Type filter */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        <button
          onClick={() => setTypeFilter(null)}
          className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
            !typeFilter ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground hover:text-foreground"
          }`}
        >
          全部
        </button>
        {ALL_TYPES.map((t) => (
          <button
            key={t}
            onClick={() => setTypeFilter(typeFilter === t ? null : t)}
            className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
              typeFilter === t ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {TYPE_NAMES[t]}
          </button>
        ))}
      </div>

      {/* Tier filter */}
      <div className="flex gap-1.5 mb-6">
        {TIERS.map((tier) => (
          <button
            key={tier}
            onClick={() => setTierFilter(tierFilter === tier ? null : tier)}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              tierFilter === tier ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            Tier {tier}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((p) => (
          <Link
            key={p.id}
            href={`/pokedex/${p.name}`}
            className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border hover:border-primary transition-colors"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={p.sprite}
              alt={p.nameZh}
              className="w-16 h-16 object-contain"
              loading="lazy"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-sm truncate">{p.nameZh}</span>
                {p.isNew && <span className="px-1.5 py-0.5 text-[10px] font-bold bg-orange-500 text-white rounded">NEW</span>}
                {p.isMega && <span className="px-1.5 py-0.5 text-[10px] font-bold bg-purple-500 text-white rounded">M</span>}
              </div>
              <div className="flex gap-1 mt-1">
                {p.types.map((t) => (
                  <span key={t} className={`px-1.5 py-0.5 text-[10px] font-medium text-white rounded ${TYPE_COLORS[t]}`}>
                    {TYPE_NAMES[t]}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-muted-foreground">#{p.id}</span>
                {p.usage > 0 && <span className="text-xs text-muted-foreground">使用率 {p.usage}%</span>}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-muted-foreground py-12">没有找到匹配的宝可梦</p>
      )}
    </main>
  );
}
