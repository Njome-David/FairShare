import type { NextConfig } from "next";
import withPWA from "@ducanh2912/next-pwa";

const nextConfig: NextConfig = {
  webpack: (config) => config,
  turbopack: {},
};

const pwaConfig = withPWA({
  dest: "public",
  register: true,
  disable: process.env.NODE_ENV === "development",
  workboxOptions: {
    skipWaiting: true,        // ← Déplacé ici
    clientsClaim: true,       // Optionnel : prend le contrôle immédiatement
  },
})(nextConfig);

export default pwaConfig;