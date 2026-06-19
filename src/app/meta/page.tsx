import { getAllPokemon, getNamesZh, getMetaData } from "@/lib/data";

export const dynamic = "force-static";

const TYPE_COLORS: Record<string, string> = {
  normal: "bg-gray-400", fire: "bg-orange-500", water: "bg-blue-500",
  electric: "bg-yellow-400", grass: "bg-green-500", ice: "bg-cyan-300",
  fighting: "bg-red-700", poison: "bg-purple-500", ground: "bg-amber-600",
  flying: "bg-indigo-300", psychic: "bg-pink-500", bug: "bg-lime-500",
  rock: "bg-yellow-700", ghost: "bg-purple-700", dragon: "bg-indigo-600",
  dark: "bg-gray-700", steel: "bg-gray-400", fairy: "bg-pink-300",
};

const TYPE_NAMES: Record<string, string> = {
  normal: "一般", fire: "火", water: "水", electric: "电", grass: "草",
  ice: "冰", fighting: "格斗", poison: "毒", ground: "地面", flying: "飞行",
  psychic: "超能", bug: "虫", rock: "岩石", ghost: "幽灵", dragon: "龙",
  dark: "恶", steel: "钢", fairy: "妖精",
};

// Placeholder meta usage data (will be replaced by Pikalytics data)
const topUsage = [
  { name: "froslass", usage: 63.8, delta: 2.1 },
  { name: "excadrill", usage: 52.1, delta: -1.3 },
  { name: "chandelure", usage: 48.5, delta: 3.4 },
  { name: "garchomp", usage: 45.2, delta: -0.5 },
  { name: "haxorus", usage: 41.3, delta: 1.8 },
  { name: "volcarona", usage: 39.8, delta: 0.7 },
  { name: "charizard", usage: 38.2, delta: -2.1 },
  { name: "metagross", usage: 36.5, delta: 1.2 },
  { name: "salamence", usage: 35.1, delta: -0.8 },
  { name: "tyranitar", usage: 33.7, delta: 0.3 },
];

const archetypes = [
  {
    name: "Mega Rush",
    description: "以高速 Mega 为核心的快攻队，利用 Mega 雪妖女/烈箭鹰的极速压制对手",
    core: ["froslass", "talonflame", "garchomp"],
    color: "border-red-500",
  },
  {
    name: "Sand Balance",
    description: "沙暴核心控场 + 龙头地鼠输出，班基拉斯起沙+沙隐翻倍速度",
    core: ["tyranitar", "excadrill", "togekiss"],
    color: "border-yellow-500",
  },
  {
    name: "Sun Offense",
    description: "晴天攻击队，Mega 喷火龙 Y 干旱 + 火神蛾蝶舞双特攻炮台",
    core: ["charizard", "volcarona", "whimsicott"],
    color: "border-orange-500",
  },
  {
    name: "Trick Room",
    description: "空间队，彷徨夜灵展开 TR + 班基拉斯/巨金怪慢速重拳输出",
    core: ["dusclops", "tyranitar", "metagross"],
    color: "border-purple-500",
  },
];

export default function MetaPage() {
  const allPokemon = getAllPokemon();
  const namesZh = getNamesZh();
  const meta = getMetaData();

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-primary mb-2">📊 Meta 分析</h1>
      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8">
        <span>数据源: Pikalytics Champions</span>
        <span>更新: {meta.lastUpdated.split("T")[0]}</span>
        <span>规则: {meta.regulation}</span>
      </div>

      {/* Usage TOP 10 */}
      <section className="mb-12">
        <h2 className="text-xl font-bold mb-4">使用率 TOP 10</h2>
        <div className="space-y-2">
          {topUsage.map((entry, i) => {
            const pokemon = allPokemon.find((p) => p.name === entry.name);
            const zhName = namesZh[entry.name] || entry.name;
            return (
              <div key={entry.name} className="flex items-center gap-3 p-2 rounded-lg bg-card border border-border">
                <span className="text-sm font-bold text-muted-foreground w-6 text-right">#{i + 1}</span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={pokemon?.sprite || ""}
                  alt={zhName}
                  className="w-10 h-10 object-contain"
                />
                <span className="font-medium text-sm w-24 truncate">{zhName}</span>
                <div className="flex gap-1">
                  {pokemon?.types.map((t) => (
                    <span key={t} className={`px-1.5 py-0.5 text-[10px] font-medium text-white rounded ${TYPE_COLORS[t]}`}>
                      {TYPE_NAMES[t]}
                    </span>
                  ))}
                </div>
                <div className="flex-1 mx-3">
                  <div className="h-4 bg-border rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary/80 to-primary rounded-full"
                      style={{ width: `${(entry.usage / 70) * 100}%` }}
                    />
                  </div>
                </div>
                <span className="text-sm font-mono font-bold w-14 text-right">{entry.usage}%</span>
                <span className={`text-xs w-10 text-right ${entry.delta > 0 ? "text-green-400" : "text-red-400"}`}>
                  {entry.delta > 0 ? "↑" : "↓"}{Math.abs(entry.delta)}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Archetypes */}
      <section>
        <h2 className="text-xl font-bold mb-4">主流 Archetype</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {archetypes.map((arch) => (
            <div key={arch.name} className={`p-4 rounded-xl bg-card border-l-4 ${arch.color}`}>
              <h3 className="font-bold text-lg">{arch.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">{arch.description}</p>
              <div className="flex gap-2 mt-3">
                {arch.core.map((name) => {
                  const pkmn = allPokemon.find((p) => p.name === name);
                  return (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={name}
                      src={pkmn?.sprite || ""}
                      alt={namesZh[name] || name}
                      className="w-12 h-12 object-contain"
                      title={namesZh[name] || name}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Rules summary */}
      <section className="mt-12">
        <h2 className="text-xl font-bold mb-4">规则摘要 — Regulation {meta.regulation}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="p-4 rounded-lg bg-card border border-border">
            <h3 className="font-bold text-primary mb-2">对战格式</h3>
            <ul className="space-y-1 text-muted-foreground">
              <li>• 双打 VGC，等级固定 50</li>
              <li>• 队伍 6 只，上场 4 只</li>
              <li>• Mega 进化限 1 只/场</li>
              <li>• 无太晶化/Z招式/极巨化</li>
            </ul>
          </div>
          <div className="p-4 rounded-lg bg-card border border-border">
            <h3 className="font-bold text-primary mb-2">禁止道具 (Reg M-A)</h3>
            <ul className="space-y-1 text-muted-foreground">
              <li>• 命玉 (Life Orb)</li>
              <li>• 讲究系 (Choice Band/Specs/Scarf)</li>
              <li>• 突击背心 (Assault Vest)</li>
              <li>• 进化奇石 (Eviolite)</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
