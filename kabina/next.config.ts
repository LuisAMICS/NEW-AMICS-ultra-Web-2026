import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // PGlite (in-memory Postgres used in demo mode) and postgres.js must run as
  // native Node modules instead of being bundled.
  serverExternalPackages: ["@electric-sql/pglite", "postgres"],
  outputFileTracingIncludes: {
    "/*": [
      "./node_modules/@electric-sql/pglite/dist/*.js",
      "./node_modules/@electric-sql/pglite/dist/*.wasm",
      "./node_modules/@electric-sql/pglite/dist/*.data",
    ],
  },
  images: {
    // Hosts upload photos from arbitrary hosts; the app renders them with <img>.
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;
