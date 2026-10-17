"use server";

import { and, eq, inArray } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getDb, schema } from "@/db";
import { getCurrentUser } from "@/lib/auth";
import { getT } from "@/lib/i18n";
import { isRangeAvailable } from "@/lib/availability";
import { hoursUntil, offPeakPct, quote, refundFraction, type AddonInput } from "@/lib/pricing";
import { getStripe } from "@/lib/stripe";
import { getBaseUrl } from "@/lib/base-url";
import { isValidISODate, newId, shortId, todayISO } from "@/lib/utils";
import { getOrCreateConversation } from "./messages";

export type BookingActionState = { error?: string } | null;

export async function createBooking(_prev: BookingActionState, formData: FormData): Promise<BookingActionState> {
  const { t } = await getT();
  const user = await getCurrentUser();
  const listingId = String(formData.get("listingId") ?? "");
  const date = String(formData.get("date") ?? "");
  const startHour = Number(formData.get("from"));
  const endHour = Number(formData.get("to"));
  const addonIds = String(formData.get("addons") ?? "").split(",").filter(Boolean);
  const engineer = formData.get("engineer") === "1";
  const notes = String(formData.get("notes") ?? "").trim().slice(0, 1500) || null;

  if (!user) redirect(`/login?next=${encodeURIComponent(`/studios`)}`);
  if (!listingId || !isValidISODate(date) || !Number.isInteger(startHour) || !Number.isInteger(endHour) || date < todayISO()) return { error: t.booking.invalid };

  const db = await getDb();
  const listing = await db.query.listings.findFirst({ where: eq(schema.listings.id, listingId), with: { addons: true, blockedDates: true } });
  if (!listing || listing.status !== "published") return { error: t.booking.invalid };
  if (listing.hostId === user.id) return { error: t.booking.ownListing };
  const hours = endHour - startHour;
  if (hours < listing.minHours || hours > listing.maxHours) return { error: t.booking.invalid };

  const booked = await db
    .select({ startHour: schema.bookings.startHour, endHour: schema.bookings.endHour })
    .from(schema.bookings)
    .where(and(eq(schema.bookings.listingId, listing.id), eq(schema.bookings.date, date), inArray(schema.bookings.status, ["pending", "confirmed"])));
  const blocked = listing.blockedDates.some((b) => b.date === date);
  if (!isRangeAvailable(listing.openingHours, date, startHour, endHour, booked, blocked)) return { error: t.booking.conflict };

  const addons: AddonInput[] = listing.addons.filter((a) => addonIds.includes(a.id)).map((a) => ({ name: a.name, priceCents: a.priceCents, unit: a.unit }));
  if (engineer && listing.engineerAvailable && listing.engineerRate) addons.push({ name: t.listing.engineerAddon, priceCents: listing.engineerRate, unit: "hour" });
  const q = quote(listing.hourlyRate, hours, addons, offPeakPct(listing, date, endHour));

  const stripe = getStripe();
  const id = newId();
  const now = new Date();
  const instant = listing.instantBook;
  await db.insert(schema.bookings).values({
    id,
    code: `KB-${shortId(6)}`,
    listingId: listing.id,
    guestId: user.id,
    hostId: listing.hostId,
    date,
    startHour,
    endHour,
    hours,
    currency: listing.currency,
    hourlyRate: listing.hourlyRate,
    subtotalCents: q.subtotalCents,
    discountCents: q.discountCents,
    addonsCents: q.addonsCents,
    guestFeeCents: q.guestFeeCents,
    hostFeeCents: q.hostFeeCents,
    totalCents: q.totalCents,
    hostPayoutCents: q.hostPayoutCents,
    addons: q.addons,
    notes,
    status: instant && !stripe ? "confirmed" : "pending",
    paymentStatus: stripe ? "unpaid" : "demo",
    cancellationPolicy: listing.cancellationPolicy,
    confirmedAt: instant && !stripe ? now : null,
    createdAt: now,
    updatedAt: now,
  });
  await db.update(schema.listings).set({ bookingCount: listing.bookingCount + 1 }).where(eq(schema.listings.id, listing.id));

  if (stripe) {
    // Real payment: Stripe Checkout. The booking is confirmed by the webhook once paid.
    const base = await getBaseUrl();
    const host = await db.query.users.findFirst({ where: eq(schema.users.id, listing.hostId), columns: { stripeAccountId: true } });
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: user.email,
      line_items: [{ quantity: 1, price_data: { currency: listing.currency.toLowerCase(), unit_amount: q.totalCents, product_data: { name: listing.title, description: `${date} ${startHour}:00–${endHour}:00 · ${hours} h` } } }],
      metadata: { bookingId: id },
      success_url: `${base}/bookings/${id}?paid=1`,
      cancel_url: `${base}/studios/${listing.slug}?cancelled=1`,
      ...(host?.stripeAccountId ? { payment_intent_data: { application_fee_amount: q.hostFeeCents + q.guestFeeCents, transfer_data: { destination: host.stripeAccountId } } } : {}),
    });
    await db.update(schema.bookings).set({ stripeSessionId: session.id }).where(eq(schema.bookings.id, id));
    redirect(session.url!);
  }

  revalidatePath("/account/bookings");
  revalidatePath("/host");
  redirect(`/bookings/${id}?new=1`);
}

