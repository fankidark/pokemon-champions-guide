import { PokemonType } from "@/lib/types";
import { TYPE_COLORS } from "@/lib/utils/type-chart";

const TYPE_NAMES_ZH: Record<PokemonType, string> = {
  normal: "一般", fire: "火", water: "水", electric: "电",
  grass: "草", ice: "冰", fighting: "格斗", poison: "毒",
  ground: "地面", flying: "飞行", psychic: "超能", bug: "虫",
  rock: "岩石", ghost: "幽灵", dragon: "龙", dark: "恶",
  steel: "钢", fairy: "妖精",
};

interface TypeBadgeProps {
  type: PokemonType;
  size?: "sm" | "md" | "lg";
}

export function TypeBadge({ type, size = "md" }: TypeBadgeProps) {
  const sizeClasses = {
    sm: "px-1.5 py-0.5 text-[10px]",
    md: "px-2 py-0.5 text-xs",
    lg: "px-3 py-1 text-sm",
  };

  return (
    <span
      className={`inline-flex items-center rounded font-medium text-white ${sizeClasses[size]}`}
      style={{ backgroundColor: TYPE_COLORS[type] }}
    >
      {TYPE_NAMES_ZH[type]}
    </span>
  );
}
