import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "6syy6xk6ya.ufs.sh",
      },
    ],
  },
};

export default nextConfig;
