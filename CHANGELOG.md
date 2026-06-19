# Pokemon Champions 攻略站 — 开发日志

## 2026-06-20 — 中文数据 + 详情页重构 + 道具/招式完善

### 改动
1. **详情页重构**：参考 PokeCamp 结构，展示使用率/性格分布/SP推荐/特性/道具/招式/常见队友 分布条形图 + 角色评价 + 适配阵容标签
2. **meta-usage.json**：10 只热门宝可梦完整竞技分析数据（#398姆克鹰 #445烈咬陆鲨 #547风妖精 #727炽焰咆哮虎 #376巨金怪 #6喷火龙 #248班基拉斯 #658甲贺忍蛙 #530龙头地鼠 #609水晶灯火灵）
3. **moves-zh.json**：49 个核心竞技招式中文名 + 描述 + 使用建议
4. **items-full.json**：道具全面重写，29 持有道具 + 9 树果 + 10 进化石，全部含中文名/描述/竞技 tips
5. **招式百科**：支持中英文搜索 + 使用建议 toggle 按钮
6. **道具百科**：Tab 布局（持有道具/树果/进化石）+ 分类筛选 + tips 卡片

### 数据源
- PokeCamp (https://pokecamp.cc/zh/champions/pokemon/) — 使用率/性格/道具/招式/队友分布
- Serebii (https://www.serebii.net/pokemonchampions/items.shtml) — 道具列表
- 竞技经验 — 使用建议/角色评价/阵容适配

---

## 2026-06-19 — 数据修正：图鉴仅保留 Champions 可用宝可梦

### 问题
图鉴页面之前显示了全部 905 只宝可梦（从 PokeAPI 拉取的全量数据），但 Pokémon Champions 实际只有 **208 种基础宝可梦 + 73 种 Mega 进化形态（75 个 Mega 形态）** 可用。

### 数据源
- **Serebii.net** (https://www.serebii.net/pokemonchampions/pokemon.shtml) — 权威数据，列出了所有可用 ID
- **Bulbapedia** 确认 208 species + 76 Mega Evolutions
- **game8.co** 确认 269 total (including megas/forms)

### 修复内容
1. `data/pokemon.json` 从 905 条筛选为仅 208 条 Champions 可用宝可梦
2. 补充了 22 只 Gen 9 宝可梦数据（PokeAPI fetch 脚本原来只拉到 #905）
3. 每只宝可梦增加 `hasMega` 和 `megaForms` 字段
4. `data/names-zh.json` 更新为 208 只完整中文名映射
5. 图鉴页面逻辑改为只展示 Champions 可用宝可梦
6. 修复字体加载问题（Google Fonts → 本地 Inter woff2）

### 技术细节
- Serebii 列表解析：正则匹配 `#XXXX Name` 和 `#XXXX Mega Name` 格式
- 新增 Mega 形态标记（73 种基础有 Mega，包含经典 40+ 和新增 30+）
- 新 Mega 标记逻辑：不在经典 Mega 列表中的即为 Champions 新增
- 部分宝可梦有地区形态（Alolan Ninetales、Galarian Stunfisk 等），Serebii 列出为同 ID 重复

### 待改进
- [ ] 接入 Pikalytics Champions 真实使用率数据（游戏正式上线后）
- [ ] 补充地区形态的独立显示（目前同 ID 合并）
- [ ] Mega 进化详细种族值数据（需要额外数据源）
- [ ] 中文招式名映射

---

## 2026-06-19 — Phase 7: 真实数据接入 + PWA + SEO + CI/CD

### 新增
- `src/lib/data.ts` — 统一数据加载层（Server Component 读 JSON）
- `data/builds.json` — 8 只热门宝可梦 × 3 套配招 = 24 套详细配置
- `.github/workflows/daily-update.yml` — 每日自动数据更新 workflow
- `public/manifest.json` — PWA 配置（暗色主题、独立模式）
- `public/robots.txt` + `public/sitemap.xml` — SEO
- OpenGraph + Twitter Card metadata

### 重写
- 图鉴列表页 → Server/Client 分离，支持搜索+属性+Tier 筛选
- 图鉴详情页 → 种族值可视化 + 配招集成
- 配招推荐页 → 可展开详情（SP分配/对局分析/招式标签）
- 技能百科页 → Champions 改动高亮 + 属性/分类/改动筛选
- Meta 分析页 → TOP10 使用率进度条 + 4 大 Archetype 卡片 + 规则摘要

---

## 2026-06-19 — Phase 0-5: 项目初始化 + 全页面开发

### 架构
- Next.js 16 (App Router) + TypeScript + Tailwind CSS 4 + shadcn/ui
- @smogon/calc 伤害计算引擎 + SP→EV×8 转换适配
- Zustand 状态管理 + Fuse.js 模糊搜索
- 暗色主题 (#0f1117 背景 + #fbbf24 金色强调)

### 页面
1. `/` — 首页（4 功能入口卡片）
2. `/calc` — 伤害计算器（攻防双面板 + 天气/地形/双打）
3. `/pokedex` — 图鉴列表
4. `/pokedex/[name]` — 图鉴详情
5. `/moves` — 技能百科
6. `/items` — 道具百科
7. `/builds` — 配招推荐
8. `/teams` — 队伍展示
9. `/meta` — Meta 分析

### 部署
- GitHub: https://github.com/fankidark/pokemon-champions-guide
- Vercel: 自动部署，push 即生效
