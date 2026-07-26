import { getAllPokemon, getNamesZh } from "@/lib/data";
import * as fs from "fs";
import * as path from "path";
import { SpeedClient } from "./speed-client";

export const dynamic = "force-static";

export const metadata = {
  title: "速度线工具 | Pokemon Champions 攻略",
  description:
    "Pokemon Champions Regulation M-A 全宝可梦速度档位表：关键速度线、围巾/顺风/沙暴加成、戏法空间档位与 SP 速度投资参考。",
};

function loadMetaUsage(): Record<string, { usage?: number }> {
  try {
    const raw = fs.readFileSync(
      path.join(process.cwd(), "data", "meta-usage.json"),
      "utf-8"
    );
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export default function SpeedPage() {
  const namesZh = getNamesZh();
  const metaUsage = loadMetaUsage();

  // Champions-only：以 names-zh.json 的 208 个键为准过滤全量图鉴
  const championsNames = new Set(Object.keys(namesZh));
  const pokemon = getAllPokemon()
    .filter((p) => championsNames.has(p.name))
    .map((p) => ({
      id: p.id,
      name: p.name,
      nameZh: namesZh[p.name] || p.name,
      types: p.types,
      baseSpeed: p.baseStats.spe,
      sprite: p.sprite,
      hasMega: p.hasMega ?? false,
      usage: metaUsage[String(p.id)]?.usage ?? 0,
    }))
    .sort((a, b) => b.baseSpeed - a.baseSpeed);

  return <SpeedClient pokemon={pokemon} />;
}
