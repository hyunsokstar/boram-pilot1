/** @type {import('next').NextConfig} */
const backend = process.env.BACKEND_URL ?? 'http://43.200.234.52:8080';

const nextConfig = {
  async rewrites() {
    return [
      { source: '/backend/:path*', destination: `${backend}/:path*` },
    ];
  },
};

export default nextConfig;
