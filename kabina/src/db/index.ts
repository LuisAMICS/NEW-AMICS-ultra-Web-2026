import "server-only";
import type { ExtractTablesWithRelations } from "drizzle-orm";
import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";
import * as schema from "./schema";

export type Db = PgDatabase<PgQueryResultHKT, typeof schema, ExtractTablesWithRelations<typeof schema>>;

declare global {
  var __kabinaDb: Promise<Db> | undefined;
}

export const isDemoMode = !process.env.DATABASE_URL;
/** Demo accounts (and their one-click login) exist when running in memory or when the real DB is seeded with sample data. */
export const hasDemoAccounts = isDemoMode || process.env.SEED_DEMO_DATA === "1";

async function createDb(): Promise<Db> {
  if (process.env.DATABASE_URL) {
    const { drizzle } = await import("drizzle-orm/postgres-js");
    const { default: postgres } = await import("postgres");
    // prepare:false is required by Supabase's transaction pooler (port 6543).
    const client = postgres(process.env.DATABASE_URL, { prepare: false, max: 3 });
    const db = drizzle(client, { schema }) as unknown as Db;
    if (process.env.SEED_DEMO_DATA === "1") {
      // Loads the sample studios on first boot of an empty database. The transaction makes
      // concurrent cold starts safe: a second instance fails on the unique email and rolls back.
      const { seed } = await import("./seed");
      try {
        await db.transaction(async (tx) => seed(tx as unknown as Db));
      } catch (err) {
        console.warn("[kabina] demo seed skipped:", (err as Error).message);
      }
    }
    return db;
  }
  // Demo mode: an in-memory Postgres (PGlite) created on first use and seeded
  // with sample studios. Data lives as long as the server process does.
  const { PGlite } = await import("@electric-sql/pglite");
  const { drizzle } = await import("drizzle-orm/pglite");
  const { SCHEMA_SQL } = await import("./schema.sql");
  const { seed } = await import("./seed");
  const pg = new PGlite();
  await pg.exec(SCHEMA_SQL);
  const db = drizzle(pg, { schema }) as unknown as Db;
  await seed(db);
  return db;
}

export function getDb(): Promise<Db> {
  if (!globalThis.__kabinaDb) {
    globalThis.__kabinaDb = createDb().catch((err) => {
      globalThis.__kabinaDb = undefined;
      throw err;
    });
  }
  return globalThis.__kabinaDb;
}

export { schema };
