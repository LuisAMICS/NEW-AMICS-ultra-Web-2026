"use server";

import { and, eq, sql } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getDb, schema } from "@/db";
import { getCurrentUser } from "@/lib/auth";
import { getT } from "@/lib/i18n";
import { newId, todayISO } from "@/lib/utils";

const schemaReview = z.object({
  rating: z.coerce.number().int().min(1).max(5),
  ratingSound: z.coerce.number().int().min(1).max(5),
  ratingEquipment: z.coerce.number().int().min(1).max(5),
  ratingHost: z.coerce.number().int().min(1).max(5),
  ratingValue: z.coerce.number().int().min(1).max(5),
  comment: z.string().trim().min(10).max(2000),
});

export type ReviewState = { error?: string } | null;

export async function leaveReview(_prev: ReviewState, formData: FormData): Promise<ReviewState> {
  const { t } = await getT();
  const user = await getCurrentUser();
  const bookingId = String(formData.get("bookingId") ?? "");
  if (!user) redirect("/login");
  const parsed = schemaReview.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: t.common.genericError };
  const db = await getDb();
  const booking = await db.query.bookings.findFirst({ where: eq(schema.bookings.id, bookingId), with: { review: { columns: { id: true } } } });
  const canReview = booking && booking.guestId === user.id && !booking.review && (booking.status === "completed" || (booking.status === "confirmed" && booking.date < todayISO()));
  if (!canReview) redirect(`/bookings/${bookingId}`);
  await db.insert(schema.reviews).values({ id: newId(), bookingId, listingId: booking.listingId, authorId: user.id, ...parsed.data });
  if (booking.status !== "completed") await db.update(schema.bookings).set({ status: "completed" }).where(eq(schema.bookings.id, bookingId));
  const [agg] = await db.select({ avg: sql<number>`avg(${schema.reviews.rating})`, n: sql<number>`count(*)` }).from(schema.reviews).where(eq(schema.reviews.listingId, booking.listingId));
  await db
    .update(schema.listings)
    .set({ ratingAvg: Math.round(Number(agg.avg) * 100) / 100, ratingCount: Number(agg.n) })
    .where(eq(schema.listings.id, booking.listingId));
  revalidatePath(`/bookings/${bookingId}`);
  revalidatePath("/account/bookings");
  redirect(`/bookings/${bookingId}?reviewed=1`);
}

export async function replyToReview(formData: FormData) {
  const user = await getCurrentUser();
  const reviewId = String(formData.get("reviewId") ?? "");
  const reply = String(formData.get("reply") ?? "").trim().slice(0, 1000);
  if (!user || !reply) return;
  const db = await getDb();
  const review = await db.query.reviews.findFirst({ where: eq(schema.reviews.id, reviewId), with: { listing: { columns: { hostId: true, slug: true } } } });
  if (!review || review.listing.hostId !== user.id) return;
  await db.update(schema.reviews).set({ hostReply: reply }).where(and(eq(schema.reviews.id, reviewId)));
  revalidatePath(`/studios/${review.listing.slug}`);
}
