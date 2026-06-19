"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function TeamsPage() {
  return (
    <main className="min-h-screen p-4 md:p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-primary mb-6">👥 队伍构建器</h1>

      <Card className="mb-6">
        <CardContent className="py-8 text-center">
          <p className="text-4xl mb-4">🚧</p>
          <h2 className="text-lg font-medium mb-2">队伍构建器开发中</h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            即将支持：6只宝可梦配置、类型覆盖分析、速度线对比、威胁评估、 
            队伍导出/分享。
          </p>
        </CardContent>
      </Card>

      <h2 className="text-lg font-bold mb-3">🏆 最近锦标赛队伍</h2>
      <div className="space-y-3">
        {[
          { title: "Week 1 冠军 - Mega Rush", player: "Player_A", pokemon: ["froslass", "haxorus", "talonflame", "garchomp", "arcanine", "milotic"] },
          { title: "Week 1 亚军 - Sand Balance", player: "Player_B", pokemon: ["tyranitar", "excadrill", "salamence", "scizor", "togekiss", "blaziken"] },
        ].map((team) => (
          <Card key={team.title}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-sm">{team.title}</h3>
                <Badge variant="secondary" className="text-xs">{team.player}</Badge>
              </div>
              <div className="flex gap-2">
                {team.pokemon.map((name) => (
                  <img
                    key={name}
                    src={`https://play.pokemonshowdown.com/sprites/ani/${name}.gif`}
                    alt={name}
                    className="w-10 h-10"
                    title={name}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
