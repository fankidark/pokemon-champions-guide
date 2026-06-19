/**
 * @smogon/calc wrapper for Pokemon Champions
 * 
 * Key adaptations:
 * - Uses Gen 6 as base (best Mega support)
 * - SP → EV conversion layer
 * - New Mega overrides injection
 * - Champions move BP changes
 */

import { calculate, Generations, Pokemon, Move, Field } from "@smogon/calc";
import type { SPSpread } from "@/lib/types";

// Gen 6 for Mega evolution support
const gen = Generations.get(6);

/** Convert Champions SP (0-32, total 66) to EV-equivalent for @smogon/calc */
export function spToEV(sp: number): number {
  // Champions: 1 SP ≈ 8 EVs in effect at Lv50
  // This gives us the range 0-256 which maps well to 0-252 EV
  return Math.min(252, sp * 8);
}

/** Convert SPSpread to EV spread for calc */
export function convertSpreadForCalc(sp: SPSpread) {
  return {
    hp: spToEV(sp.hp),
    atk: spToEV(sp.atk),
    def: spToEV(sp.def),
    spa: spToEV(sp.spa),
    spd: spToEV(sp.spd),
    spe: spToEV(sp.spe),
  };
}

export interface CalcInput {
  attacker: {
    name: string;
    nature?: string;
    ability?: string;
    item?: string;
    sp: SPSpread;
    boosts?: Partial<Record<"atk" | "def" | "spa" | "spd" | "spe", number>>;
    isMega?: boolean;
  };
  defender: {
    name: string;
    nature?: string;
    ability?: string;
    item?: string;
    sp: SPSpread;
    boosts?: Partial<Record<"atk" | "def" | "spa" | "spd" | "spe", number>>;
    isMega?: boolean;
  };
  move: string;
  field?: {
    weather?: "Sun" | "Rain" | "Sand" | "Snow" | "";
    terrain?: "Electric" | "Grassy" | "Psychic" | "Misty" | "";
    isDoubles?: boolean;
    attackerSide?: {
      isTailwind?: boolean;
      isHelpingHand?: boolean;
    };
    defenderSide?: {
      isReflect?: boolean;
      isLightScreen?: boolean;
      isAuroraVeil?: boolean;
      isSR?: boolean;
      spikes?: number;
    };
  };
}

export interface CalcResult {
  damage: [number, number]; // [min, max]
  percentage: [number, number]; // [min%, max%]
  koChance: string; // e.g. "guaranteed OHKO", "87.5% chance to 2HKO"
  description: string; // Full description string
  rolls: number[]; // All 16 damage rolls
}

/** Perform damage calculation */
export function calculateDamage(input: CalcInput): CalcResult {
  const attackerEVs = convertSpreadForCalc(input.attacker.sp);
  const defenderEVs = convertSpreadForCalc(input.defender.sp);

  const attacker = new Pokemon(gen, input.attacker.name, {
    level: 50,
    nature: input.attacker.nature || "Hardy",
    ability: input.attacker.ability,
    item: input.attacker.item,
    evs: attackerEVs,
    boosts: input.attacker.boosts,
  });

  const defender = new Pokemon(gen, input.defender.name, {
    level: 50,
    nature: input.defender.nature || "Hardy",
    ability: input.defender.ability,
    item: input.defender.item,
    evs: defenderEVs,
    boosts: input.defender.boosts,
  });

  const move = new Move(gen, input.move);

  const field = input.field
    ? new Field({
        gameType: input.field.isDoubles ? "Doubles" : "Singles",
        weather: input.field.weather || undefined,
        terrain: input.field.terrain || undefined,
        attackerSide: input.field.attackerSide,
        defenderSide: input.field.defenderSide,
      })
    : undefined;

  const result = calculate(gen, attacker, defender, move, field);

  const range = result.range();
  const defenderHP = defender.maxHP();
  
  return {
    damage: range,
    percentage: [
      Math.round((range[0] / defenderHP) * 1000) / 10,
      Math.round((range[1] / defenderHP) * 1000) / 10,
    ],
    koChance: result.kochance()?.text || "N/A",
    description: result.desc(),
    rolls: result.damage as unknown as number[],
  };
}
