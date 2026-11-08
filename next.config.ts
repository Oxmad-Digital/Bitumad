import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // app/global-not-found.tsx: the 404 page shared by the site and admin root layouts.
    globalNotFound: true,
  },
  async headers() {
    return [
      // The admin is never framed nor indexed.
      {
        source: "/admin/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Content-Security-Policy", value: "frame-ancestors 'none'; base-uri 'self'; object-src 'none'; form-action 'self'" },
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
          { key: "Referrer-Policy", value: "same-origin" },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
    minimumCacheTTL: 86400,
  },
};

export default nextConfig;
