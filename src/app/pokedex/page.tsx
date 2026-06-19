import { getAllPokemon, getAllBuilds } from "@/lib/data";
import { PokedexClient } from "./pokedex-client";

export const dynamic = "force-static";

// Placeholder usage data until Pikalytics goes live
const metaUsage: Record<string, { usage: number; tier: string }> = {
  froslass: { usage: 63.8, tier: "S" },
  excadrill: { usage: 52.1, tier: "S" },
  chandelure: { usage: 48.5, tier: "S" },
  garchomp: { usage: 45.2, tier: "S" },
  volcarona: { usage: 39.8, tier: "A" },
  charizard: { usage: 38.2, tier: "A" },
  metagross: { usage: 36.5, tier: "A" },
  tyranitar: { usage: 33.7, tier: "A" },
  greninja: { usage: 32.4, tier: "A" },
  incineroar: { usage: 31.0, tier: "A" },
  dragonite: { usage: 29.5, tier: "A" },
  scizor: { usage: 28.1, tier: "B" },
  gyarados: { usage: 27.0, tier: "B" },
  togekiss: { usage: 25.8, tier: "B" },  // not in roster but keep for demo
  blaziken: { usage: 24.5, tier: "B" },
  lucario: { usage: 23.2, tier: "B" },
  dragapult: { usage: 22.0, tier: "B" },
  kingambit: { usage: 21.5, tier: "B" },
  annihilape: { usage: 20.8, tier: "B" },
  gholdengo: { usage: 19.5, tier: "B" },
  gardevoir: { usage: 18.0, tier: "C" },
  talonflame: { usage: 17.2, tier: "C" },
  arcanine: { usage: 16.5, tier: "C" },
  milotic: { usage: 15.8, tier: "C" },
  whimsicott: { usage: 14.5, tier: "C" },
  grimmsnarl: { usage: 13.8, tier: "C" },
  hatterene: { usage: 12.5, tier: "C" },
  corviknight: { usage: 11.8, tier: "C" },
  amoonguss: { usage: 11.0, tier: "C" },  // not in roster
  pelipper: { usage: 10.5, tier: "C" },
};

export default function PokedexPage() {
  const allPokemon = getAllPokemon();

  // Merge usage data
  const pokemonWithMeta = allPokemon.map((p) => {
    const meta = metaUsage[p.name];
    return {
      id: p.id,
      name: p.name,
      nameZh: p.nameZh,
      types: p.types,
      sprite: p.sprite,
      usage: meta?.usage ?? 0,
      tier: meta?.tier ?? "D",
      isMega: p.hasMega ?? false,
      isNew: (p.megaForms?.length ?? 0) > 0 && !["charizard","blastoise","venusaur","gengar","kangaskhan","alakazam","garchomp","lucario","scizor","tyranitar","metagross","salamence","blaziken","swampert","sceptile","gardevoir","mawile","aggron","medicham","manectric","sharpedo","camerupt","altaria","banette","absol","glalie","lopunny","gallade","aerodactyl","pinsir","gyarados","heracross","houndoom","steelix","ampharos","abomasnow","audino","beedrill","pidgeot","sableye"].includes(p.name),
    };
  });

  // Sort: has usage first (desc), then by dex number
  const sorted = pokemonWithMeta.sort((a, b) => {
    if (a.usage !== b.usage) return b.usage - a.usage;
    return a.id - b.id;
  });

  return <PokedexClient pokemon={sorted} />;
}
