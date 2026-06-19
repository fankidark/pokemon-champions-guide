"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TypeBadge } from "@/components/pokemon/TypeBadge";
import type { PokemonType } from "@/lib/types";

const FEATURED_BUILDS = [
  {
    pokemon: "froslass", nameZh: "雪妖女", id: 478,
    types: ["ice", "ghost"] as PokemonType[],
    builds: [
      { name: "Mega 特攻手", category: "meta", item: "Froslassite" },
      { name: "辅助控场型", category: "tech", item: "Focus Sash" },
      { name: "双打配速型", category: "offensive", item: "Froslassite" },
    ],
  },
  {
    pokemon: "excadrill", nameZh: "龙头地鼠", id: 530,
    types: ["ground", "steel"] as PokemonType[],
    builds: [
      { name: "Mega 穿盾突破", category: "meta", item: "Excadrilite" },
      { name: "沙隐速攻型", category: "offensive", item: "Focus Sash" },
      { name: "Mega 速度控制", category: "tech", item: "Excadrilite" },
    ],
  },
  {
    pokemon: "garchomp", nameZh: "烈咬陆鲨", id: 445,
    types: ["dragon", "ground"] as PokemonType[],
    builds: [
      { name: "围巾速攻 (M-B)", category: "offensive", item: "Choice Scarf" },
      { name: "Mega 混合攻击", category: "meta", item: "Garchompite" },
      { name: "Protect+攻击", category: "defensive", item: "Leftovers" },
    ],
  },
];

const CATEGORY_LABELS: Record<string, { label: string; color: string }> = {
  meta: { label: "Meta", color: "bg-primary/20 text-primary" },
  offensive: { label: "攻击", color: "bg-red-500/20 text-red-300" },
  defensive: { label: "防御", color: "bg-blue-500/20 text-blue-300" },
  tech: { label: "特殊", color: "bg-purple-500/20 text-purple-300" },
  creative: { label: "创意", color: "bg-green-500/20 text-green-300" },
};

export default function BuildsPage() {
  return (
    <main className="min-h-screen p-4 md:p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-primary mb-6">⚔️ 配招推荐</h1>

      <p className="text-sm text-muted-foreground mb-6">
        每只宝可梦至少 3 套配置方案，含详细招式/道具/SP分配理由和对战思路。
      </p>

      <div className="space-y-4">
        {FEATURED_BUILDS.map((entry) => (
          <Card key={entry.pokemon}>
            <CardContent className="p-4">
              <div className="flex items-center gap-4 mb-3">
                <img
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${entry.id}.png`}
                  alt={entry.nameZh}
                  className="w-20 h-20 object-contain"
                />
                <div>
                  <h2 className="text-lg font-bold">{entry.nameZh}</h2>
                  <div className="flex gap-1 mt-1">
                    {entry.types.map((t) => <TypeBadge key={t} type={t} size="sm" />)}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {entry.builds.map((build) => (
                  <Link
                    key={build.name}
                    href={`/builds/${entry.pokemon}?build=${encodeURIComponent(build.name)}`}
                    className="flex items-center gap-2 p-2 rounded border border-border hover:border-primary/50 transition-colors"
                  >
                    <Badge className={`text-[10px] ${CATEGORY_LABELS[build.category]?.color}`}>
                      {CATEGORY_LABELS[build.category]?.label}
                    </Badge>
                    <span className="text-sm font-medium">{build.name}</span>
                    <span className="ml-auto text-xs text-muted-foreground">{build.item}</span>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
