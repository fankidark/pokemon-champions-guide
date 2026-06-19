/**
 * Build final data files by merging PokeAPI + Pikalytics + Champions patch
 * Output: data/pokemon.json, data/moves.json, data/items.json, data/meta.json
 * 
 * Usage: npx tsx scripts/build-data.ts
 */

import * as fs from "fs";
import * as path from "path";

const RAW_DIR = path.join(__dirname, "..", "data", "raw");
const PATCH_PATH = path.join(__dirname, "..", "data", "champions-patch.json");
const OUTPUT_DIR = path.join(__dirname, "..", "data");

interface FinalPokemon {
  id: number;
  name: string;
  nameZh: string;
  types: string[];
  baseStats: { hp: number; atk: number; def: number; spa: number; spd: number; spe: number };
  abilities: { normal: string[]; hidden: string | null };
  mega?: {
    name: string;
    types: string[];
    baseStats: { hp: number; atk: number; def: number; spa: number; spd: number; spe: number };
    ability: string;
    megaStone: string;
    tier?: string;
    isChampionsExclusive: boolean;
  }[];
  meta?: {
    usage: number;
    moves: { name: string; usage: number }[];
    items: { name: string; usage: number }[];
    abilities: { name: string; usage: number }[];
    spreads: { nature: string; stats: string; usage: number }[];
    teammates: { name: string; usage: number }[];
  };
  sprite: string;
}

