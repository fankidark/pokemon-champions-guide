import { getAllPokemon, getNamesZh } from "@/lib/data";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PokemonDetailClient } from "./detail-client";
import * as fs from "fs";
import * as path from "path";

export const dynamic = "force-static";

export async function generateStaticParams() {
  const pokemon = getAllPokemon();
  return pokemon.map((p) => ({ pokemon: p.name }));
}

function loadMetaUsage(): Record<string, unknown> {
  const filePath = path.join(process.cwd(), "data", "meta-usage.json");
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export default async function PokemonDetailPage({
  params,
}: {
  params: Promise<{ pokemon: string }>;
}) {
  const { pokemon: name } = await params;
  const allPokemon = getAllPokemon();
  const pokemon = allPokemon.find((p) => p.name === name);

  if (!pokemon) return notFound();

  const metaUsage = loadMetaUsage();
  // Look up by ID (meta-usage keys are string IDs)
  const meta = metaUsage[String(pokemon.id)] || null;

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <Link href="/pokedex" className="text-sm text-muted-foreground hover:text-primary mb-6 inline-block">
        ← 返回图鉴
      </Link>
      <PokemonDetailClient
        pokemon={{
          id: pokemon.id,
          name: pokemon.name,
          nameZh: pokemon.nameZh,
          types: pokemon.types,
          baseStats: pokemon.baseStats,
          abilities: pokemon.abilities,
          sprite: pokemon.sprite,
          hasMega: pokemon.hasMega,
          megaForms: pokemon.megaForms,
        }}
        meta={meta as never}
      />
    </main>
  );
}
