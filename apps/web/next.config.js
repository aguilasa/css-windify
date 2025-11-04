/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@css-windify/core'],
  // Turbopack configuration (Next.js 16+)
  turbopack: {},
};

module.exports = nextConfig;
