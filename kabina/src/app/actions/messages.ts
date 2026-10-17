"use server";

import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getDb, schema } from "@/db";
import { getCurrentUser } from "@/lib/auth";
import { newId } from "@/lib/utils";

/** Finds or creates the conversation between the current user and a listing's host. */
export async function startConversation(formData: FormData) {
  const listingId = String(formData.get("listingId") ?? "");
  const bookingId = formData.get("bookingId") ? String(formData.get("bookingId")) : null;
  const back = String(formData.get("back") ?? "/");
  const user = await getCurrentUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(back)}`);
  const db = await getDb();
  const listing = await db.query.listings.findFirst({ where: eq(schema.listings.id, listingId), columns: { id: true, hostId: true } });
  if (!listing) redirect(back);
  const id = await getOrCreateConversation(listing.id, listing.hostId, user.id, bookingId);
  redirect(`/account/messages/${id}`);
}

export async function getOrCreateConversation(listingId: string, hostId: string, guestId: string, bookingId: string | null) {
  const db = await getDb();
  const existing = await db.query.conversations.findFirst({ where: and(eq(schema.conversations.listingId, listingId), eq(schema.conversations.guestId, guestId)), columns: { id: true, bookingId: true } });
  if (existing) {
    if (!existing.bookingId && bookingId) await db.update(schema.conversations).set({ bookingId }).where(eq(schema.conversations.id, existing.id));
    return existing.id;
  }
  const id = newId();
  await db.insert(schema.conversations).values({ id, listingId, hostId, guestId, bookingId });
  return id;
}

export async function sendMessage(formData: FormData) {
  const conversationId = String(formData.get("conversationId") ?? "");
  const body = String(formData.get("body") ?? "").trim().slice(0, 2000);
  const user = await getCurrentUser();
  if (!user || !body) return;
  const db = await getDb();
  const conv = await db.query.conversations.findFirst({ where: eq(schema.conversations.id, conversationId), columns: { id: true, guestId: true, hostId: true } });
  if (!conv || (conv.guestId !== user.id && conv.hostId !== user.id)) return;
  await db.insert(schema.messages).values({ id: newId(), conversationId, senderId: user.id, body });
  await db.update(schema.conversations).set({ lastMessageAt: new Date() }).where(eq(schema.conversations.id, conversationId));
  revalidatePath(`/account/messages/${conversationId}`);
  revalidatePath("/account/messages");
}
