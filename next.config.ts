import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable static image optimization
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
        pathname: "/PokeAPI/sprites/**",
      },
      {
        protocol: "https",
        hostname: "play.pokemonshowdown.com",
        pathname: "/sprites/**",
      },
    ],
    unoptimized: true, // For static export compatibility
  },
};

export default nextConfig;
