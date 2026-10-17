import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getDb, schema } from "@/db";
import { getStripe } from "@/lib/stripe";

export async function POST(req: Request) {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !secret) return NextResponse.json({ error: "Stripe not configured" }, { status: 501 });
  const signature = req.headers.get("stripe-signature") ?? "";
  const payload = await req.text();
  let event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, secret);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }
  if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
    const session = event.data.object;
    const bookingId = session.metadata?.bookingId;
    if (bookingId) {
      const db = await getDb();
      const booking = await db.query.bookings.findFirst({ where: eq(schema.bookings.id, bookingId), with: { listing: { columns: { instantBook: true } } } });
      if (booking && booking.paymentStatus === "unpaid") {
        const now = new Date();
        await db
          .update(schema.bookings)
          .set({
            paymentStatus: "paid",
            stripePaymentIntentId: typeof session.payment_intent === "string" ? session.payment_intent : null,
            status: booking.listing.instantBook ? "confirmed" : "pending",
            confirmedAt: booking.listing.instantBook ? now : null,
            updatedAt: now,
          })
          .where(eq(schema.bookings.id, bookingId));
      }
    }
  }
  if (event.type === "checkout.session.expired") {
    const bookingId = event.data.object.metadata?.bookingId;
    if (bookingId) {
      const db = await getDb();
      await db.update(schema.bookings).set({ status: "cancelled", cancelledBy: "guest", cancelledAt: new Date() }).where(eq(schema.bookings.id, bookingId));
    }
  }
  return NextResponse.json({ received: true });
}
