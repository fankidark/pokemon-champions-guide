"use client";

import { useState } from "react";

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

const CATEGORY_STYLES: Record<string, { label: string; color: string }> = {
  meta: { label: "Meta", color: "bg-yellow-500" },
  offensive: { label: "攻击", color: "bg-red-500" },
  defensive: { label: "防御", color: "bg-blue-500" },
  support: { label: "辅助", color: "bg-green-500" },
  tech: { label: "特殊", color: "bg-purple-500" },
};

interface Build {
  name: string;
  category: string;
  item: string;
  ability: string;
  nature: string;
  sp: Record<string, number>;
  moves: string[];
  description: string;
  matchups?: { favorable: string[]; unfavorable: string[] };
}

interface PokemonBuilds {
  pokemon: string;
  nameZh: string;
  tier: string;
  types: string[];
  sprite: string;
  builds: Build[];
}

export function BuildsClient({ builds }: { builds: PokemonBuilds[] }) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-primary mb-2">⚔️ 配招推荐</h1>
      <p className="text-muted-foreground mb-8">
        每只宝可梦至少 3 套配置方案，含详细招式/道具/SP分配理由和对战思路。
      </p>

      <div className="space-y-6">
        {builds.map((pkmn) => (
          <div key={pkmn.pokemon} className="rounded-xl bg-card border border-border overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-4 p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={pkmn.sprite} alt={pkmn.nameZh} className="w-20 h-20 object-contain" />
              <div>
                <h2 className="text-xl font-bold">{pkmn.nameZh}</h2>
                <div className="flex gap-1 mt-1">
                  {pkmn.types.map((t) => (
                    <span key={t} className={`px-2 py-0.5 text-xs font-medium text-white rounded ${TYPE_COLORS[t]}`}>
                      {TYPE_NAMES[t]}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Builds list */}
            <div className="border-t border-border">
              {pkmn.builds.map((build, i) => {
                const cat = CATEGORY_STYLES[build.category] || CATEGORY_STYLES.tech;
                const isExpanded = expanded === `${pkmn.pokemon}-${i}`;
                return (
                  <div key={i} className="border-b border-border last:border-b-0">
                    <button
                      onClick={() => setExpanded(isExpanded ? null : `${pkmn.pokemon}-${i}`)}
                      className="w-full flex items-center justify-between px-4 py-3 hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-0.5 text-xs font-bold text-white rounded ${cat.color}`}>
                          {cat.label}
                        </span>
                        <span className="font-medium text-sm">{build.name}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{build.item}</span>
                    </button>
                    {isExpanded && (
                      <div className="px-4 pb-4 space-y-3">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                          <div><span className="text-muted-foreground">特性:</span> {build.ability}</div>
                          <div><span className="text-muted-foreground">性格:</span> {build.nature}</div>
                          <div><span className="text-muted-foreground">道具:</span> {build.item}</div>
                          <div><span className="text-muted-foreground">SP总计:</span> {Object.values(build.sp).reduce((a, b) => a + b, 0)}/66</div>
                        </div>
                        <div>
                          <span className="text-xs text-muted-foreground">SP分配:</span>
                          <div className="grid grid-cols-6 gap-1 mt-1">
                            {(["hp", "atk", "def", "spa", "spd", "spe"] as const).map((stat) => (
                              <div key={stat} className="text-center">
                                <div className="text-[10px] text-muted-foreground uppercase">{stat}</div>
                                <div className="text-sm font-mono font-bold">{build.sp[stat]}</div>
                                <div className="h-1 rounded-full bg-border mt-0.5 overflow-hidden">
                                  <div className="h-full bg-primary rounded-full" style={{ width: `${(build.sp[stat] / 32) * 100}%` }} />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <span className="text-xs text-muted-foreground">招式:</span>
                          <div className="flex flex-wrap gap-1.5 mt-1">
                            {build.moves.map((m) => (
                              <span key={m} className="px-2 py-0.5 text-xs bg-accent rounded">{m}</span>
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-foreground/80 leading-relaxed">{build.description}</p>
                        {build.matchups && (
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <span className="text-green-400">✓ 有利:</span>{" "}
                              {build.matchups.favorable.join(", ")}
                            </div>
                            <div>
                              <span className="text-red-400">✗ 不利:</span>{" "}
                              {build.matchups.unfavorable.join(", ")}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
