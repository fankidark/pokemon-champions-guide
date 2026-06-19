import { getAllBuilds, getNamesZh, getAllPokemon } from "@/lib/data";
import { BuildsClient } from "./builds-client";

export const dynamic = "force-static";

export default function BuildsPage() {
  const builds = getAllBuilds();
  const namesZh = getNamesZh();
  const allPokemon = getAllPokemon();

  // Enrich builds with Chinese names and sprites
  const enriched = builds.map((b) => {
    const pokemon = allPokemon.find((p) => p.name === b.pokemon);
    return {
      ...b,
      nameZh: namesZh[b.pokemon] || b.pokemon,
      types: pokemon?.types || [],
      sprite: pokemon?.sprite || "",
    };
  });

  return <BuildsClient builds={enriched} />;
}
