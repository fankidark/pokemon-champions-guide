"use client";

import { useMemo, useState } from "react";

interface SpeedPokemon {
  id: number;
  name: string;
  nameZh: string;
  types: string[];
  baseSpeed: number;
  sprite: string;
  hasMega: boolean;
  usage: number;
}

// 关键速度线（来源: pikachampions.com/guides/pokemon-champions-speed-tiers, Reg M-A）
const KEY_BENCHMARKS = [
  { speed: 150, who: "Mega 胡地 / Mega 化石翼龙", note: "全场最速，无围巾不可超" },
  { speed: 142, who: "多龙巴鲁托", note: "非 Mega 最速，围巾后 213" },
  { speed: 120, who: "毒千手", note: "顶级物理威胁，顺风前必须有应对" },
  { speed: 116, who: "白蓬蓬", note: "主流顺风手，恶作剧之心变相先制" },
  { speed: 102, who: "烈咬陆鲨", note: "100-105 档位竞争最激烈" },
  { speed: 100, who: "喷火龙 / 火神蛾", note: "常见基础 100 档" },
  { speed: 88, who: "龙头地鼠", note: "沙暴下翻倍 176，瞬间全场最速之一" },
  { speed: 60, who: "炽焰咆哮虎", note: "故意慢速的辅助核心" },
];

// SP 速度投资参考（每 1 SP ≈ +1 速度，上限 32）
const SP_CREEP_EXAMPLES = [
  { self: "烈咬陆鲨 (102)", target: "白蓬蓬 116", sp: "~14 SP", why: "顺风手动手前先出招" },
  { self: "喷火龙 (100)", target: "白蓬蓬 116", sp: "~17 SP", why: "顺风起手前干扰" },
  { self: "炽焰咆哮虎 (60)", target: "镜像 60", sp: "1 SP", why: "镜像对局先手拍落" },
  { self: "烈咬陆鲨 (102)", target: "镜像 102", sp: "1 SP", why: "同速硬币变必胜" },
  { self: "快龙 (80)", target: "喷火龙 100", sp: "~21 SP", why: "无顺风超 Mega 喷火龙" },
  { self: "劈斧螳螂 (50)", target: "炽焰咆哮虎 60", sp: "~11 SP", why: "非先制招先于拍落" },
];

const MODIFIERS = [
  { id: "none", label: "无加成", mult: 1 },
  { id: "scarf", label: "讲究围巾 ×1.5", mult: 1.5 },
  { id: "tailwind", label: "顺风 ×2", mult: 2 },
  { id: "both", label: "围巾+顺风 ×3", mult: 3 },
] as const;

type ModifierId = (typeof MODIFIERS)[number]["id"];

function tierOf(speed: number): { label: string; color: string } {
  if (speed >= 130) return { label: "S 极速 130+", color: "text-red-400" };
  if (speed >= 100) return { label: "A 高速 100-129", color: "text-orange-400" };
  if (speed >= 70) return { label: "B 中速 70-99", color: "text-yellow-400" };
  if (speed >= 40) return { label: "C 低速 40-69", color: "text-blue-400" };
  return { label: "D 龟速 <40 (TR核心)", color: "text-purple-400" };
}

