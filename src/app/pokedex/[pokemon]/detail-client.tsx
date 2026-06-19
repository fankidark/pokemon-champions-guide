"use client";

import { useEffect, useState } from "react";

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
const STAT_NAMES: Record<string, string> = {
  hp: "HP", atk: "攻击", def: "防御", spa: "特攻", spd: "特防", spe: "速度",
};
const STAT_COLORS: Record<string, string> = {
  hp: "bg-red-500", atk: "bg-orange-500", def: "bg-yellow-500",
  spa: "bg-blue-500", spd: "bg-green-500", spe: "bg-pink-500",
};

interface MetaData {
  usage: number; rank: number; teams: number; winRate: number;
  nature: { name: string; pct: number }[];
  abilities: { name: string; pct: number }[];
  items: { name: string; pct: number }[];
  moves: { name: string; pct: number }[];
  teammates: { name: string; pct: number }[];
  sp: Record<string, number>;
  evaluation: string;
  role: string;
  archetypes: string[];
}

interface Props {
  pokemon: {
    id: number; name: string; nameZh: string; types: string[];
    baseStats: Record<string, number>; abilities: { normal: string[]; hidden: string | null };
    sprite: string; hasMega?: boolean; megaForms?: string[];
  };
  meta: MetaData | null;
}

function BarChart({ items, maxPct }: { items: { name: string; pct: number }[]; maxPct?: number }) {
  const max = maxPct ?? Math.max(...items.map(i => i.pct), 1);
  return (
    <div className="space-y-1.5">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="text-xs w-24 truncate text-foreground">{item.name}</span>
          <div className="flex-1 h-4 bg-border rounded-full overflow-hidden">
            <div className="h-full bg-primary/80 rounded-full transition-all"
              style={{ width: `${(item.pct / max) * 100}%` }} />
          </div>
          <span className="text-xs font-mono w-12 text-right text-muted-foreground">{item.pct}%</span>
        </div>
      ))}
    </div>
  );
}

export function PokemonDetailClient({ pokemon, meta }: Props) {
  const stats = pokemon.baseStats;
  const bst = Object.values(stats).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={pokemon.sprite} alt={pokemon.nameZh} className="w-48 h-48 object-contain" />
        <div className="text-center md:text-left">
          <div className="flex items-center gap-3 justify-center md:justify-start">
            <h1 className="text-3xl font-bold">{pokemon.nameZh}</h1>
            <span className="text-lg text-muted-foreground">#{pokemon.id}</span>
            {pokemon.hasMega && <span className="px-2 py-0.5 text-xs font-bold bg-purple-500 text-white rounded">MEGA</span>}
          </div>
          <div className="flex gap-2 mt-2 justify-center md:justify-start">
            {pokemon.types.map((t) => (
              <span key={t} className={`px-3 py-1 text-sm font-medium text-white rounded-lg ${TYPE_COLORS[t]}`}>
                {TYPE_NAMES[t]}
              </span>
            ))}
          </div>
          <div className="mt-2 text-sm text-muted-foreground">
            特性: {pokemon.abilities.normal.join(" / ")}
            {pokemon.abilities.hidden && <span className="ml-2">| 隐藏: {pokemon.abilities.hidden}</span>}
          </div>
          {meta && (
            <div className="flex gap-4 mt-3 text-sm justify-center md:justify-start">
              <span className="text-primary font-bold">使用率 {meta.usage}%</span>
              <span className="text-muted-foreground">排名 #{meta.rank}</span>
              <span className="text-muted-foreground">胜率 {meta.winRate}%</span>
              <span className="text-muted-foreground">{meta.teams} 支队伍</span>
            </div>
          )}
        </div>
      </div>

      {/* Evaluation card */}
      {meta && (
        <div className="p-4 rounded-xl bg-card border border-primary/30">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">💡</span>
            <span className="font-bold text-primary">{meta.role}</span>
          </div>
          <p className="text-sm text-foreground/80 leading-relaxed">{meta.evaluation}</p>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {meta.archetypes.map((a) => (
              <span key={a} className="px-2 py-0.5 text-xs bg-primary/20 text-primary rounded-full">{a}</span>
            ))}
          </div>
        </div>
      )}

      {/* Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Base Stats */}
        <section className="p-4 rounded-xl bg-card border border-border">
          <h2 className="text-lg font-bold mb-3">种族值 <span className="text-sm text-muted-foreground font-normal">总计 {bst}</span></h2>
          <div className="space-y-2">
            {(Object.entries(stats) as [string, number][]).map(([key, val]) => (
              <div key={key} className="flex items-center gap-2">
                <span className="w-10 text-xs text-muted-foreground">{STAT_NAMES[key]}</span>
                <span className="w-8 text-sm font-mono font-bold text-right">{val}</span>
                <div className="flex-1 h-3 bg-border rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${STAT_COLORS[key]}`}
                    style={{ width: `${(val / 200) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
          {/* SP recommendation */}
          {meta && (
            <div className="mt-4 pt-3 border-t border-border">
              <h3 className="text-sm font-bold mb-2">推荐 SP 分配 <span className="text-xs text-muted-foreground">({Object.values(meta.sp).reduce((a,b)=>a+b,0)}/66)</span></h3>
              <div className="grid grid-cols-6 gap-1">
                {(["hp","atk","def","spa","spd","spe"] as const).map((stat) => (
                  <div key={stat} className="text-center">
                    <div className="text-[10px] text-muted-foreground uppercase">{stat}</div>
                    <div className="text-sm font-mono font-bold">{meta.sp[stat]}</div>
                    <div className="h-1 rounded-full bg-border mt-0.5 overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${(meta.sp[stat]/32)*100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Right: Nature + Ability */}
        {meta && (
          <section className="p-4 rounded-xl bg-card border border-border space-y-4">
            <div>
              <h2 className="text-lg font-bold mb-2">性格</h2>
              <BarChart items={meta.nature} maxPct={100} />
            </div>
            <div>
              <h2 className="text-lg font-bold mb-2">特性</h2>
              <BarChart items={meta.abilities} maxPct={100} />
            </div>
          </section>
        )}
      </div>

      {/* Moves + Items row */}
      {meta && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <section className="p-4 rounded-xl bg-card border border-border">
            <h2 className="text-lg font-bold mb-3">招式使用率</h2>
            <BarChart items={meta.moves} maxPct={100} />
          </section>
          <section className="p-4 rounded-xl bg-card border border-border">
            <h2 className="text-lg font-bold mb-3">道具使用率</h2>
            <BarChart items={meta.items} maxPct={100} />
          </section>
        </div>
      )}

      {/* Teammates */}
      {meta && meta.teammates.length > 0 && (
        <section className="p-4 rounded-xl bg-card border border-border">
          <h2 className="text-lg font-bold mb-3">常见队友</h2>
          <BarChart items={meta.teammates} maxPct={100} />
        </section>
      )}

      {/* No meta data fallback */}
      {!meta && (
        <div className="p-6 rounded-xl bg-card border border-border text-center">
          <p className="text-muted-foreground">暂无竞技数据（等待 Limitless 赛事数据更新）</p>
        </div>
      )}
    </div>
  );
}
