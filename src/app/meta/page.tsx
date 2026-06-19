"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TypeBadge } from "@/components/pokemon/TypeBadge";
import type { PokemonType } from "@/lib/types";

// Placeholder meta data
const TOP_POKEMON = [
  { rank: 1, name: "froslass", nameZh: "雪妖女", types: ["ice", "ghost"] as PokemonType[], usage: 63.8, change: 2.1 },
  { rank: 2, name: "excadrill", nameZh: "龙头地鼠", types: ["ground", "steel"] as PokemonType[], usage: 52.1, change: -1.3 },
  { rank: 3, name: "chandelure", nameZh: "水晶灯火灵", types: ["ghost", "fire"] as PokemonType[], usage: 48.5, change: 3.4 },
  { rank: 4, name: "garchomp", nameZh: "烈咬陆鲨", types: ["dragon", "ground"] as PokemonType[], usage: 45.2, change: -0.5 },
  { rank: 5, name: "haxorus", nameZh: "双斧战龙", types: ["dragon", "steel"] as PokemonType[], usage: 41.3, change: 1.8 },
  { rank: 6, name: "volcarona", nameZh: "火神蛾", types: ["bug", "fire"] as PokemonType[], usage: 39.8, change: 0.7 },
  { rank: 7, name: "charizard", nameZh: "喷火龙", types: ["fire", "flying"] as PokemonType[], usage: 38.2, change: -2.1 },
  { rank: 8, name: "metagross", nameZh: "巨金怪", types: ["steel", "psychic"] as PokemonType[], usage: 36.5, change: 1.2 },
  { rank: 9, name: "salamence", nameZh: "暴飞龙", types: ["dragon", "flying"] as PokemonType[], usage: 35.1, change: -0.8 },
  { rank: 10, name: "tyranitar", nameZh: "班基拉斯", types: ["rock", "dark"] as PokemonType[], usage: 33.7, change: 0.3 },
];

const META_ARCHETYPES = [
  { name: "Mega Rush", desc: "以高速Mega为核心的快攻队", pokemon: ["froslass", "haxorus", "talonflame"], color: "text-red-400" },
  { name: "Sand Balance", desc: "沙暴核心控场 + 龙头地鼠输出", pokemon: ["tyranitar", "excadrill", "garchomp"], color: "text-yellow-400" },
  { name: "Sun Offense", desc: "日照 + 火神蛾/喷火龙Y 双核", pokemon: ["volcarona", "charizard", "arcanine"], color: "text-orange-400" },
  { name: "Trick Room", desc: "空间队低速高火力碾压", pokemon: ["chandelure", "metagross", "dusclops"], color: "text-purple-400" },
];

export default function MetaPage() {
  return (
    <main className="min-h-screen p-4 md:p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-primary mb-2">📊 Meta 分析</h1>
      <p className="text-sm text-muted-foreground mb-6">
        数据来源: Pikalytics Champions · 最后更新: 2026-06-19 · Regulation M-A
      </p>

      {/* Usage Ranking */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-sm">使用率 TOP 10</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {TOP_POKEMON.map((p) => (
              <div key={p.name} className="flex items-center gap-3 py-1">
                <span className="w-6 text-xs text-muted-foreground text-right">#{p.rank}</span>
                <img
                  src={`https://play.pokemonshowdown.com/sprites/ani/${p.name}.gif`}
                  alt={p.nameZh}
                  className="w-8 h-8 object-contain"
                />
                <span className="font-medium text-sm w-24">{p.nameZh}</span>
                <div className="flex gap-1">
                  {p.types.map((t) => <TypeBadge key={t} type={t} size="sm" />)}
                </div>
                <div className="flex-1" />
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-secondary rounded-full overflow-hidden hidden md:block">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${p.usage}%` }} />
                  </div>
                  <span className="text-sm font-mono w-14 text-right">{p.usage}%</span>
                  <span className={`text-xs w-12 text-right ${p.change > 0 ? "text-green-400" : p.change < 0 ? "text-red-400" : "text-muted-foreground"}`}>
                    {p.change > 0 ? "↑" : p.change < 0 ? "↓" : "→"}{Math.abs(p.change).toFixed(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Archetypes */}
      <h2 className="text-lg font-bold mb-3">🏗️ 主流 Archetype</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
        {META_ARCHETYPES.map((arch) => (
          <Card key={arch.name}>
            <CardContent className="p-4">
              <h3 className={`font-bold text-sm ${arch.color}`}>{arch.name}</h3>
              <p className="text-xs text-muted-foreground mt-1">{arch.desc}</p>
              <div className="flex gap-1 mt-2">
                {arch.pokemon.map((name) => (
                  <img
                    key={name}
                    src={`https://play.pokemonshowdown.com/sprites/ani/${name}.gif`}
                    alt={name}
                    className="w-8 h-8"
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Regulation Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">📋 Regulation M-A 规则概要</CardTitle>
        </CardHeader>
        <CardContent className="text-xs space-y-1 text-muted-foreground">
          <p>• 双打 Lv50 | 队伍6选4</p>
          <p>• Mega 进化：每场最多1只</p>
          <p>• ❌ 太晶化 / Z招式 / 极巨化</p>
          <p>• ❌ 禁止道具: 命玉 / 讲究系 / 突击背心 / 进化奇石</p>
          <p>• ⚠️ 催眠最多2回合 / 麻痹完全不能动12.5% / 冰冻最多3回合</p>
          <p>• ⚠️ 击掌奇袭每次上场仅可使用一次</p>
        </CardContent>
      </Card>
    </main>
  );
}
