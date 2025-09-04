import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    // Ensure proper module resolution
    esmExternals: true,
  },
  webpack: (config) => {
    // Ensure proper path resolution
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': './src',
    }
    return config
  }
};

export default nextConfig;
