/**
 * Fetch competitive usage data from Pikalytics Champions section
 * Output: data/raw/pikalytics-usage.json
 * 
 * NOTE: Pikalytics has no public API. This script scrapes the public pages.
 * Respect rate limits (1 req/sec), and do NOT run more than once daily.
 * 
 * Usage: npx tsx scripts/fetch-pikalytics.ts
 */

import * as fs from "fs";
import * as path from "path";

const BASE_URL = "https://www.pikalytics.com";
const CHAMPIONS_PATH = "/champions"; // Champions format page
const OUTPUT_DIR = path.join(__dirname, "..", "data", "raw");
const DELAY_MS = 2000; // 2s between requests to be respectful

interface UsageEntry {
  rank: number;
  name: string;
  usage: number; // percentage
  types: string[];
}

interface PokemonMetaData {
  name: string;
  usage: number;
  moves: { name: string; usage: number }[];
  items: { name: string; usage: number }[];
  abilities: { name: string; usage: number }[];
  spreads: { nature: string; stats: string; usage: number }[];
  teammates: { name: string; usage: number }[];
  counters: { name: string; score: number }[];
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Parse the Pikalytics overview page HTML to extract usage list.
 * Pikalytics renders data in the page HTML (not client-side JS), 
 * so we can parse it with regex/DOM parsing.
 */
function parseOverviewPage(html: string): UsageEntry[] {
  const results: UsageEntry[] = [];
  
  // Pikalytics uses a specific div structure for each pokemon entry
  // Pattern: <div class="pokemon-pokemon_name">...usage%...</div>
  const pokemonRegex = /class="pokemon[^"]*"[^>]*>.*?<span class="pokemon-name">([^<]+)<\/span>.*?<span class="pokemon-usage">([\d.]+)%<\/span>/gs;
  
  let match;
  let rank = 1;
  while ((match = pokemonRegex.exec(html)) !== null) {
    results.push({
      rank: rank++,
      name: match[1].trim().toLowerCase().replace(/\s+/g, "-"),
      usage: parseFloat(match[2]),
      types: [], // Will be filled from detail pages
    });
  }
  
  // Fallback: try JSON-LD or embedded data
  if (results.length === 0) {
    // Try parsing the table format
    const tableRegex = /<tr[^>]*>.*?pokemon-info.*?<a[^>]*>([^<]+)<\/a>.*?<td[^>]*>([\d.]+)%<\/td>/gs;
    while ((match = tableRegex.exec(html)) !== null) {
      results.push({
        rank: rank++,
        name: match[1].trim().toLowerCase().replace(/\s+/g, "-"),
        usage: parseFloat(match[2]),
        types: [],
      });
    }
  }
  
  return results;
}

/**
 * Parse a Pokemon detail page for moves, items, abilities, spreads, teammates
 */
function parseDetailPage(html: string, name: string): PokemonMetaData | null {
  const data: PokemonMetaData = {
    name,
    usage: 0,
    moves: [],
    items: [],
    abilities: [],
    spreads: [],
    teammates: [],
    counters: [],
  };
  
  // Extract sections using common Pikalytics patterns
  const sectionRegex = /<div class="pokemon-stat-title">([^<]+)<\/div>([\s\S]*?)(?=<div class="pokemon-stat-title">|<\/div>\s*<\/div>)/g;
  
  let match;
  while ((match = sectionRegex.exec(html)) !== null) {
    const title = match[1].toLowerCase().trim();
    const content = match[2];
    
    const itemRegex = /<span class="pokemon-stat-name">([^<]+)<\/span>.*?<span class="pokemon-stat-percent">([\d.]+)%<\/span>/gs;
    
    let itemMatch;
    const items: { name: string; usage: number }[] = [];
    while ((itemMatch = itemRegex.exec(content)) !== null) {
      items.push({
        name: itemMatch[1].trim(),
        usage: parseFloat(itemMatch[2]),
      });
    }
    
    if (title.includes("move")) data.moves = items;
    else if (title.includes("item")) data.items = items;
    else if (title.includes("abilit")) data.abilities = items;
    else if (title.includes("teammate")) data.teammates = items;
    else if (title.includes("spread")) {
      data.spreads = items.map((i) => ({
        nature: i.name.split(":")[0] || i.name,
        stats: i.name,
        usage: i.usage,
      }));
    }
  }
  
  return data;
}

async function fetchPage(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/125.0.0.0 Safari/537.36",
      "Accept": "text/html,application/xhtml+xml",
      "Accept-Language": "en-US,en;q=0.9",
    },
  });
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${url}`);
  }
  
  return response.text();
}

async function main() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  
  console.log("=== Pikalytics Champions Data Fetch ===\n");
  
  // Step 1: Get overview page with usage rankings
  console.log("Fetching overview page...");
  let html: string;
  try {
    html = await fetchPage(`${BASE_URL}${CHAMPIONS_PATH}`);
  } catch (err) {
    console.error("Failed to fetch Pikalytics overview. The site may be down or blocking.");
    console.error("Error:", err);
    console.log("\nTip: If blocked, try running from a different IP or using a proxy.");
    process.exit(1);
  }
  
  const usageList = parseOverviewPage(html);
  console.log(`Found ${usageList.length} Pokemon in usage data`);
  
  if (usageList.length === 0) {
    console.warn("WARNING: No Pokemon found in HTML. Pikalytics may have changed their layout.");
    console.warn("Saving raw HTML for debugging...");
    fs.writeFileSync(path.join(OUTPUT_DIR, "pikalytics-debug.html"), html);
    // Continue with empty data rather than crashing
  }
  
  // Step 2: Fetch detail pages for top 100 Pokemon
  const TOP_N = 100;
  const detailResults: PokemonMetaData[] = [];
  
  console.log(`\nFetching detail pages for top ${Math.min(TOP_N, usageList.length)} Pokemon...`);
  
  for (let i = 0; i < Math.min(TOP_N, usageList.length); i++) {
    const pokemon = usageList[i];
    try {
      const detailHtml = await fetchPage(`${BASE_URL}${CHAMPIONS_PATH}/${pokemon.name}`);
      const detail = parseDetailPage(detailHtml, pokemon.name);
      if (detail) {
        detail.usage = pokemon.usage;
        detailResults.push(detail);
      }
      
      if ((i + 1) % 10 === 0) {
        console.log(`  ${i + 1}/${Math.min(TOP_N, usageList.length)} detail pages fetched`);
      }
      
      await sleep(DELAY_MS);
    } catch (err) {
      console.warn(`  Failed to fetch detail for ${pokemon.name}: ${err}`);
    }
  }
  
  // Step 3: Save results
  const output = {
    fetchDate: new Date().toISOString(),
    format: "champions",
    totalPokemon: usageList.length,
    usageList,
    details: detailResults,
  };
  
  const outputPath = path.join(OUTPUT_DIR, "pikalytics-usage.json");
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
  console.log(`\n✓ Saved usage data to ${outputPath}`);
  console.log(`  - ${usageList.length} Pokemon in ranking`);
  console.log(`  - ${detailResults.length} detail entries`);
  
  console.log("\n=== Done ===");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
