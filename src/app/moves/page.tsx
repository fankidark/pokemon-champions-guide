"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { TypeBadge } from "@/components/pokemon/TypeBadge";
import type { PokemonType } from "@/lib/types";

interface MoveEntry {
  id: number;
  name: string;
  nameZh: string;
  type: PokemonType;
  category: "Physical" | "Special" | "Status";
  power: number | null;
  accuracy: number | null;
  pp: number;
  priority: number;
  description: string;
  championsChange?: { type: string; details: string };
}

// Sample moves data
const MOVES_LIST: MoveEntry[] = [
  { id: 89, name: "earthquake", nameZh: "地震", type: "ground", category: "Physical", power: 100, accuracy: 100, pp: 10, priority: 0, description: "对场上所有相邻宝可梦造成伤害。双打时伤害75%。" },
  { id: 337, name: "dragon-claw", nameZh: "龙爪", type: "dragon", category: "Physical", power: 80, accuracy: 100, pp: 15, priority: 0, description: "用锐利的巨爪劈开对手。", championsChange: { type: "buff", details: "现在受到锋利(Sharpness)特性加成 +50%" } },
  { id: 394, name: "flare-blitz", nameZh: "闪焰冲锋", type: "fire", category: "Physical", power: 120, accuracy: 100, pp: 15, priority: 0, description: "全身包裹火焰猛撞。自己受到1/3反伤。10%概率灼伤。" },
  { id: 58, name: "ice-beam", nameZh: "冰冻光线", type: "ice", category: "Special", power: 90, accuracy: 100, pp: 10, priority: 0, description: "向对手发射冰冻光束。10%概率冻结。" },
  { id: 85, name: "thunderbolt", nameZh: "十万伏特", type: "electric", category: "Special", power: 90, accuracy: 100, pp: 15, priority: 0, description: "向对手发射强电击。10%概率麻痹。" },
  { id: 370, name: "close-combat", nameZh: "近身战", type: "fighting", category: "Physical", power: 120, accuracy: 100, pp: 5, priority: 0, description: "舍弃防守全力攻击。自身防御和特防降低1级。" },
  { id: 247, name: "shadow-ball", nameZh: "暗影球", type: "ghost", category: "Special", power: 80, accuracy: 100, pp: 15, priority: 0, description: "投掷影子团块。20%概率降低对手特防1级。" },
  { id: 442, name: "iron-head", nameZh: "铁头", type: "steel", category: "Physical", power: 80, accuracy: 100, pp: 15, priority: 0, description: "用钢铁般坚硬的头猛撞。30%概率使对手畏缩。" },
  { id: 269, name: "fake-out", nameZh: "击掌奇袭", type: "normal", category: "Physical", power: 40, accuracy: 100, pp: 10, priority: 3, description: "上场第一回合先制攻击，必定使对手畏缩。", championsChange: { type: "nerf", details: "每次上场只能使用一次，使用后不能再次选择" } },
  { id: 182, name: "protect", nameZh: "守住", type: "normal", category: "Status", power: null, accuracy: null, pp: 10, priority: 4, description: "本回合完全保护自己不受攻击。连续使用成功率降低。" },
  { id: 421, name: "shadow-claw", nameZh: "暗影爪", type: "ghost", category: "Physical", power: 70, accuracy: 100, pp: 15, priority: 0, description: "以影子形成的锐爪劈开对手。急所率+1。", championsChange: { type: "buff", details: "现在受到锋利(Sharpness)特性加成 +50%" } },
  { id: 304, name: "hyper-beam", nameZh: "破坏光线", type: "normal", category: "Special", power: 150, accuracy: 90, pp: 5, priority: 0, description: "发射强力光束。下一回合必须休息。" },
  { id: 434, name: "draco-meteor", nameZh: "流星群", type: "dragon", category: "Special", power: 130, accuracy: 90, pp: 5, priority: 0, description: "召唤陨石。使用后自身特攻降低2级。" },
  { id: 56, name: "hydro-pump", nameZh: "水炮", type: "water", category: "Special", power: 110, accuracy: 80, pp: 5, priority: 0, description: "以强大水压喷射。" },
  { id: 428, name: "u-turn", nameZh: "急速折返", type: "bug", category: "Physical", power: 70, accuracy: 100, pp: 20, priority: 0, description: "攻击后立即交换宝可梦。" },
  { id: 369, name: "knock-off", nameZh: "打落", type: "dark", category: "Physical", power: 65, accuracy: 100, pp: 20, priority: 0, description: "打落对手道具。对手持有道具时伤害1.5倍。" },
];

