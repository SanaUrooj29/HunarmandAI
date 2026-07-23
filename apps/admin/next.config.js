/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow building without type-checking blocking (dev convenience)
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
};

module.exports = nextConfig;
