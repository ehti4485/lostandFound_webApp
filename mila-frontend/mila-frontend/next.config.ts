import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // Build ke waqt ESLint errors ignore karega
  },
};

export default nextConfig;

