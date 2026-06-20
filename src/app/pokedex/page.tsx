import { getAllPokemon, getNamesZh } from "@/lib/data";
import * as fs from "fs";
import * as path from "path";
import { PokedexClient } from "./pokedex-client";

export const dynamic = "force-static";

function loadMetaUsage() {
  try {
    const raw = fs.readFileSync(path.join(process.cwd(), "data", "meta-usage.json"), "utf-8");
    return JSON.parse(raw);
  } catch { return {}; }
}

export default function PokedexPage() {
  const allPokemon = getAllPokemon();
  const namesZh = getNamesZh();
  const metaUsage = loadMetaUsage();

  // Merge usage data into pokemon list
  const enriched = allPokemon.map((p) => ({
    ...p,
    nameZh: namesZh[p.name] || p.nameZh || p.name,
    usage: metaUsage[String(p.id)]?.usage || 0,
    rank: metaUsage[String(p.id)]?.rank || 0,
    winRate: metaUsage[String(p.id)]?.winRate || 0,
    teams: metaUsage[String(p.id)]?.teams || 0,
    role: metaUsage[String(p.id)]?.role || "",
  }));

  // Stats
  const totalWithUsage = enriched.filter(p => p.usage > 0).length;
  const totalTeams = Object.values(metaUsage).reduce((sum: number, m: any) => sum + (m.teams || 0), 0);

  return (
    <main className="max-w-7xl mx-auto px-4 py-6">
      <PokedexClient
        pokemon={enriched}
        totalWithUsage={totalWithUsage}
        totalTeams={totalTeams}
      />
    </main>
  );
}
