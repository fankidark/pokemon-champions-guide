import { getAllPokemon, getAllBuilds } from "@/lib/data";
import { PokedexClient } from "./pokedex-client";

export const dynamic = "force-static";

export default function PokedexPage() {
  const allPokemon = getAllPokemon();
  const allBuilds = getAllBuilds();
  
  // Build meta info: assign usage/tier from builds data + champions-patch
  const metaPokemon = [
    { name: "froslass", usage: 63.8, tier: "S", isMega: true, isNew: true },
    { name: "excadrill", usage: 52.1, tier: "S", isMega: true, isNew: true },
    { name: "chandelure", usage: 48.5, tier: "S", isMega: true, isNew: true },
    { name: "garchomp", usage: 45.2, tier: "S", isMega: true, isNew: false },
    { name: "haxorus", usage: 41.3, tier: "A", isMega: true, isNew: true },
    { name: "volcarona", usage: 39.8, tier: "A", isMega: true, isNew: true },
    { name: "charizard", usage: 38.2, tier: "A", isMega: true, isNew: false },
    { name: "metagross", usage: 36.5, tier: "A", isMega: true, isNew: false },
    { name: "salamence", usage: 35.1, tier: "A", isMega: true, isNew: false },
    { name: "tyranitar", usage: 33.7, tier: "A", isMega: true, isNew: false },
    { name: "gengar", usage: 31.2, tier: "A", isMega: true, isNew: false },
    { name: "lucario", usage: 29.8, tier: "B", isMega: true, isNew: false },
    { name: "scizor", usage: 28.5, tier: "B", isMega: true, isNew: false },
    { name: "gyarados", usage: 27.1, tier: "B", isMega: true, isNew: false },
    { name: "dragonite", usage: 25.6, tier: "B", isMega: false, isNew: false },
    { name: "talonflame", usage: 24.3, tier: "B", isMega: true, isNew: true },
    { name: "togekiss", usage: 22.9, tier: "B", isMega: true, isNew: true },
    { name: "blaziken", usage: 21.4, tier: "B", isMega: true, isNew: false },
    { name: "arcanine", usage: 19.8, tier: "B", isMega: true, isNew: true },
    { name: "milotic", usage: 18.2, tier: "C", isMega: true, isNew: true },
    { name: "ferrothorn", usage: 17.5, tier: "C", isMega: false, isNew: false },
    { name: "incineroar", usage: 16.8, tier: "C", isMega: false, isNew: false },
    { name: "amoonguss", usage: 15.2, tier: "C", isMega: false, isNew: false },
    { name: "whimsicott", usage: 14.1, tier: "C", isMega: false, isNew: false },
  ];

  // Merge meta info into pokemon data
  const pokemonWithMeta = allPokemon.map((p) => {
    const meta = metaPokemon.find((m) => m.name === p.name);
    return {
      ...p,
      usage: meta?.usage ?? 0,
      tier: meta?.tier ?? "D",
      isMega: meta?.isMega ?? false,
      isNew: meta?.isNew ?? false,
    };
  });

  // Sort by usage (desc), pokemon with usage first
  const sorted = pokemonWithMeta.sort((a, b) => b.usage - a.usage);
  // Only pass top 200 for perf (rest are all tier D / 0 usage)
  const topPokemon = sorted.slice(0, 200);

  return <PokedexClient pokemon={topPokemon} />;
}
