import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep Prisma's native engine out of the bundler.
  serverExternalPackages: ["@prisma/client"],
};

export default nextConfig;