// Chinese name mapping (top 100 competitive Pokemon)
const ZH_NAMES: Record<string, string> = {
  "charizard": "喷火龙", "venusaur": "妙蛙花", "blastoise": "水箭龟",
  "pikachu": "皮卡丘", "gengar": "耿鬼", "kangaskhan": "袋兽",
  "garchomp": "烈咬陆鲨", "lucario": "路卡利欧", "metagross": "巨金怪",
  "salamence": "暴飞龙", "tyranitar": "班基拉斯", "gardevoir": "沙奈朵",
  "scizor": "巨钳螳螂", "gyarados": "暴鲤龙", "blaziken": "火焰鸡",
  "excadrill": "龙头地鼠", "feraligatr": "大力鳄", "froslass": "雪妖女",
  "baxcalibur": "戟脊龙", "talonflame": "烈箭鹰", "haxorus": "双斧战龙",
  "togekiss": "波克基斯", "arcanine": "风速犬", "milotic": "美纳斯",
  "chandelure": "水晶灯火灵", "volcarona": "火神蛾", "kommo-o": "杖尾鳞甲龙",
  "incineroar": "炽焰咆哮虎", "rillaboom": "轰擂金刚猩",
  "amoonguss": "败露球菇", "landorus": "土地云", "urshifu": "武道熊师",
  "kingambit": "仆刀将军", "gholdengo": "赛富豪", "flutter-mane": "振翼发",
  "iron-hands": "铁臂膀", "great-tusk": "雄伟牙", "dragonite": "快龙",
  "dondozo": "寿司�的", "tatsugiri": "米立龙", "palafin": "海豚侠",
  "iron-bundle": "铁包袱", "annihilape": "弃世猴", "gimmighoul": "索财灵",
  "ceruledge": "苍炎刃鬼", "armarouge": "红莲铠骑", "ditto": "百变怪",
  "porygon2": "多边兽2", "clefairy": "皮皮", "tornadus": "龙卷云",
  "whimsicott": "风妖精", "grimmsnarl": "长毛巨魔", "indeedee": "爱管侍",
  "gothitelle": "哥德小姐", "ninetales": "九尾", "pelipper": "大嘴鸥",
  "politoed": "蚊香蛙皇", "torkoal": "煤炭龟", "abomasnow": "暴雪王",
  "hippowdon": "河马兽", "gastrodon": "海兔兽", "cresselia": "克雷色利亚",
  "heatran": "席多蓝恩", "zapdos": "闪电鸟", "moltres": "火焰鸟",
  "articuno": "急冻鸟", "regieleki": "雷吉艾勒奇", "calyrex": "蕾冠王",
  "palkia": "帕路奇亚", "dialga": "帝牙卢卡", "zacian": "苍响",
  "kyogre": "盖欧卡", "groudon": "固拉多", "rayquaza": "裂空座",
  "mimikyu": "谜拟Q", "rotom": "洛托姆", "toxapex": "超坏星",
  "corviknight": "钢铠鸦", "dragapult": "多龙巴鲁托", "cinderace": "闪焰王牌",
  "raichu": "雷丘", "marowak": "嘎啦嘎啦", "slowking": "呆呆王",
  "muk": "臭臭泥", "exeggutor": "椰蛋树", "sandslash": "穿山王",
  "ninetales-alola": "九尾(阿罗拉)", "Persian": "猫老大",
  "snorlax": "卡比兽", "lapras": "拉普拉斯", "vaporeon": "水伊布",
  "jolteon": "雷伊布", "flareon": "火伊布", "espeon": "太阳伊布",
  "umbreon": "月亮伊布", "leafeon": "叶伊布", "glaceon": "冰伊布",
  "sylveon": "仙子伊布", "machamp": "怪力", "alakazam": "胡地",
  "slowbro": "呆壳兽", "magnezone": "自爆磁怪", "starmie": "宝石海星",
  "weavile": "玛狃拉", "mamoswine": "象牙猪", "gliscor": "天蝎王",
  "conkeldurr": "修建老匠", "hydreigon": "三头龙", "bisharp": "劈斩司令",
  "goodra": "黏美龙", "noivern": "音波龙", "decidueye": "狙射树枭",
  "primarina": "西狮海壬", "lycanroc": "鬃岩狼人", "toxtricity": "颤弦蝾螈",
  "urshifu-rapid-strike": "武道熊师(连击)", "regigigas": "雷吉奇卡斯",
  "mawile": "大嘴娃", "lopunny": "长耳兔", "altaria": "七夕青鸟",
  "gallade": "艾路雷朵", "medicham": "恰雷姆", "absol": "阿勃梭鲁",
  "ampharos": "电龙", "heracross": "赫拉克罗斯", "pinsir": "凯罗斯",
  "aerodactyl": "化石翼龙", "aggron": "波士可多拉", "manectric": "雷电兽",
  "sableye": "勾魂眼", "sharpedo": "巨牙鲨", "camerupt": "喷火驼",
  "banette": "诅咒娃娃", "beedrill": "大针蜂", "pidgeot": "大比鸟",
  "steelix": "大钢蛇", "houndoom": "黑鲁加",
};

function loadJSON<T>(filePath: string): T | null {
  try {
    const content = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(content) as T;
  } catch {
    console.warn(`  Could not load ${filePath}`);
    return null;
  }
}