export async function cancelBooking(formData: FormData) {
  const id = String(formData.get("bookingId") ?? "");
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const db = await getDb();
  const booking = await db.query.bookings.findFirst({ where: eq(schema.bookings.id, id) });
  if (!booking || (booking.guestId !== user.id && booking.hostId !== user.id)) redirect("/account/bookings");
  if (booking.status !== "pending" && booking.status !== "confirmed") redirect(`/bookings/${id}`);
  const byHost = booking.hostId === user.id;
  const paid = booking.paymentStatus === "paid" || booking.paymentStatus === "demo";
  const fraction = byHost ? 1 : refundFraction(booking.cancellationPolicy, hoursUntil(booking.date, booking.startHour));
  const refundCents = paid && booking.status === "confirmed" ? Math.round(booking.totalCents * fraction) : paid ? booking.totalCents : 0;
  await db
    .update(schema.bookings)
    .set({ status: "cancelled", cancelledBy: byHost ? "host" : "guest", cancelledAt: new Date(), refundCents, paymentStatus: paid ? "refunded" : booking.paymentStatus, updatedAt: new Date() })
    .where(eq(schema.bookings.id, id));
  revalidatePath(`/bookings/${id}`);
  revalidatePath("/account/bookings");
  revalidatePath("/host/bookings");
  redirect(`/bookings/${id}`);
}

export async function respondBooking(formData: FormData) {
  const id = String(formData.get("bookingId") ?? "");
  const decision = formData.get("decision") === "accept" ? "accept" : "decline";
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const db = await getDb();
  const booking = await db.query.bookings.findFirst({ where: eq(schema.bookings.id, id) });
  if (!booking || booking.hostId !== user.id || booking.status !== "pending") redirect(`/bookings/${id}`);
  if (decision === "accept") {
    await db.update(schema.bookings).set({ status: "confirmed", confirmedAt: new Date(), updatedAt: new Date() }).where(eq(schema.bookings.id, id));
  } else {
    await db.update(schema.bookings).set({ status: "declined", updatedAt: new Date() }).where(eq(schema.bookings.id, id));
  }
  revalidatePath(`/bookings/${id}`);
  revalidatePath("/host");
  revalidatePath("/host/bookings");
  redirect(String(formData.get("back") ?? `/bookings/${id}`));
}

export async function messageAboutBooking(formData: FormData) {
  const id = String(formData.get("bookingId") ?? "");
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const db = await getDb();
  const booking = await db.query.bookings.findFirst({ where: eq(schema.bookings.id, id), columns: { id: true, listingId: true, guestId: true, hostId: true } });
  if (!booking || (booking.guestId !== user.id && booking.hostId !== user.id)) redirect("/account/messages");
  const convId = await getOrCreateConversation(booking.listingId, booking.hostId, booking.guestId, booking.id);
  redirect(`/account/messages/${convId}`);
}
