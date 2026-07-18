import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // MongoDB has no built-in object storage (unlike Supabase Storage) —
    // real hotel/destination photos will need S3, Cloudinary, or similar.
    // Add that host here once chosen. Unsplash is listed for placeholder
    // imagery during design/dev only — remove before production.
    remotePatterns: [
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