async function main() {
  console.log("=== Building Final Data ===\n");
  
  // Load raw data
  const pokeapiData = loadJSON<any[]>(path.join(RAW_DIR, "pokeapi-pokemon.json"));
  const pikalyticsData = loadJSON<any>(path.join(RAW_DIR, "pikalytics-usage.json"));
  const championsData = loadJSON<any>(PATCH_PATH);
  
  if (!championsData) {
    console.error("Champions patch data is required!");
    process.exit(1);
  }
  
  // Build Pokemon data
  const pokemonList: FinalPokemon[] = [];
  
  if (pokeapiData) {
    console.log(`Processing ${pokeapiData.length} Pokemon from PokeAPI...`);
    
    for (const poke of pokeapiData) {
      const entry: FinalPokemon = {
        id: poke.id,
        name: poke.name,
        nameZh: ZH_NAMES[poke.name] || poke.name,
        types: poke.types,
        baseStats: poke.baseStats,
        abilities: poke.abilities,
        sprite: poke.sprite,
      };
      
      // Check for Mega evolutions
      const megas: FinalPokemon["mega"] = [];
      
      // Champions-exclusive Megas
      const exclusiveMega = championsData.megaEvolutions.championsExclusive.find(
        (m: any) => m.base === poke.name
      );
      if (exclusiveMega) {
        megas.push({
          name: exclusiveMega.name,
          types: exclusiveMega.types,
          baseStats: exclusiveMega.baseStats,
          ability: exclusiveMega.ability,
          megaStone: exclusiveMega.megaStone,
          tier: exclusiveMega.tier,
          isChampionsExclusive: true,
        });
      }
      
      // Classic Megas
      const classicMegaNames = championsData.megaEvolutions.classicReturning.filter(
        (name: string) => name.startsWith(poke.name + "-mega")
      );
      // Classic mega stats come from PokeAPI (they exist as separate forms)
      
      if (megas.length > 0) {
        entry.mega = megas;
      }
      
      // Merge Pikalytics meta data
      if (pikalyticsData?.details) {
        const metaEntry = pikalyticsData.details.find(
          (d: any) => d.name === poke.name || d.name === poke.name.replace(/-/g, "")
        );
        if (metaEntry) {
          entry.meta = {
            usage: metaEntry.usage,
            moves: metaEntry.moves,
            items: metaEntry.items,
            abilities: metaEntry.abilities,
            spreads: metaEntry.spreads,
            teammates: metaEntry.teammates,
          };
        }
      }
      
      pokemonList.push(entry);
    }
  } else {
    console.warn("No PokeAPI data available. Creating stub from Champions patch only.");
    // Create entries just from the Champions-exclusive Megas
    for (const mega of championsData.megaEvolutions.championsExclusive) {
      pokemonList.push({
        id: 0,
        name: mega.base,
        nameZh: ZH_NAMES[mega.base] || mega.base,
        types: mega.types, // Use mega types as placeholder
        baseStats: mega.baseStats,
        abilities: { normal: [mega.ability], hidden: null },
        mega: [{
          name: mega.name,
          types: mega.types,
          baseStats: mega.baseStats,
          ability: mega.ability,
          megaStone: mega.megaStone,
          tier: mega.tier,
          isChampionsExclusive: true,
        }],
        sprite: "",
      });
    }
  }
  
  // Save final Pokemon data
  const pokemonPath = path.join(OUTPUT_DIR, "pokemon.json");
  fs.writeFileSync(pokemonPath, JSON.stringify(pokemonList, null, 2));
  console.log(`✓ Saved ${pokemonList.length} Pokemon to ${pokemonPath}`);
  
  // Save moves (PokeAPI + Champions changes)
  const movesRaw = loadJSON<any[]>(path.join(RAW_DIR, "pokeapi-moves.json")) || [];
  const movesWithPatches = movesRaw.map((move) => {
    const change = championsData.moveChanges.find((c: any) => c.name === move.name);
    if (change) {
      return { ...move, championsChange: change };
    }
    return move;
  });
  
  const movesPath = path.join(OUTPUT_DIR, "moves.json");
  fs.writeFileSync(movesPath, JSON.stringify(movesWithPatches, null, 2));
  console.log(`✓ Saved ${movesWithPatches.length} Moves to ${movesPath}`);
  
  // Save meta summary
  const metaSummary = {
    lastUpdated: new Date().toISOString(),
    format: "champions",
    regulation: "M-A",
    battleRules: championsData.battleRules,
    itemRestrictions: championsData.itemRestrictions,
    statusChanges: championsData.statusChanges,
    topPokemon: pokemonList
      .filter((p) => p.meta)
      .sort((a, b) => (b.meta?.usage || 0) - (a.meta?.usage || 0))
      .slice(0, 50)
      .map((p) => ({ name: p.name, nameZh: p.nameZh, usage: p.meta!.usage })),
  };
  
  const metaPath = path.join(OUTPUT_DIR, "meta.json");
  fs.writeFileSync(metaPath, JSON.stringify(metaSummary, null, 2));
  console.log(`✓ Saved meta summary to ${metaPath}`);
  
  console.log("\n=== Build Complete ===");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
