"use client";

import { useState, useCallback, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PokemonSelector } from "@/components/calc/PokemonSelector";
import { SPSpreadEditor } from "@/components/calc/SPSpreadEditor";
import { DamageResult } from "@/components/calc/DamageResult";
import { useCalcStore } from "@/stores/calc-store";
import { calculateDamage, type CalcResult } from "@/lib/calc/engine";
import type { PokemonType, SPSpread } from "@/lib/types";

// Will be loaded from static JSON in production
// For now, use a small inline dataset for development
const SAMPLE_POKEMON = [
  { id: 445, name: "garchomp", nameZh: "烈咬陆鲨", types: ["dragon", "ground"] as PokemonType[] },
  { id: 6, name: "charizard", nameZh: "喷火龙", types: ["fire", "flying"] as PokemonType[] },
  { id: 94, name: "gengar", nameZh: "耿鬼", types: ["ghost", "poison"] as PokemonType[] },
  { id: 376, name: "metagross", nameZh: "巨金怪", types: ["steel", "psychic"] as PokemonType[] },
  { id: 248, name: "tyranitar", nameZh: "班基拉斯", types: ["rock", "dark"] as PokemonType[] },
  { id: 130, name: "gyarados", nameZh: "暴鲤龙", types: ["water", "flying"] as PokemonType[] },
  { id: 373, name: "salamence", nameZh: "暴飞龙", types: ["dragon", "flying"] as PokemonType[] },
  { id: 448, name: "lucario", nameZh: "路卡利欧", types: ["fighting", "steel"] as PokemonType[] },
  { id: 212, name: "scizor", nameZh: "巨钳螳螂", types: ["bug", "steel"] as PokemonType[] },
  { id: 149, name: "dragonite", nameZh: "快龙", types: ["dragon", "flying"] as PokemonType[] },
  { id: 478, name: "froslass", nameZh: "雪妖女", types: ["ice", "ghost"] as PokemonType[] },
  { id: 530, name: "excadrill", nameZh: "龙头地鼠", types: ["ground", "steel"] as PokemonType[] },
  { id: 663, name: "talonflame", nameZh: "烈箭鹰", types: ["fire", "flying"] as PokemonType[] },
  { id: 612, name: "haxorus", nameZh: "双斧战龙", types: ["dragon"] as PokemonType[] },
  { id: 468, name: "togekiss", nameZh: "波克基斯", types: ["fairy", "flying"] as PokemonType[] },
  { id: 59, name: "arcanine", nameZh: "风速犬", types: ["fire"] as PokemonType[] },
  { id: 350, name: "milotic", nameZh: "美纳斯", types: ["water"] as PokemonType[] },
  { id: 609, name: "chandelure", nameZh: "水晶灯火灵", types: ["ghost", "fire"] as PokemonType[] },
  { id: 637, name: "volcarona", nameZh: "火神蛾", types: ["bug", "fire"] as PokemonType[] },
  { id: 257, name: "blaziken", nameZh: "火焰鸡", types: ["fire", "fighting"] as PokemonType[] },
].map((p) => ({ ...p, sprite: "" }));

const NATURES = [
  "Hardy", "Lonely", "Brave", "Adamant", "Naughty",
  "Bold", "Docile", "Relaxed", "Impish", "Lax",
  "Timid", "Hasty", "Serious", "Jolly", "Naive",
  "Modest", "Mild", "Quiet", "Bashful", "Rash",
  "Calm", "Gentle", "Sassy", "Careful", "Quirky",
];

const WEATHER_OPTIONS = [
  { value: "", label: "无天气" },
  { value: "Sun", label: "☀️ 晴天" },
  { value: "Rain", label: "🌧️ 雨天" },
  { value: "Sand", label: "🏜️ 沙暴" },
  { value: "Snow", label: "❄️ 雪天" },
];

const TERRAIN_OPTIONS = [
  { value: "", label: "无地形" },
  { value: "Electric", label: "⚡ 电气场地" },
  { value: "Grassy", label: "🌿 青草场地" },
  { value: "Psychic", label: "🔮 精神场地" },
  { value: "Misty", label: "🌫️ 薄雾场地" },
];

