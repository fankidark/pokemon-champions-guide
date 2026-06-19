"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface ItemEntry {
  name: string;
  nameZh: string;
  category: string;
  effect: string;
  competitiveNotes: string;
  regMA: boolean;
  regMB: boolean;
}

const ITEMS_LIST: ItemEntry[] = [
  { name: "leftovers", nameZh: "吃剩的东西", category: "回复", effect: "每回合结束时回复最大HP的1/16", competitiveNotes: "最通用的持久战道具，适合坦克型和速度控制型", regMA: true, regMB: true },
  { name: "focus-sash", nameZh: "气势腰带", category: "保护", effect: "满HP时受到致命伤害保留1HP", competitiveNotes: "脆皮高速攻手必备，保证至少行动一次", regMA: true, regMB: true },
  { name: "life-orb", nameZh: "命玉", category: "强化", effect: "招式伤害×1.3，每次攻击损失最大HP的10%", competitiveNotes: "⚠️ Reg M-A 禁止！M-B 解禁", regMA: false, regMB: true },
  { name: "choice-band", nameZh: "讲究头带", category: "讲究", effect: "攻击×1.5，但只能使用一个招式", competitiveNotes: "⚠️ Reg M-A 禁止！M-B 解禁。锁招风险高", regMA: false, regMB: true },
  { name: "choice-specs", nameZh: "讲究眼镜", category: "讲究", effect: "特攻×1.5，但只能使用一个招式", competitiveNotes: "⚠️ Reg M-A 禁止！M-B 解禁", regMA: false, regMB: true },
  { name: "choice-scarf", nameZh: "讲究围巾", category: "讲究", effect: "速度×1.5，但只能使用一个招式", competitiveNotes: "⚠️ Reg M-A 禁止！M-B 解禁。重要的先手抢夺道具", regMA: false, regMB: true },
  { name: "assault-vest", nameZh: "突击背心", category: "强化", effect: "特防×1.5，但不能使用变化招式", competitiveNotes: "⚠️ 全规则禁止！不会解禁", regMA: false, regMB: false },
  { name: "sitrus-berry", nameZh: "文柚果", category: "树果", effect: "HP≤50%时回复最大HP的1/4", competitiveNotes: "稳定的回复道具，一次性使用。配合威吓循环很强", regMA: true, regMB: true },
  { name: "lum-berry", nameZh: "奇迹果", category: "树果", effect: "自动治愈异常状态一次", competitiveNotes: "防催眠/烧伤/麻痹，保险性质", regMA: true, regMB: true },
  { name: "safety-goggles", nameZh: "防尘护目镜", category: "保护", effect: "免疫天气伤害和粉末类招式", competitiveNotes: "针对愤怒粉/蘑菇孢子/沙暴的meta道具", regMA: true, regMB: true },
  { name: "rocky-helmet", nameZh: "凸凸头盔", category: "反击", effect: "被接触招式命中时对手损失最大HP的1/6", competitiveNotes: "物理坦配合威吓大量消耗对手", regMA: true, regMB: true },
  { name: "clear-amulet", nameZh: "净化护符", category: "保护", effect: "自身能力不会被对手降低", competitiveNotes: "防威吓/黏黏网/降能力招式", regMA: true, regMB: true },
  { name: "covert-cloak", nameZh: "遮蔽斗篷", category: "保护", effect: "免疫招式附加效果（畏缩/降能力等）", competitiveNotes: "防岩崩/冰牙畏缩，防黏黏网降速", regMA: true, regMB: true },
  { name: "wide-lens", nameZh: "广角镜", category: "强化", effect: "招式命中率×1.1", competitiveNotes: "让90命中招式变为99命中，减少miss风险", regMA: true, regMB: true },
  { name: "eviolite", nameZh: "进化奇石", category: "强化", effect: "未完全进化宝可梦的防御和特防×1.5", competitiveNotes: "⚠️ 全规则禁止（Champions只允许完全进化）", regMA: false, regMB: false },
];

const CATEGORIES = ["全部", "树果", "保护", "强化", "讲究", "回复", "反击"];

export default function ItemsPage() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("全部");
  const [showBanned, setShowBanned] = useState(true);

  const filtered = useMemo(() => {
    let list = ITEMS_LIST;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((i) => i.name.includes(q) || i.nameZh.includes(q));
    }
    if (categoryFilter !== "全部") {
      list = list.filter((i) => i.category === categoryFilter);
    }
    if (!showBanned) {
      list = list.filter((i) => i.regMA);
    }
    return list;
  }, [search, categoryFilter, showBanned]);

  return (
    <main className="min-h-screen p-4 md:p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-primary mb-6">🎒 道具百科</h1>

      {/* Filters */}
      <div className="space-y-3 mb-6">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="搜索道具..."
          className="max-w-sm bg-secondary"
        />
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <Badge
              key={cat}
              variant={categoryFilter === cat ? "default" : "secondary"}
              className="cursor-pointer"
              onClick={() => setCategoryFilter(cat)}
            >
              {cat}
            </Badge>
          ))}
          <Badge
            variant={showBanned ? "secondary" : "default"}
            className="cursor-pointer ml-4"
            onClick={() => setShowBanned(!showBanned)}
          >
            {showBanned ? "显示禁用" : "仅合法"}
          </Badge>
        </div>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filtered.map((item) => (
          <Card key={item.name} className={!item.regMA ? "opacity-60 border-red-500/30" : ""}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium">{item.nameZh}</span>
                <Badge variant="secondary" className="text-[10px]">{item.category}</Badge>
                {!item.regMA && <Badge className="bg-red-500/20 text-red-300 text-[10px]">M-A禁</Badge>}
                {!item.regMA && item.regMB && <Badge className="bg-green-500/20 text-green-300 text-[10px]">M-B可</Badge>}
                {!item.regMB && <Badge className="bg-red-500/20 text-red-300 text-[10px]">全禁</Badge>}
              </div>
              <p className="text-xs text-muted-foreground mb-2">{item.effect}</p>
              <p className="text-xs text-primary/80">💡 {item.competitiveNotes}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
