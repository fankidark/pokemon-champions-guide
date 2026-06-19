import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// This will be SSG with generateStaticParams in production
// For now, a placeholder that shows layout structure

interface Props {
  params: Promise<{ pokemon: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { pokemon } = await params;
  return {
    title: `${pokemon} | 图鉴`,
  };
}

// Placeholder stat data
const SAMPLE_DATA: Record<string, any> = {
  garchomp: {
    id: 445, nameZh: "烈咬陆鲨", types: ["dragon", "ground"],
    baseStats: { hp: 108, atk: 130, def: 95, spa: 80, spd: 85, spe: 102 },
    abilities: { normal: ["Sand Veil"], hidden: "Rough Skin" },
    mega: {
      name: "Garchomp-Mega", types: ["dragon", "ground"],
      baseStats: { hp: 108, atk: 170, def: 115, spa: 120, spd: 95, spe: 92 },
      ability: "Sand Force",
    },
  },
  froslass: {
    id: 478, nameZh: "雪妖女", types: ["ice", "ghost"],
    baseStats: { hp: 70, atk: 80, def: 70, spa: 80, spd: 70, spe: 110 },
    abilities: { normal: ["Snow Cloak"], hidden: "Cursed Body" },
    mega: {
      name: "Froslass-Mega", types: ["ice", "ghost"],
      baseStats: { hp: 70, atk: 80, def: 90, spa: 130, spd: 110, spe: 130 },
      ability: "Cursed Body",
      isChampionsExclusive: true,
    },
  },
};

function StatBar({ label, value, max = 200 }: { label: string; value: number; max?: number }) {
  const percentage = (value / max) * 100;
  const color =
    value >= 130 ? "bg-red-500" :
    value >= 100 ? "bg-orange-400" :
    value >= 80 ? "bg-yellow-400" :
    value >= 60 ? "bg-green-400" :
    "bg-blue-400";

  return (
    <div className="flex items-center gap-2">
      <span className="w-10 text-xs text-muted-foreground text-right">{label}</span>
      <span className="w-8 text-xs text-right font-mono">{value}</span>
      <div className="flex-1 h-3 bg-secondary rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}

export default async function PokemonDetailPage({ params }: Props) {
  const { pokemon: pokemonSlug } = await params;
  const data = SAMPLE_DATA[pokemonSlug];

  if (!data) {
    // For now show a placeholder for unknown Pokemon
    return (
      <main className="min-h-screen p-4 md:p-8 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">{pokemonSlug}</h1>
        <p className="text-muted-foreground">详细数据正在建设中...</p>
      </main>
    );
  }

  const stats = data.baseStats;
  const bst = Object.values(stats).reduce((a: number, b: any) => a + b, 0);

  return (
    <main className="min-h-screen p-4 md:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-start gap-6 mb-8">
        <img
          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${data.id}.png`}
          alt={data.nameZh}
          className="w-48 h-48 object-contain"
        />
        <div>
          <h1 className="text-3xl font-bold">{data.nameZh}</h1>
          <p className="text-muted-foreground">#{data.id} · {pokemonSlug}</p>
          <div className="flex gap-2 mt-3">
            {data.types.map((t: string) => (
              <Badge key={t} className="capitalize">{t}</Badge>
            ))}
          </div>
          <div className="mt-3 text-sm">
            <span className="text-muted-foreground">特性: </span>
            {data.abilities.normal.join(" / ")}
            {data.abilities.hidden && (
              <span className="text-purple-400"> ({data.abilities.hidden})</span>
            )}
          </div>
        </div>
      </div>

      {/* Base Stats */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-sm">种族值 (BST: {bst})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <StatBar label="HP" value={stats.hp} />
          <StatBar label="攻击" value={stats.atk} />
          <StatBar label="防御" value={stats.def} />
          <StatBar label="特攻" value={stats.spa} />
          <StatBar label="特防" value={stats.spd} />
          <StatBar label="速度" value={stats.spe} />
        </CardContent>
      </Card>

      {/* Mega Evolution */}
      {data.mega && (
        <Card className="mb-6 border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              Mega 进化
              {data.mega.isChampionsExclusive && (
                <Badge className="bg-purple-500/20 text-purple-300 text-[10px]">Champions 限定</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-xs text-muted-foreground mb-3">
              特性: <span className="text-foreground">{data.mega.ability}</span>
            </p>
            <StatBar label="HP" value={data.mega.baseStats.hp} />
            <StatBar label="攻击" value={data.mega.baseStats.atk} />
            <StatBar label="防御" value={data.mega.baseStats.def} />
            <StatBar label="特攻" value={data.mega.baseStats.spa} />
            <StatBar label="特防" value={data.mega.baseStats.spd} />
            <StatBar label="速度" value={data.mega.baseStats.spe} />
          </CardContent>
        </Card>
      )}

      {/* Builds section placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">推荐配置</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">配招数据正在建设中...</p>
        </CardContent>
      </Card>
    </main>
  );
}
