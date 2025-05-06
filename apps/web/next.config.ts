import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["raw.githubusercontent.com", "assets.coingecko.com", "cdn.jsdelivr.net"],
  },
};

export default nextConfig;
