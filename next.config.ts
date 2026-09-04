import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';
const backendUrl =
  process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') ||
  (isProd ? '' : 'http://localhost:3001');

const nextConfig: NextConfig = {
  async rewrites() {
    if (isProd) return []; // In production, rely on Vercel serverless functions / vercel.json
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`, // Proxies to backend in local dev
      },
    ];
  },
};

export default nextConfig;
