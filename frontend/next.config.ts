import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    // Ensure proper module resolution
    esmExternals: true,
  },
  webpack: (config, { isServer }) => {
    // Ensure proper path resolution for both client and server
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve('./src'),
    }

    // Add fallback for module resolution
    config.resolve.fallback = {
      ...config.resolve.fallback,
    }

    return config
  }
};

export default nextConfig;
