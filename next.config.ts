import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Required by react-three-fiber: three ships untranspiled ESM.
  transpilePackages: ["three"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com"
      }
    ]
  }
};

export default nextConfig;
