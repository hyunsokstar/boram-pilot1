/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    // Backend origin for proxying API calls
    const backend = process.env.BACKEND_URL || 'http://localhost:8080';
    return [
      {
        // Client will call /backend/... over the same origin (HTTPS),
        // Next.js will proxy to backend (HTTP) server-side, avoiding mixed content.
        source: '/backend/:path*',
        destination: `${backend}/:path*`,
      },
    ];
  },
};

export default nextConfig;
