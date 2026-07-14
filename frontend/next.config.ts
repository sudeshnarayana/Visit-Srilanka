import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: import.meta.dirname,
  images: {
    // Real hotel/destination photos will come from Supabase Storage (Phase 9).
    // Unsplash is listed for placeholder imagery during design/dev only —
    // remove before production if not used for real content.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
    formats: ["image/avif", "image/webp"],
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
