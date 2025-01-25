import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "grateful-squid-512.convex.cloud",
      },
    ],
  },
};

export default nextConfig;
