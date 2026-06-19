import fs from "fs";
import path from "path";

export interface PokemonData {
  id: number;
  name: string;
  nameZh: string;
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
  sprite: string;
  mega?: {
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
    ability: string;
    isNew?: boolean;
  };
  usage?: number;
  tier?: string;
}

export interface MoveData {
  id: number;
  name: string;
  type: string;
  category: string;
  power: number | null;
  accuracy: number | null;
  pp: number;
  priority: number;
  target: string;
  effectChance: number | null;
  description: string;
  championsChange?: string;
}

export interface BuildData {
  pokemon: string;
  tier: string;
  builds: {
    name: string;
    category: string;
    item: string;
    ability: string;
    nature: string;
    sp: Record<string, number>;
    moves: string[];
    description: string;
    matchups?: { favorable: string[]; unfavorable: string[] };
  }[];
}

function loadJSON<T>(filename: string): T {
  const filePath = path.join(process.cwd(), "data", filename);
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw);
}

let _pokemon: PokemonData[] | null = null;
let _moves: MoveData[] | null = null;
let _builds: BuildData[] | null = null;
let _namesZh: Record<string, string> | null = null;

export function getAllPokemon(): PokemonData[] {
  if (!_pokemon) {
    _pokemon = loadJSON<PokemonData[]>("pokemon.json");
    const namesZh = getNamesZh();
    // Apply Chinese names
    _pokemon = _pokemon.map((p) => ({
      ...p,
      nameZh: namesZh[p.name] || p.name,
    }));
  }
  return _pokemon;
}

export function getPokemonByName(name: string): PokemonData | undefined {
  return getAllPokemon().find((p) => p.name === name);
}

export function getAllMoves(): MoveData[] {
  if (!_moves) {
    _moves = loadJSON<MoveData[]>("moves.json");
  }
  return _moves;
}

export function getAllBuilds(): BuildData[] {
  if (!_builds) {
    _builds = loadJSON<BuildData[]>("builds.json");
  }
  return _builds;
}

export function getBuildsByPokemon(name: string): BuildData | undefined {
  return getAllBuilds().find((b) => b.pokemon === name);
}

export function getNamesZh(): Record<string, string> {
  if (!_namesZh) {
    _namesZh = loadJSON<Record<string, string>>("names-zh.json");
  }
  return _namesZh;
}

export function getMetaData() {
  return loadJSON<{
    lastUpdated: string;
    format: string;
    regulation: string;
    battleRules: Record<string, unknown>;
    itemRestrictions: Record<string, unknown>;
    statusChanges: Record<string, unknown>;
    topPokemon: unknown[];
  }>("meta.json");
}
