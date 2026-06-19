import { getAllMoves } from "@/lib/data";
import { MovesClient } from "./moves-client";
import * as fs from "fs";
import * as path from "path";

export const dynamic = "force-static";

function loadMovesZh(): Record<string, { nameZh: string; desc: string; tip: string }> {
  try {
    const raw = fs.readFileSync(path.join(process.cwd(), "data", "moves-zh.json"), "utf-8");
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export default function MovesPage() {
  const moves = getAllMoves();
  const movesZh = loadMovesZh();

  // Merge Chinese data into moves
  const enrichedMoves = moves.map((m) => {
    const zh = movesZh[m.name];
    return {
      ...m,
      nameZh: zh?.nameZh || undefined,
      descZh: zh?.desc || undefined,
      tip: zh?.tip || undefined,
    };
  });

  // Sort: moves with Chinese names first (more important competitive moves)
  enrichedMoves.sort((a, b) => {
    if (a.nameZh && !b.nameZh) return -1;
    if (!a.nameZh && b.nameZh) return 1;
    return 0;
  });

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">
        <span className="text-primary">⚡</span> 技能百科
      </h1>
      <MovesClient moves={enrichedMoves} />
    </main>
  );
}
