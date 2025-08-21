import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Disable ESLint during production builds
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Disable type checking during production builds (optional)
    ignoreBuildErrors: true,
  },
  experimental: {
    // Enable modern bundling features
    optimizePackageImports: ['framer-motion', 'three', '@react-three/fiber', '@react-three/drei']
  }
};

export default nextConfig;
