import { getAllMoves } from "@/lib/data";
import { MovesClient } from "./moves-client";

export const dynamic = "force-static";

// Champions-specific move changes
const championsChanges: Record<string, string> = {
  "dragon-claw": "利刃特性：+50% 威力",
  "shadow-claw": "利刃特性：+50% 威力",
  "leaf-blade": "利刃特性：+50% 威力",
  "psycho-cut": "利刃特性：+50% 威力",
  "sacred-sword": "利刃特性：+50% 威力",
  "night-slash": "利刃特性：+50% 威力",
  "cross-poison": "利刃特性：+50% 威力",
  "air-cutter": "利刃特性：+50% 威力",
  "fake-out": "每次上场只能使用一次（不可重复选择）",
  "sleep-powder": "最多睡 2 回合",
  "spore": "最多睡 2 回合",
  "hypnosis": "最多睡 2 回合",
  "thunder-wave": "麻痹完全麻痹率降至 12.5%",
};

export default function MovesPage() {
  const allMoves = getAllMoves();
  
  // Add champions changes flag
  const movesWithChanges = allMoves.map((m) => ({
    ...m,
    championsChange: championsChanges[m.name] || undefined,
  }));

  return <MovesClient moves={movesWithChanges} />;
}
