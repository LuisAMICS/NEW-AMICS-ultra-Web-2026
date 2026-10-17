"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getDb, schema } from "@/db";
import { getCurrentUser } from "@/lib/auth";

export async function toggleFavorite(listingId: string): Promise<{ ok: boolean; favorite?: boolean; login?: boolean }> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, login: true };
  const db = await getDb();
  const existing = await db
    .select({ listingId: schema.favorites.listingId })
    .from(schema.favorites)
    .where(and(eq(schema.favorites.userId, user.id), eq(schema.favorites.listingId, listingId)))
    .limit(1);
  if (existing.length) {
    await db.delete(schema.favorites).where(and(eq(schema.favorites.userId, user.id), eq(schema.favorites.listingId, listingId)));
    revalidatePath("/account/favorites");
    return { ok: true, favorite: false };
  }
  await db.insert(schema.favorites).values({ userId: user.id, listingId });
  revalidatePath("/account/favorites");
  return { ok: true, favorite: true };
}
