import "server-only";
import { and, desc, eq, inArray, asc } from "drizzle-orm";
import { getDb, schema } from "@/db";

export async function getFavoriteIds(userId: string | undefined, listingIds: string[]): Promise<Set<string>> {
  if (!userId || !listingIds.length) return new Set();
  const db = await getDb();
  const rows = await db
    .select({ listingId: schema.favorites.listingId })
    .from(schema.favorites)
    .where(and(eq(schema.favorites.userId, userId), inArray(schema.favorites.listingId, listingIds)));
  return new Set(rows.map((r) => r.listingId));
}

export async function getFavoriteListings(userId: string) {
  const db = await getDb();
  const rows = await db.query.favorites.findMany({
    where: eq(schema.favorites.userId, userId),
    orderBy: desc(schema.favorites.createdAt),
    with: { listing: { with: { photos: { orderBy: asc(schema.listingPhotos.position), limit: 1 } } } },
  });
  return rows.map((r) => r.listing);
}
