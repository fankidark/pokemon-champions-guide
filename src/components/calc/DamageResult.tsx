"use client";

import type { CalcResult } from "@/lib/calc/engine";

interface DamageResultProps {
  result: CalcResult | null;
  defenderName?: string;
}

function getDamageColor(maxPercent: number): string {
  if (maxPercent >= 100) return "text-red-500"; // OHKO
  if (maxPercent >= 60) return "text-orange-400"; // High
  if (maxPercent >= 30) return "text-yellow-400"; // Medium
  return "text-green-400"; // Low
}

function getDamageBg(maxPercent: number): string {
  if (maxPercent >= 100) return "bg-red-500/10 border-red-500/30";
  if (maxPercent >= 60) return "bg-orange-400/10 border-orange-400/30";
  if (maxPercent >= 30) return "bg-yellow-400/10 border-yellow-400/30";
  return "bg-green-400/10 border-green-400/30";
}

export function DamageResult({ result, defenderName }: DamageResultProps) {
  if (!result) {
    return (
      <div className="text-center text-muted-foreground py-8">
        <p className="text-sm">选择攻击方和防御方开始计算</p>
      </div>
    );
  }

  const maxPercent = result.percentage[1];
  const colorClass = getDamageColor(maxPercent);
  const bgClass = getDamageBg(maxPercent);

  return (
    <div className={`rounded-lg border p-4 space-y-3 ${bgClass}`}>
      {/* Percentage display */}
      <div className="text-center">
        <div className={`text-3xl font-bold ${colorClass}`}>
          {result.percentage[0].toFixed(1)}% - {result.percentage[1].toFixed(1)}%
        </div>
        <div className="text-sm text-muted-foreground mt-1">
          {result.damage[0]} - {result.damage[1]} HP
        </div>
      </div>

      {/* KO Chance */}
      <div className="text-center">
        <span className={`text-sm font-medium ${colorClass}`}>
          {result.koChance}
        </span>
      </div>

      {/* HP Bar visualization */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{defenderName || "防御方"}</span>
          <span>{Math.max(0, 100 - maxPercent).toFixed(0)}% 剩余</span>
        </div>
        <div className="h-4 bg-secondary rounded-full overflow-hidden relative">
          {/* Remaining HP */}
          <div
            className="h-full bg-green-500 rounded-full transition-all"
            style={{ width: `${Math.max(0, 100 - maxPercent)}%` }}
          />
          {/* Damage range indicator */}
          <div
            className="absolute top-0 h-full bg-red-500/50 transition-all"
            style={{
              left: `${Math.max(0, 100 - maxPercent)}%`,
              width: `${Math.min(maxPercent, 100) - Math.max(0, result.percentage[0])}%`,
            }}
          />
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-muted-foreground text-center break-words">
        {result.description}
      </p>
    </div>
  );
}
