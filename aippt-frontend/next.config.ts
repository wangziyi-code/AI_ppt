import type { NextConfig } from "next";

const DEERFLOW_API = process.env.NEXT_PUBLIC_DEERFLOW_API || "http://localhost:8001";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${DEERFLOW_API}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
