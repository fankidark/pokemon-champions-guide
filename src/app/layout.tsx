import type { Metadata } from "next";
import localFont from "next/font/local";
import { Navbar } from "@/components/layout/Navbar";
import "./globals.css";

const sans = localFont({
  src: [
    { path: "../fonts/inter-latin.woff2", weight: "100 900", style: "normal" },
  ],
  variable: "--font-sans",
  fallback: ["ui-sans-serif", "system-ui", "-apple-system", "sans-serif"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Pokémon Champions 攻略站",
    template: "%s | Pokémon Champions 攻略站",
  },
  description:
    "Pokémon Champions 竞技对战攻略 — 伤害计算器、配招推荐、队伍构建、Meta 分析",
  keywords: [
    "Pokemon Champions",
    "宝可梦冠军",
    "伤害计算器",
    "配招推荐",
    "VGC",
    "Mega进化",
  ],
  manifest: "/manifest.json",
  themeColor: "#fbbf24",
  openGraph: {
    title: "Pokémon Champions 攻略站",
    description: "成为真正的冠军 — 伤害计算 · 配招推荐 · 队伍构建 · Meta 分析",
    type: "website",
    locale: "zh_CN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pokémon Champions 攻略站",
    description: "成为真正的冠军 — 伤害计算 · 配招推荐 · 队伍构建 · Meta 分析",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${sans.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Navbar />
        <div className="flex-1 pb-16 md:pb-0">{children}</div>
      </body>
    </html>
  );
}
