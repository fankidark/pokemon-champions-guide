// Pokemon Champions - Core Types

export type PokemonType =
  | "normal" | "fire" | "water" | "electric" | "grass" | "ice"
  | "fighting" | "poison" | "ground" | "flying" | "psychic" | "bug"
  | "rock" | "ghost" | "dragon" | "dark" | "steel" | "fairy";

export interface StatSpread {
  hp: number;
  atk: number;
  def: number;
  spa: number;
  spd: number;
  spe: number;
}

export interface SPSpread {
  hp: number;   // 0-32
  atk: number;  // 0-32
  def: number;  // 0-32
  spa: number;  // 0-32
  spd: number;  // 0-32
  spe: number;  // 0-32
}

export const MAX_SP_TOTAL = 66;
export const MAX_SP_PER_STAT = 32;

export interface MegaEvolution {
  name: string;
  megaStone: string;
  types: [PokemonType, PokemonType?];
  baseStats: StatSpread;
  ability: string;
  isChampionsExclusive: boolean;
}

export interface ChampionsPokemon {
  id: number;
  name: string;
  nameZh: string;
  nameJa?: string;
  types: [PokemonType, PokemonType?];
  baseStats: StatSpread;
  abilities: {
    normal: string[];
    hidden?: string;
  };
  megaEvolutions?: MegaEvolution[];
  learnset: string[];
  tier?: "S" | "A" | "B" | "C" | "D";
  meta?: PokemonMeta;
}

export interface PokemonMeta {
  usage: number;
  topMoves: { name: string; usage: number }[];
  topItems: { name: string; usage: number }[];
  topAbilities: { name: string; usage: number }[];
  topSpreads: SpreadEntry[];
  topTeammates: { name: string; usage: number }[];
}

export interface SpreadEntry {
  nature: string;
  sp: SPSpread;
  usage: number;
}

export interface ChampionsMove {
  name: string;
  nameZh: string;
  type: PokemonType;
  category: "Physical" | "Special" | "Status";
  basePower: number;
  accuracy: number;
  pp: number;
  priority: number;
  target: string;
  description: string;
  competitiveNotes?: string;
  championsChange?: {
    type: "buffed" | "nerfed" | "reworked" | "removed" | "new";
    details: string;
    oldValue?: string;
    newValue?: string;
  };
}

export interface ChampionsItem {
  name: string;
  nameZh: string;
  category: "berry" | "mega_stone" | "choice" | "boost" | "protection" | "utility" | "held";
  description: string;
  effect: string;
  competitiveNotes?: string;
  regulation: {
    mA: boolean;
    mB: boolean;
  };
}

export type BuildCategory = "meta" | "offensive" | "defensive" | "tech" | "creative";

export interface PokemonBuild {
  id: string;
  pokemonName: string;
  buildName: string;
  category: BuildCategory;
  nature: string;
  ability: string;
  item: string;
  spSpread: SPSpread;
  moves: [string, string, string, string];
  teraType?: PokemonType;
  megaStone?: string;
  overview: string;
  moveExplanations: Record<string, {
    reason: string;
    alternatives: string[];
    usage: string;
  }>;
  itemExplanation: {
    reason: string;
    alternatives: string[];
    synergy: string;
  };
  spExplanation: {
    keyBenchmarks: string[];
    tradeoffs: string;
  };
  gamePlan: string;
  keyMatchups: {
    favorable: { pokemon: string; notes: string }[];
    unfavorable: { pokemon: string; notes: string }[];
  };
  usageRate?: number;
  lastUpdated: string;
}
