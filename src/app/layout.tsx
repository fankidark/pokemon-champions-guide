import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Geist_Mono } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
      className={`${inter.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Navbar />
        <div className="flex-1 pb-16 md:pb-0">{children}</div>
      </body>
    </html>
  );
}
