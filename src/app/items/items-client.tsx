"use client";

import { useState, useMemo } from "react";

interface Item {
  name: string;
  nameZh: string;
  category: string;
  desc: string;
  tip: string;
  banned?: string | null;
  pokemon?: string;
}

interface ItemsData {
  hold_items: Item[];
  berries: Item[];
  mega_stones_top: Item[];
}

const CATEGORIES = ["全部", "讲究", "强化", "保护", "回复", "耐久", "速度", "天气", "属性强化", "辅助", "闪避", "特殊"];

export function ItemsClient({ data }: { data: ItemsData }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("全部");
  const [tab, setTab] = useState<"hold" | "berry" | "mega">("hold");

  const currentItems = tab === "hold" ? data.hold_items : tab === "berry" ? data.berries : data.mega_stones_top;

  const filtered = useMemo(() => {
    return currentItems.filter((item) => {
      if (search && !item.nameZh.includes(search) && !item.name.includes(search.toLowerCase())) return false;
      if (category !== "全部" && item.category !== category) return false;
      return true;
    });
  }, [currentItems, search, category]);

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex gap-2 border-b border-border pb-2">
        {([["hold", "🔧 持有道具"], ["berry", "🍇 树果"], ["mega", "💎 进化石"]] as const).map(([key, label]) => (
          <button key={key}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${tab === key ? "bg-primary text-primary-foreground" : "bg-card border border-border hover:bg-card/80"}`}
            onClick={() => setTab(key as "hold" | "berry" | "mega")}>
            {label}
          </button>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="flex flex-wrap gap-2">
        <input
          type="text"
          placeholder="搜索道具..."
          className="px-3 py-2 rounded-lg bg-card border border-border text-sm flex-1 min-w-48"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {tab === "hold" && (
          <div className="flex flex-wrap gap-1">
            {CATEGORIES.map((cat) => (
              <button key={cat}
                className={`px-2 py-1 text-xs rounded-full transition ${category === cat ? "bg-primary text-primary-foreground" : "bg-card border border-border"}`}
                onClick={() => setCategory(cat)}>
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filtered.map((item) => (
          <div key={item.name} className="p-4 rounded-xl bg-card border border-border hover:border-primary/50 transition">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-foreground">{item.nameZh}</h3>
                <span className="text-xs text-muted-foreground">{item.name}</span>
              </div>
              <span className="px-2 py-0.5 text-xs rounded-full bg-primary/20 text-primary">{item.category}</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">{item.desc}</p>
            {item.tip && (
              <p className="text-xs text-amber-300 mt-2 flex items-start gap-1">
                <span>💡</span> {item.tip}
              </p>
            )}
            {item.pokemon && (
              <p className="text-xs text-purple-300 mt-1">适用: {item.pokemon}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
