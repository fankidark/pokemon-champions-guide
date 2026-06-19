"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { TypeBadge } from "@/components/pokemon/TypeBadge";
import type { PokemonType } from "@/lib/types";

interface PokemonOption {
  id: number;
  name: string;
  nameZh: string;
  types: PokemonType[];
  sprite: string;
}

interface PokemonSelectorProps {
  pokemon: PokemonOption[];
  selected: string;
  onSelect: (name: string) => void;
  label: string;
}

export function PokemonSelector({ pokemon, selected, onSelect, label }: PokemonSelectorProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const filtered = useMemo(() => {
    if (!query) return pokemon.slice(0, 20);
    const q = query.toLowerCase();
    return pokemon
      .filter(
        (p) =>
          p.name.includes(q) ||
          p.nameZh.includes(q) ||
          p.id.toString() === q
      )
      .slice(0, 20);
  }, [query, pokemon]);

  const selectedPokemon = pokemon.find((p) => p.name === selected);

  return (
    <div className="relative">
      <label className="text-xs text-muted-foreground mb-1 block">{label}</label>
      <div className="flex items-center gap-2">
        {selectedPokemon && (
          <img
            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${selectedPokemon.id}.png`}
            alt={selectedPokemon.nameZh}
            className="w-10 h-10"
          />
        )}
        <Input
          value={query || (selectedPokemon?.nameZh ?? "")}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          placeholder="搜索宝可梦..."
          className="bg-secondary"
        />
      </div>
      
      {isOpen && filtered.length > 0 && (
        <div className="absolute z-50 mt-1 w-full max-h-60 overflow-y-auto rounded-md border border-border bg-popover shadow-lg">
          {filtered.map((p) => (
            <button
              key={p.id}
              className="flex items-center gap-2 w-full px-3 py-2 hover:bg-accent text-left text-sm"
              onMouseDown={() => {
                onSelect(p.name);
                setQuery("");
                setIsOpen(false);
              }}
            >
              <img
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.id}.png`}
                alt={p.nameZh}
                className="w-8 h-8"
              />
              <span className="font-medium">{p.nameZh}</span>
              <span className="text-muted-foreground text-xs">{p.name}</span>
              <div className="ml-auto flex gap-1">
                {p.types.map((t) => (
                  <TypeBadge key={t} type={t} size="sm" />
                ))}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
