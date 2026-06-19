# 🏆 Pokémon Champions 攻略站

面向 Pokémon Champions (2026) 竞技玩家的一站式攻略工具网站。

## 功能

- 📖 **图鉴** — 种族值、属性、特性、可学招式 (含 Champions 修改)
- 🔢 **伤害计算器** — 基于 @smogon/calc 引擎，支持 Mega/天气/地形
- ⚔️ **配招推荐** — 每只宝可梦 3+ 套配置，含详细理由解析
- 👥 **队伍构建器** — 类型覆盖/威胁评估/速度线对比
- 📊 **Meta 分析** — 使用率排名/Tier List/每日快报
- 📚 **技能/道具百科** — 竞技要点/联动关系/使用场景

## 技术栈

- **Next.js 15** (App Router) + TypeScript
- **Tailwind CSS 4** + shadcn/ui
- **@smogon/calc** — 伤害计算引擎
- **@pkmn/data** — Pokemon 数据层
- **Zustand** — 状态管理
- **Vercel** — 部署

## 开发

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # 生产构建
npm run test    # 运行测试
```

## 数据更新

```bash
npm run scripts:fetch   # 抓取最新 Meta 数据
npm run scripts:build   # 重建静态 JSON
```

## License

MIT
