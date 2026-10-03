import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

// Pin the Turbopack root to this project. Otherwise a stray package-lock.json
// in a parent directory can make Turbopack pick the wrong workspace root.
const projectRoot = dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  // Keep Prisma's native engine out of the bundler.
  serverExternalPackages: ["@prisma/client"],
  turbopack: {
    root: projectRoot,
  },
};

export default nextConfig;
