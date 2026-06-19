"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { TypeBadge } from "@/components/pokemon/TypeBadge";
import type { PokemonType } from "@/lib/types";

// Placeholder data - will be loaded from static JSON
const POKEMON_LIST = [
  { id: 445, name: "garchomp", nameZh: "烈咬陆鲨", types: ["dragon", "ground"] as PokemonType[], usage: 45.2, tier: "S" },
  { id: 478, name: "froslass", nameZh: "雪妖女", types: ["ice", "ghost"] as PokemonType[], usage: 63.8, tier: "S", hasMega: true, isNewMega: true },
  { id: 530, name: "excadrill", nameZh: "龙头地鼠", types: ["ground", "steel"] as PokemonType[], usage: 52.1, tier: "S", hasMega: true, isNewMega: true },
  { id: 609, name: "chandelure", nameZh: "水晶灯火灵", types: ["ghost", "fire"] as PokemonType[], usage: 48.5, tier: "S", hasMega: true, isNewMega: true },
  { id: 612, name: "haxorus", nameZh: "双斧战龙", types: ["dragon"] as PokemonType[], usage: 41.3, tier: "S", hasMega: true, isNewMega: true },
  { id: 637, name: "volcarona", nameZh: "火神蛾", types: ["bug", "fire"] as PokemonType[], usage: 39.8, tier: "S", hasMega: true, isNewMega: true },
  { id: 6, name: "charizard", nameZh: "喷火龙", types: ["fire", "flying"] as PokemonType[], usage: 38.2, tier: "A", hasMega: true },
  { id: 376, name: "metagross", nameZh: "巨金怪", types: ["steel", "psychic"] as PokemonType[], usage: 36.5, tier: "A", hasMega: true },
  { id: 373, name: "salamence", nameZh: "暴飞龙", types: ["dragon", "flying"] as PokemonType[], usage: 35.1, tier: "A", hasMega: true },
  { id: 248, name: "tyranitar", nameZh: "班基拉斯", types: ["rock", "dark"] as PokemonType[], usage: 33.7, tier: "A", hasMega: true },
  { id: 94, name: "gengar", nameZh: "耿鬼", types: ["ghost", "poison"] as PokemonType[], usage: 31.2, tier: "A", hasMega: true },
  { id: 448, name: "lucario", nameZh: "路卡利欧", types: ["fighting", "steel"] as PokemonType[], usage: 29.8, tier: "A", hasMega: true },
  { id: 212, name: "scizor", nameZh: "巨钳螳螂", types: ["bug", "steel"] as PokemonType[], usage: 28.5, tier: "A", hasMega: true },
  { id: 130, name: "gyarados", nameZh: "暴鲤龙", types: ["water", "flying"] as PokemonType[], usage: 27.1, tier: "B", hasMega: true },
  { id: 149, name: "dragonite", nameZh: "快龙", types: ["dragon", "flying"] as PokemonType[], usage: 25.6, tier: "B" },
  { id: 663, name: "talonflame", nameZh: "烈箭鹰", types: ["fire", "flying"] as PokemonType[], usage: 24.3, tier: "B", hasMega: true, isNewMega: true },
  { id: 468, name: "togekiss", nameZh: "波克基斯", types: ["fairy", "flying"] as PokemonType[], usage: 22.9, tier: "B", hasMega: true, isNewMega: true },
  { id: 257, name: "blaziken", nameZh: "火焰鸡", types: ["fire", "fighting"] as PokemonType[], usage: 21.4, tier: "B", hasMega: true },
  { id: 59, name: "arcanine", nameZh: "风速犬", types: ["fire"] as PokemonType[], usage: 19.8, tier: "B", hasMega: true, isNewMega: true },
  { id: 350, name: "milotic", nameZh: "美纳斯", types: ["water"] as PokemonType[], usage: 18.2, tier: "B", hasMega: true, isNewMega: true },
];

const TYPE_FILTERS: PokemonType[] = [
  "normal", "fire", "water", "electric", "grass", "ice",
  "fighting", "poison", "ground", "flying", "psychic", "bug",
  "rock", "ghost", "dragon", "dark", "steel", "fairy",
];

export default function PokedexPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<PokemonType | "">("");
  const [tierFilter, setTierFilter] = useState<string>("");

  const filtered = useMemo(() => {
    let list = POKEMON_LIST;
    
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) => p.name.includes(q) || p.nameZh.includes(q) || p.id.toString() === q
      );
    }
    
    if (typeFilter) {
      list = list.filter((p) => p.types.includes(typeFilter));
    }
    
    if (tierFilter) {
      list = list.filter((p) => p.tier === tierFilter);
    }
    
    return list;
  }, [search, typeFilter, tierFilter]);

  return (
    <main className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-primary mb-6">📖 宝可梦图鉴</h1>

      {/* Filters */}
      <div className="space-y-3 mb-6">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="搜索宝可梦名称/编号..."
          className="max-w-sm bg-secondary"
        />
        
        {/* Type filter chips */}
        <div className="flex flex-wrap gap-1.5">
          <Badge
            variant={typeFilter === "" ? "default" : "secondary"}
            className="cursor-pointer text-xs"
            onClick={() => setTypeFilter("")}
          >
            全部
          </Badge>
          {TYPE_FILTERS.map((type) => (
            <span key={type} onClick={() => setTypeFilter(type === typeFilter ? "" : type)} className="cursor-pointer">
              <TypeBadge type={type} size="sm" />
            </span>
          ))}
        </div>

        {/* Tier filter */}
        <div className="flex gap-2">
          {["S", "A", "B", "C", "D"].map((tier) => (
            <Badge
              key={tier}
              variant={tierFilter === tier ? "default" : "secondary"}
              className="cursor-pointer"
              onClick={() => setTierFilter(tier === tierFilter ? "" : tier)}
            >
              Tier {tier}
            </Badge>
          ))}
        </div>
      </div>

      {/* Pokemon Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {filtered.map((pokemon) => (
          <Link
            key={pokemon.id}
            href={`/pokedex/${pokemon.name}`}
            className="group flex items-center gap-3 p-3 rounded-lg border border-border bg-card hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5"
          >
            <img
              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`}
              alt={pokemon.nameZh}
              className="w-14 h-14 group-hover:scale-110 transition-transform"
              loading="lazy"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm truncate">{pokemon.nameZh}</span>
                {pokemon.hasMega && (
                  <Badge variant="secondary" className="text-[9px] px-1 py-0 bg-purple-500/20 text-purple-300">
                    {pokemon.isNewMega ? "NEW M" : "M"}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-1 mt-1">
                {pokemon.types.map((t) => (
                  <TypeBadge key={t} type={t} size="sm" />
                ))}
              </div>
              <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                <span>#{pokemon.id}</span>
                <span>使用率 {pokemon.usage}%</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-muted-foreground py-12">
          没有找到匹配的宝可梦
        </p>
      )}
    </main>
  );
}
