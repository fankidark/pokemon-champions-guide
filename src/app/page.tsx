export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8">
      <div className="text-center space-y-6 max-w-2xl">
        <h1 className="text-4xl font-bold text-primary">
          🏆 Pokémon Champions 攻略站
        </h1>
        <p className="text-xl text-muted-foreground">
          成为真正的冠军 — 伤害计算 · 配招推荐 · 队伍构建 · Meta 分析
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8">
          {[
            { icon: "📖", label: "图鉴", href: "/pokedex" },
            { icon: "🔢", label: "计算器", href: "/calc" },
            { icon: "⚔️", label: "配招", href: "/builds" },
            { icon: "👥", label: "队伍", href: "/teams" },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-2 p-4 rounded-lg bg-card border border-border hover:border-primary transition-colors"
            >
              <span className="text-3xl">{item.icon}</span>
              <span className="text-sm font-medium">{item.label}</span>
            </a>
          ))}
        </div>
        <p className="text-sm text-muted-foreground pt-4">
          数据每日自动更新 · 基于 Pikalytics 真实对战数据
        </p>
      </div>
    </main>
  );
}