export default function CalcPage() {
  const {
    attacker, defender, field,
    setAttacker, setDefender, setField, swapSides,
  } = useCalcStore();

  const [result, setResult] = useState<CalcResult | null>(null);
  const [selectedMove, setSelectedMove] = useState("");

  const doCalc = useCallback(() => {
    if (!attacker.name || !defender.name || !selectedMove) {
      setResult(null);
      return;
    }

    try {
      const calcResult = calculateDamage({
        attacker: {
          name: attacker.name,
          nature: attacker.nature,
          ability: attacker.ability || undefined,
          item: attacker.item || undefined,
          sp: attacker.sp,
        },
        defender: {
          name: defender.name,
          nature: defender.nature,
          ability: defender.ability || undefined,
          item: defender.item || undefined,
          sp: defender.sp,
        },
        move: selectedMove,
        field: {
          weather: field.weather as any || undefined,
          terrain: field.terrain as any || undefined,
          isDoubles: field.isDoubles,
        },
      });
      setResult(calcResult);
    } catch (err) {
      console.error("Calc error:", err);
      setResult(null);
    }
  }, [attacker, defender, selectedMove, field]);

  // Auto-calculate when inputs change
  useEffect(() => {
    doCalc();
  }, [doCalc]);

  return (
    <main className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-primary mb-6">🔢 伤害计算器</h1>

      {/* Field conditions */}
      <Card className="mb-4">
        <CardContent className="flex flex-wrap gap-4 py-3">
          <div className="flex items-center gap-2">
            <Select value={field.weather} onValueChange={(v) => setField({ weather: v ?? "" })}>
              <SelectTrigger className="w-32 h-8 text-xs">
                <SelectValue placeholder="天气" />
              </SelectTrigger>
              <SelectContent>
                {WEATHER_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value || "none"}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Select value={field.terrain} onValueChange={(v) => setField({ terrain: v ?? "" })}>
              <SelectTrigger className="w-36 h-8 text-xs">
                <SelectValue placeholder="地形" />
              </SelectTrigger>
              <SelectContent>
                {TERRAIN_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value || "none"}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Badge variant={field.isDoubles ? "default" : "secondary"} className="cursor-pointer h-8"
            onClick={() => setField({ isDoubles: !field.isDoubles })}>
            {field.isDoubles ? "双打" : "单打"}
          </Badge>
        </CardContent>
      </Card>

      {/* Main layout: Attacker | Result | Defender */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-4">
        {/* Attacker Panel */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              ⚔️ 攻击方
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <PokemonSelector
              pokemon={SAMPLE_POKEMON}
              selected={attacker.name}
              onSelect={(name) => setAttacker({ name })}
              label=""
            />
            <div className="grid grid-cols-2 gap-2">
              <Select value={attacker.nature} onValueChange={(v) => setAttacker({ nature: v ?? "Hardy" })}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="性格" />
                </SelectTrigger>
                <SelectContent>
                  {NATURES.map((n) => (
                    <SelectItem key={n} value={n}>{n}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedMove} onValueChange={(v) => setSelectedMove(v ?? "")}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="招式" />
                </SelectTrigger>
                <SelectContent>
                  {["Earthquake", "Dragon Claw", "Stone Edge", "Fire Blast",
                    "Ice Beam", "Thunderbolt", "Close Combat", "Shadow Ball",
                    "Bullet Punch", "Brave Bird", "Flare Blitz", "Outrage",
                    "Draco Meteor", "Hydro Pump", "Iron Head", "Knock Off",
                    "U-turn", "Volt Switch", "Protect", "Sucker Punch"
                  ].map((m) => (
                    <SelectItem key={m} value={m}>{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <SPSpreadEditor
              spread={attacker.sp}
              onChange={(sp) => setAttacker({ sp })}
            />
          </CardContent>
        </Card>

        {/* Center: Result + Swap button */}
        <div className="flex flex-col items-center justify-center gap-4 lg:px-4">
          <Button variant="outline" size="sm" onClick={swapSides} className="rotate-90 lg:rotate-0">
            ⇄
          </Button>
          <DamageResult result={result} defenderName={defender.name} />
        </div>

        {/* Defender Panel */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              🛡️ 防御方
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <PokemonSelector
              pokemon={SAMPLE_POKEMON}
              selected={defender.name}
              onSelect={(name) => setDefender({ name })}
              label=""
            />
            <div className="grid grid-cols-2 gap-2">
              <Select value={defender.nature} onValueChange={(v) => setDefender({ nature: v ?? "Hardy" })}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="性格" />
                </SelectTrigger>
                <SelectContent>
                  {NATURES.map((n) => (
                    <SelectItem key={n} value={n}>{n}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <SPSpreadEditor
              spread={defender.sp}
              onChange={(sp) => setDefender({ sp })}
            />
          </CardContent>
        </Card>
      </div>

      {/* Usage tips */}
      <Card className="mt-6">
        <CardContent className="py-4">
          <p className="text-xs text-muted-foreground">
            💡 提示：Champions 使用 SP 系统（最大 32/项，总共 66），等级固定 50，无太晶化。
            Reg M-A 禁止命玉/讲究系/突击背心。计算基于 @smogon/calc 引擎。
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
