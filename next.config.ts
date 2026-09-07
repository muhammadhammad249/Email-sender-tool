import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/verify-otp',
        destination: '/register',
        permanent: false,
      },
    ];
  },
  async rewrites() {
    // In production (Vercel), Next.js App Router handles /api/* directly.
    // In local dev, proxy to the Express backend running on port 3001.
    if (process.env.NODE_ENV === 'production') return [];
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3001/api/:path*',
      },
    ];
  },
};

export default nextConfig;

