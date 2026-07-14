import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Add remote hotel/destination image hosts here as content sources are finalized
    remotePatterns: [],
  },
  // Security headers — see Architecture doc §13
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
