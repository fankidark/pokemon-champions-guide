"use client";

import type { SPSpread } from "@/lib/types";
import { MAX_SP_PER_STAT, MAX_SP_TOTAL } from "@/lib/types";

interface SPSpreadEditorProps {
  spread: SPSpread;
  onChange: (spread: SPSpread) => void;
}

const STAT_LABELS = [
  { key: "hp", label: "HP", color: "bg-green-500" },
  { key: "atk", label: "攻击", color: "bg-red-500" },
  { key: "def", label: "防御", color: "bg-orange-400" },
  { key: "spa", label: "特攻", color: "bg-blue-500" },
  { key: "spd", label: "特防", color: "bg-purple-500" },
  { key: "spe", label: "速度", color: "bg-pink-500" },
] as const;

export function SPSpreadEditor({ spread, onChange }: SPSpreadEditorProps) {
  const totalUsed = Object.values(spread).reduce((sum, v) => sum + v, 0);
  const remaining = MAX_SP_TOTAL - totalUsed;

  const handleChange = (stat: keyof SPSpread, value: number) => {
    const clamped = Math.max(0, Math.min(MAX_SP_PER_STAT, value));
    const newSpread = { ...spread, [stat]: clamped };
    const newTotal = Object.values(newSpread).reduce((sum, v) => sum + v, 0);
    
    if (newTotal <= MAX_SP_TOTAL) {
      onChange(newSpread);
    } else {
      // Cap at max total
      const diff = newTotal - MAX_SP_TOTAL;
      newSpread[stat] = clamped - diff;
      if (newSpread[stat] >= 0) {
        onChange(newSpread);
      }
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>SP 分配</span>
        <span className={remaining < 0 ? "text-destructive" : ""}>
          剩余: {remaining}/{MAX_SP_TOTAL}
        </span>
      </div>
      
      {STAT_LABELS.map(({ key, label, color }) => (
        <div key={key} className="flex items-center gap-2">
          <span className="w-10 text-xs text-right">{label}</span>
          <div className="flex-1 relative">
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className={`h-full ${color} rounded-full transition-all`}
                style={{ width: `${(spread[key as keyof SPSpread] / MAX_SP_PER_STAT) * 100}%` }}
              />
            </div>
            <input
              type="range"
              min={0}
              max={MAX_SP_PER_STAT}
              value={spread[key as keyof SPSpread]}
              onChange={(e) => handleChange(key as keyof SPSpread, parseInt(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
          <input
            type="number"
            min={0}
            max={MAX_SP_PER_STAT}
            value={spread[key as keyof SPSpread]}
            onChange={(e) => handleChange(key as keyof SPSpread, parseInt(e.target.value) || 0)}
            className="w-12 text-center text-xs bg-secondary border border-border rounded px-1 py-0.5"
          />
        </div>
      ))}
    </div>
  );
}