export function SpeedClient({ pokemon }: { pokemon: SpeedPokemon[] }) {
  const [search, setSearch] = useState("");
  const [modifier, setModifier] = useState<ModifierId>("none");
  const [trMode, setTrMode] = useState(false);

  const mult = MODIFIERS.find((m) => m.id === modifier)!.mult;

  const list = useMemo(() => {
    let l = pokemon;
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      l = l.filter(
        (p) => p.name.toLowerCase().includes(q) || p.nameZh.includes(q)
      );
    }
    const withEffective = l.map((p) => ({
      ...p,
      effective: Math.floor(p.baseSpeed * mult),
    }));
    // TR 模式：慢的排前面
    return trMode
      ? [...withEffective].sort((a, b) => a.baseSpeed - b.baseSpeed)
      : withEffective;
  }, [pokemon, search, mult, trMode]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-amber-400">⚡ 速度线工具</h1>
        <p className="mt-1 text-sm text-gray-400">
          Regulation M-A 全宝可梦速度档位 · 数据参考 pikachampions.com
        </p>
      </div>

      {/* 关键速度线 */}
      <section>
        <h2 className="mb-3 text-lg font-semibold">🎯 关键速度线</h2>
        <div className="grid gap-2 sm:grid-cols-2">
          {KEY_BENCHMARKS.map((b) => (
            <div
              key={b.speed}
              className="flex items-center gap-3 rounded-lg border border-gray-800 bg-gray-900/60 px-3 py-2"
            >
              <span className="w-12 shrink-0 text-right text-xl font-bold text-amber-400">
                {b.speed}
              </span>
              <div className="min-w-0">
                <div className="truncate text-sm font-medium">{b.who}</div>
                <div className="truncate text-xs text-gray-500">{b.note}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SP 投资参考 */}
      <section>
        <h2 className="mb-3 text-lg font-semibold">📐 SP 速度投资参考</h2>
        <p className="mb-2 text-xs text-gray-500">
          每 1 SP ≈ +1 速度（单项上限 32）。1 SP 镜像卡速几乎永远值得；大额卡速需在耐久间权衡。
        </p>
        <div className="overflow-x-auto rounded-lg border border-gray-800">
          <table className="w-full text-sm">
            <thead className="bg-gray-900 text-left text-xs text-gray-400">
              <tr>
                <th className="px-3 py-2">你的宝可梦</th>
                <th className="px-3 py-2">目标</th>
                <th className="px-3 py-2">需要 SP</th>
                <th className="px-3 py-2">意义</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {SP_CREEP_EXAMPLES.map((r, i) => (
                <tr key={i} className="bg-gray-900/40">
                  <td className="px-3 py-2">{r.self}</td>
                  <td className="px-3 py-2">{r.target}</td>
                  <td className="px-3 py-2 font-semibold text-amber-400">{r.sp}</td>
                  <td className="px-3 py-2 text-gray-400">{r.why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 全量速度表 */}
      <section>
        <h2 className="mb-3 text-lg font-semibold">📊 全速度档位表（{pokemon.length} 只）</h2>
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜索宝可梦（中/英文）"
            className="w-48 rounded-md border border-gray-700 bg-gray-900 px-3 py-1.5 text-sm outline-none focus:border-amber-500"
          />
          {MODIFIERS.map((m) => (
            <button
              key={m.id}
              onClick={() => setModifier(m.id)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
                modifier === m.id
                  ? "bg-amber-500 text-black"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              {m.label}
            </button>
          ))}
          <button
            onClick={() => setTrMode(!trMode)}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
              trMode
                ? "bg-purple-500 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            🔮 戏法空间排序{trMode ? " ON" : ""}
          </button>
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-800">
          <table className="w-full text-sm">
            <thead className="bg-gray-900 text-left text-xs text-gray-400">
              <tr>
                <th className="px-3 py-2">#</th>
                <th className="px-3 py-2">宝可梦</th>
                <th className="px-3 py-2 text-right">基础速度</th>
                {modifier !== "none" && (
                  <th className="px-3 py-2 text-right text-amber-400">加成后</th>
                )}
                <th className="px-3 py-2">档位</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {list.map((p) => {
                const tier = tierOf(p.baseSpeed);
                return (
                  <tr key={p.id} className="bg-gray-900/40 hover:bg-gray-800/60">
                    <td className="px-3 py-1.5 text-xs text-gray-500">#{p.id}</td>
                    <td className="px-3 py-1.5">
                      <span className="font-medium">{p.nameZh}</span>
                      {p.hasMega && (
                        <span className="ml-1.5 rounded bg-indigo-600/40 px-1 text-[10px] text-indigo-300">
                          MEGA
                        </span>
                      )}
                      {p.usage > 0 && (
                        <span className="ml-1.5 text-[10px] text-gray-500">
                          使用率 {p.usage}%
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-1.5 text-right font-mono font-semibold">
                      {p.baseSpeed}
                    </td>
                    {modifier !== "none" && (
                      <td className="px-3 py-1.5 text-right font-mono font-semibold text-amber-400">
                        {p.effective}
                      </td>
                    )}
                    <td className={`px-3 py-1.5 text-xs ${tier.color}`}>{tier.label}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-gray-600">
          注：基础速度为种族值速度，实际对战数值受性格/SP 影响。沙暴下龙头地鼠(Sand Rush)速度×2。
          戏法空间模式下最慢的先出手（持续5回合）。
        </p>
      </section>
    </div>
  );
}
