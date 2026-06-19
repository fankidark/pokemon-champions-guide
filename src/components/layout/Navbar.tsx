"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/pokedex", label: "图鉴", icon: "📖" },
  { href: "/moves", label: "技能", icon: "⚡" },
  { href: "/items", label: "道具", icon: "🎒" },
  { href: "/calc", label: "计算器", icon: "🔢" },
  { href: "/builds", label: "配招", icon: "⚔️" },
  { href: "/teams", label: "队伍", icon: "👥" },
  { href: "/meta", label: "Meta", icon: "📊" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop top navbar */}
      <nav className="hidden md:flex items-center h-14 border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50 px-6">
        <Link href="/" className="text-primary font-bold text-lg mr-8">
          🏆 Champions
        </Link>
        <div className="flex gap-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                pathname?.startsWith(item.href)
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
            >
              {item.icon} {item.label}
            </Link>
          ))}
        </div>
      </nav>

      {/* Mobile bottom tab bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 border-t border-border bg-card/95 backdrop-blur-sm z-50 flex items-center justify-around px-2 safe-area-pb">
        {NAV_ITEMS.slice(0, 5).map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-md text-[10px] ${
              pathname?.startsWith(item.href)
                ? "text-primary"
                : "text-muted-foreground"
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </>
  );
}
