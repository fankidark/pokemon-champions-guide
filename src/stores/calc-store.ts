import { create } from "zustand";
import type { SPSpread } from "@/lib/types";

interface PokemonState {
  name: string;
  nature: string;
  ability: string;
  item: string;
  sp: SPSpread;
  moves: [string, string, string, string];
  boosts: Record<string, number>;
  isMega: boolean;
}

const defaultPokemon: PokemonState = {
  name: "",
  nature: "Hardy",
  ability: "",
  item: "",
  sp: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
  moves: ["", "", "", ""],
  boosts: {},
  isMega: false,
};

interface CalcStore {
  attacker: PokemonState;
  defender: PokemonState;
  field: {
    weather: string;
    terrain: string;
    isDoubles: boolean;
    attackerSide: Record<string, boolean>;
    defenderSide: Record<string, boolean | number>;
  };
  setAttacker: (partial: Partial<PokemonState>) => void;
  setDefender: (partial: Partial<PokemonState>) => void;
  setField: (partial: Partial<CalcStore["field"]>) => void;
  swapSides: () => void;
  reset: () => void;
}

export const useCalcStore = create<CalcStore>((set) => ({
  attacker: { ...defaultPokemon },
  defender: { ...defaultPokemon },
  field: {
    weather: "",
    terrain: "",
    isDoubles: true, // Champions is doubles
    attackerSide: {},
    defenderSide: {},
  },
  setAttacker: (partial) =>
    set((state) => ({ attacker: { ...state.attacker, ...partial } })),
  setDefender: (partial) =>
    set((state) => ({ defender: { ...state.defender, ...partial } })),
  setField: (partial) =>
    set((state) => ({ field: { ...state.field, ...partial } })),
  swapSides: () =>
    set((state) => ({ attacker: state.defender, defender: state.attacker })),
  reset: () =>
    set({ attacker: { ...defaultPokemon }, defender: { ...defaultPokemon } }),
}));
