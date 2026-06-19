/**
 * Fetch Pokemon data from PokeAPI
 * Output: data/raw/pokeapi-pokemon.json, data/raw/pokeapi-moves.json, data/raw/pokeapi-abilities.json
 * 
 * Usage: npx tsx scripts/fetch-pokeapi.ts
 */

import * as fs from "fs";
import * as path from "path";

const API_BASE = "https://pokeapi.co/api/v2";
const OUTPUT_DIR = path.join(__dirname, "..", "data", "raw");
const DELAY_MS = 100; // Be nice to PokeAPI

// Champions uses Gen 1-8 fully evolved Pokemon (+ some exceptions like Pikachu)
// Total pool: ~400 species
const MAX_DEX_NUMBER = 905; // Up to Gen 8 (Enamorus)

interface PokemonData {
  id: number;
  name: string;
  types: string[];
  baseStats: {
    hp: number;
    atk: number;
    def: number;
    spa: number;
    spd: number;
    spe: number;
  };
  abilities: {
    normal: string[];
    hidden: string | null;
  };
  height: number;
  weight: number;
  sprite: string;
}

interface MoveData {
  id: number;
  name: string;
  type: string;
  category: "physical" | "special" | "status";
  power: number | null;
  accuracy: number | null;
  pp: number;
  priority: number;
  target: string;
  effectChance: number | null;
  description: string;
}

interface AbilityData {
  id: number;
  name: string;
  description: string;
  pokemon: string[];
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchJSON<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${url}`);
  }
  return response.json() as Promise<T>;
}

async function fetchPokemonList(): Promise<PokemonData[]> {
  console.log("Fetching Pokemon list...");
  const results: PokemonData[] = [];
  
  // Fetch in batches
  const batchSize = 50;
  for (let offset = 0; offset < MAX_DEX_NUMBER; offset += batchSize) {
    const limit = Math.min(batchSize, MAX_DEX_NUMBER - offset);
    const listUrl = `${API_BASE}/pokemon?offset=${offset}&limit=${limit}`;
    const list = await fetchJSON<{ results: { name: string; url: string }[] }>(listUrl);
    
    for (const entry of list.results) {
      try {
        const pokemon = await fetchJSON<any>(entry.url);
        
        const data: PokemonData = {
          id: pokemon.id,
          name: pokemon.name,
          types: pokemon.types.map((t: any) => t.type.name),
          baseStats: {
            hp: pokemon.stats[0].base_stat,
            atk: pokemon.stats[1].base_stat,
            def: pokemon.stats[2].base_stat,
            spa: pokemon.stats[3].base_stat,
            spd: pokemon.stats[4].base_stat,
            spe: pokemon.stats[5].base_stat,
          },
          abilities: {
            normal: pokemon.abilities
              .filter((a: any) => !a.is_hidden)
              .map((a: any) => a.ability.name),
            hidden: pokemon.abilities.find((a: any) => a.is_hidden)?.ability.name || null,
          },
          height: pokemon.height,
          weight: pokemon.weight,
          sprite: pokemon.sprites.other["official-artwork"].front_default || "",
        };
        
        results.push(data);
        
        if (results.length % 100 === 0) {
          console.log(`  Fetched ${results.length}/${MAX_DEX_NUMBER} Pokemon`);
        }
        
        await sleep(DELAY_MS);
      } catch (err) {
        console.warn(`  Failed to fetch ${entry.name}: ${err}`);
      }
    }
  }
  
  return results;
}

async function fetchMoveList(): Promise<MoveData[]> {
  console.log("Fetching Moves...");
  const results: MoveData[] = [];
  
  // Get total count
  const initial = await fetchJSON<{ count: number }>(`${API_BASE}/move?limit=1`);
  const total = initial.count;
  
  const batchSize = 50;
  for (let offset = 0; offset < total; offset += batchSize) {
    const limit = Math.min(batchSize, total - offset);
    const list = await fetchJSON<{ results: { name: string; url: string }[] }>(
      `${API_BASE}/move?offset=${offset}&limit=${limit}`
    );
    
    for (const entry of list.results) {
      try {
        const move = await fetchJSON<any>(entry.url);
        
        // Only include moves that exist in Gen 6+ (relevant to Champions)
        if (move.generation?.name && parseInt(move.generation.name.split("-")[1]) > 8) {
          continue; // Skip Gen 9+ exclusive moves (unless Champions adds them)
        }
        
        const effectEntry = move.effect_entries?.find((e: any) => e.language.name === "en");
        
        results.push({
          id: move.id,
          name: move.name,
          type: move.type.name,
          category: move.damage_class.name,
          power: move.power,
          accuracy: move.accuracy,
          pp: move.pp,
          priority: move.priority,
          target: move.target.name,
          effectChance: move.effect_chance,
          description: effectEntry?.short_effect || "",
        });
        
        await sleep(DELAY_MS);
      } catch (err) {
        console.warn(`  Failed to fetch move ${entry.name}: ${err}`);
      }
    }
    
    if (offset % 200 === 0) {
      console.log(`  Fetched ${results.length} moves (offset ${offset}/${total})`);
    }
  }
  
  return results;
}

async function fetchAbilityList(): Promise<AbilityData[]> {
  console.log("Fetching Abilities...");
  const results: AbilityData[] = [];
  
  const initial = await fetchJSON<{ count: number }>(`${API_BASE}/ability?limit=1`);
  const total = initial.count;
  
  const batchSize = 50;
  for (let offset = 0; offset < total; offset += batchSize) {
    const limit = Math.min(batchSize, total - offset);
    const list = await fetchJSON<{ results: { name: string; url: string }[] }>(
      `${API_BASE}/ability?offset=${offset}&limit=${limit}`
    );
    
    for (const entry of list.results) {
      try {
        const ability = await fetchJSON<any>(entry.url);
        const effectEntry = ability.effect_entries?.find((e: any) => e.language.name === "en");
        
        results.push({
          id: ability.id,
          name: ability.name,
          description: effectEntry?.short_effect || "",
          pokemon: ability.pokemon?.map((p: any) => p.pokemon.name) || [],
        });
        
        await sleep(DELAY_MS);
      } catch (err) {
        console.warn(`  Failed to fetch ability ${entry.name}: ${err}`);
      }
    }
    
    if (offset % 100 === 0) {
      console.log(`  Fetched ${results.length} abilities (offset ${offset}/${total})`);
    }
  }
  
  return results;
}

async function main() {
  // Ensure output directory exists
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  
  console.log("=== PokeAPI Data Fetch ===\n");
  
  // Fetch Pokemon
  const pokemon = await fetchPokemonList();
  const pokemonPath = path.join(OUTPUT_DIR, "pokeapi-pokemon.json");
  fs.writeFileSync(pokemonPath, JSON.stringify(pokemon, null, 2));
  console.log(`\n✓ Saved ${pokemon.length} Pokemon to ${pokemonPath}`);
  
  // Fetch Moves
  const moves = await fetchMoveList();
  const movesPath = path.join(OUTPUT_DIR, "pokeapi-moves.json");
  fs.writeFileSync(movesPath, JSON.stringify(moves, null, 2));
  console.log(`✓ Saved ${moves.length} Moves to ${movesPath}`);
  
  // Fetch Abilities
  const abilities = await fetchAbilityList();
  const abilitiesPath = path.join(OUTPUT_DIR, "pokeapi-abilities.json");
  fs.writeFileSync(abilitiesPath, JSON.stringify(abilities, null, 2));
  console.log(`✓ Saved ${abilities.length} Abilities to ${abilitiesPath}`);
  
  console.log("\n=== Done ===");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