const CATEGORY_ICONS: Record<string, string> = {
  Physical: "💥",
  Special: "✨",
  Status: "📋",
};

export default function MovesPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<PokemonType | "">("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const filtered = useMemo(() => {
    let list = MOVES_LIST;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((m) => m.name.includes(q) || m.nameZh.includes(q));
    }
    if (typeFilter) list = list.filter((m) => m.type === typeFilter);
    if (categoryFilter) list = list.filter((m) => m.category === categoryFilter);
    return list;
  }, [search, typeFilter, categoryFilter]);

  return (
    <main className="min-h-screen p-4 md:p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-primary mb-6">⚡ 技能百科</h1>

      {/* Filters */}
      <div className="space-y-3 mb-6">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="搜索技能..."
          className="max-w-sm bg-secondary"
        />
        <div className="flex gap-2">
          {["Physical", "Special", "Status"].map((cat) => (
            <Badge
              key={cat}
              variant={categoryFilter === cat ? "default" : "secondary"}
              className="cursor-pointer"
              onClick={() => setCategoryFilter(cat === categoryFilter ? "" : cat)}
            >
              {CATEGORY_ICONS[cat]} {cat === "Physical" ? "物理" : cat === "Special" ? "特殊" : "变化"}
            </Badge>
          ))}
        </div>
      </div>

      {/* Moves Table */}
      <div className="rounded-lg border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary">
            <tr>
              <th className="text-left px-3 py-2">技能名</th>
              <th className="text-left px-3 py-2">属性</th>
              <th className="text-center px-3 py-2">分类</th>
              <th className="text-center px-3 py-2">威力</th>
              <th className="text-center px-3 py-2">命中</th>
              <th className="text-center px-3 py-2">PP</th>
              <th className="text-left px-3 py-2 hidden md:table-cell">效果</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((move) => (
              <tr key={move.id} className="border-t border-border hover:bg-accent/50">
                <td className="px-3 py-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{move.nameZh}</span>
                    {move.championsChange && (
                      <Badge className={`text-[9px] px-1 ${
                        move.championsChange.type === "buff" ? "bg-green-500/20 text-green-300" :
                        move.championsChange.type === "nerf" ? "bg-red-500/20 text-red-300" :
                        "bg-yellow-500/20 text-yellow-300"
                      }`}>
                        {move.championsChange.type === "buff" ? "强化" : move.championsChange.type === "nerf" ? "削弱" : "改动"}
                      </Badge>
                    )}
                  </div>
                </td>
                <td className="px-3 py-2">
                  <TypeBadge type={move.type} size="sm" />
                </td>
                <td className="text-center px-3 py-2">
                  {CATEGORY_ICONS[move.category]}
                </td>
                <td className="text-center px-3 py-2 font-mono">
                  {move.power ?? "—"}
                </td>
                <td className="text-center px-3 py-2 font-mono">
                  {move.accuracy ? `${move.accuracy}%` : "—"}
                </td>
                <td className="text-center px-3 py-2 font-mono">
                  {move.pp}
                </td>
                <td className="px-3 py-2 text-xs text-muted-foreground hidden md:table-cell max-w-xs truncate">
                  {move.championsChange ? (
                    <span className="text-yellow-300">{move.championsChange.details}</span>
                  ) : (
                    move.description
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
