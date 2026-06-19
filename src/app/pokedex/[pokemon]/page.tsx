import { getAllPokemon, getBuildsByPokemon, getNamesZh } from "@/lib/data";
import { notFound } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-static";

export async function generateStaticParams() {
  const pokemon = getAllPokemon();
  // Generate pages for top 50 pokemon
  return pokemon.slice(0, 50).map((p) => ({ pokemon: p.name }));
}

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

export default async function PokemonDetailPage({
  params,
}: {
  params: Promise<{ pokemon: string }>;
}) {
  const { pokemon: name } = await params;
  const allPokemon = getAllPokemon();
  const pokemon = allPokemon.find((p) => p.name === name);
  
  if (!pokemon) return notFound();
  
  const namesZh = getNamesZh();
  const builds = getBuildsByPokemon(name);
  const zhName = namesZh[name] || name;
  const stats = pokemon.baseStats;
  const bst = Object.values(stats).reduce((a, b) => a + b, 0);

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <Link href="/pokedex" className="text-sm text-muted-foreground hover:text-primary mb-4 inline-block">
        ← 返回图鉴
      </Link>

      {/* Header */}
      <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={pokemon.sprite} alt={zhName} className="w-48 h-48 object-contain" />
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">{zhName}</h1>
            <span className="text-lg text-muted-foreground">#{pokemon.id}</span>
          </div>
          <div className="flex gap-2 mt-2">
            {pokemon.types.map((t) => (
              <span key={t} className={`px-3 py-1 text-sm font-medium text-white rounded-lg ${TYPE_COLORS[t]}`}>
                {TYPE_NAMES[t]}
              </span>
            ))}
          </div>
          <div className="mt-3 text-sm text-muted-foreground">
            <span>特性: {pokemon.abilities.normal.join(" / ")}</span>
            {pokemon.abilities.hidden && <span> | 隐藏: {pokemon.abilities.hidden}</span>}
          </div>
        </div>
      </div>

      {/* Base Stats */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">种族值 <span className="text-sm text-muted-foreground font-normal">总计 {bst}</span></h2>
        <div className="space-y-2">
          {(Object.entries(stats) as [string, number][]).map(([key, val]) => (
            <div key={key} className="flex items-center gap-3">
              <span className="w-12 text-sm text-muted-foreground">{STAT_NAMES[key]}</span>
              <span className="w-8 text-sm font-mono font-bold text-right">{val}</span>
              <div className="flex-1 h-3 bg-border rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${STAT_COLORS[key]}`}
                  style={{ width: `${(val / 200) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Builds */}
      {builds && (
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">配招推荐</h2>
          <div className="space-y-4">
            {builds.builds.map((build, i) => (
              <div key={i} className="p-4 rounded-lg bg-card border border-border">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold">{build.name}</h3>
                  <span className="text-sm text-muted-foreground">{build.item}</span>
                </div>
                <div className="grid grid-cols-6 gap-1 mb-3">
                  {(["hp", "atk", "def", "spa", "spd", "spe"] as const).map((stat) => (
                    <div key={stat} className="text-center">
                      <div className="text-[10px] text-muted-foreground uppercase">{stat}</div>
                      <div className="text-sm font-mono font-bold">{build.sp[stat]}</div>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {build.moves.map((m) => (
                    <span key={m} className="px-2 py-0.5 text-xs bg-accent rounded">{m}</span>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">{build.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
