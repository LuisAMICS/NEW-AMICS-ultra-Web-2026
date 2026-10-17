// Seeds a real Postgres database (DATABASE_URL) with the demo studios.
// Usage: npm run db:push && npm run db:seed
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../src/db/schema";
import { seed } from "../src/db/seed";
import type { Db } from "../src/db/index";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set");
  process.exit(1);
}
const client = postgres(url, { max: 1, prepare: false });
const db = drizzle(client, { schema }) as unknown as Db;
await seed(db);
await client.end();
console.log("Seed complete");
