import * as fs from "fs";
import * as path from "path";
import { ItemsClient } from "./items-client";

export const dynamic = "force-static";

function loadItems() {
  try {
    const raw = fs.readFileSync(path.join(process.cwd(), "data", "items-full.json"), "utf-8");
    return JSON.parse(raw);
  } catch {
    return { hold_items: [], berries: [], mega_stones_top: [] };
  }
}

export default function ItemsPage() {
  const itemsData = loadItems();
  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">
        <span className="text-primary">🎒</span> 道具百科
      </h1>
      <ItemsClient data={itemsData} />
    </main>
  );
}
