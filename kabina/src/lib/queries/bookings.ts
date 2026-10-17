import "server-only";
import { and, asc, desc, eq, inArray, lt, or, sql } from "drizzle-orm";
import { getDb, schema } from "@/db";
import { todayISO } from "@/lib/utils";

const listingSummary = {
  columns: { id: true, slug: true, title: true, city: true, neighborhood: true, address: true, type: true, currency: true, hostId: true, cancellationPolicy: true, timezone: true },
  with: { photos: { orderBy: asc(schema.listingPhotos.position), limit: 1 } },
} as const;

/** Marks confirmed sessions whose day has passed as completed. Cheap enough to run on page loads. */
export async function sweepCompletedBookings() {
  const db = await getDb();
  await db
    .update(schema.bookings)
    .set({ status: "completed", updatedAt: new Date() })
    .where(and(eq(schema.bookings.status, "confirmed"), lt(schema.bookings.date, todayISO())));
}

export async function getBookingById(id: string) {
  const db = await getDb();
  return db.query.bookings.findFirst({
    where: eq(schema.bookings.id, id),
    with: {
      listing: listingSummary,
      guest: { columns: { id: true, name: true, avatarUrl: true, bio: true, email: true } },
      host: { columns: { id: true, name: true, avatarUrl: true } },
      review: true,
    },
  });
}

export type BookingWithRelations = NonNullable<Awaited<ReturnType<typeof getBookingById>>>;

export async function getGuestBookings(guestId: string) {
  const db = await getDb();
  const rows = await db.query.bookings.findMany({
    where: eq(schema.bookings.guestId, guestId),
    orderBy: [desc(schema.bookings.date), desc(schema.bookings.startHour)],
    with: { listing: listingSummary, host: { columns: { id: true, name: true, avatarUrl: true } }, review: { columns: { id: true } } },
  });
  const today = todayISO();
  const upcoming = rows.filter((b) => b.date >= today && (b.status === "pending" || b.status === "confirmed")).sort((a, b) => a.date.localeCompare(b.date) || a.startHour - b.startHour);
  const past = rows.filter((b) => !upcoming.includes(b));
  return { upcoming, past };
}

export async function getHostBookings(hostId: string) {
  const db = await getDb();
  const rows = await db.query.bookings.findMany({
    where: eq(schema.bookings.hostId, hostId),
    orderBy: [desc(schema.bookings.date), desc(schema.bookings.startHour)],
    with: { listing: listingSummary, guest: { columns: { id: true, name: true, avatarUrl: true } } },
  });
  const today = todayISO();
  const pending = rows.filter((b) => b.status === "pending" && b.date >= today).sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  const upcoming = rows.filter((b) => b.status === "confirmed" && b.date >= today).sort((a, b) => a.date.localeCompare(b.date) || a.startHour - b.startHour);
  const past = rows.filter((b) => !pending.includes(b) && !upcoming.includes(b));
  return { all: rows, pending, upcoming, past };
}

export type HostBooking = Awaited<ReturnType<typeof getHostBookings>>["all"][number];
export type GuestBooking = Awaited<ReturnType<typeof getGuestBookings>>["upcoming"][number];

export async function getHostStats(hostId: string) {
  const db = await getDb();
  const since = new Date(Date.now() - 30 * 864e5);
  const [earnings] = await db
    .select({ n: sql<number>`coalesce(sum(${schema.bookings.hostPayoutCents}), 0)` })
    .from(schema.bookings)
    .where(and(eq(schema.bookings.hostId, hostId), inArray(schema.bookings.status, ["confirmed", "completed"]), sql`${schema.bookings.createdAt} >= ${since}`));
  return { earnings30d: Number(earnings?.n ?? 0) };
}

export async function getHostEarnings(hostId: string) {
  const db = await getDb();
  const rows = await db.query.bookings.findMany({
    where: and(eq(schema.bookings.hostId, hostId), or(eq(schema.bookings.status, "completed"), eq(schema.bookings.status, "confirmed"))),
    orderBy: [desc(schema.bookings.date)],
    with: { listing: { columns: { id: true, title: true, currency: true } }, guest: { columns: { name: true } } },
  });
  const byMonth = new Map<string, { month: string; payout: number; sessions: number; currency: string }>();
  for (const b of rows) {
    const key = b.date.slice(0, 7);
    const entry = byMonth.get(key) ?? { month: key, payout: 0, sessions: 0, currency: b.currency };
    entry.payout += b.hostPayoutCents;
    entry.sessions += 1;
    byMonth.set(key, entry);
  }
  return { rows, months: Array.from(byMonth.values()).sort((a, b) => b.month.localeCompare(a.month)) };
}

export async function getConversationsForUser(userId: string) {
  const db = await getDb();
  const rows = await db.query.conversations.findMany({
    where: or(eq(schema.conversations.guestId, userId), eq(schema.conversations.hostId, userId)),
    orderBy: desc(schema.conversations.lastMessageAt),
    with: {
      listing: { columns: { id: true, slug: true, title: true }, with: { photos: { orderBy: asc(schema.listingPhotos.position), limit: 1 } } },
      guest: { columns: { id: true, name: true, avatarUrl: true } },
      host: { columns: { id: true, name: true, avatarUrl: true } },
      messages: { orderBy: desc(schema.messages.createdAt), limit: 1 },
    },
  });
  return rows;
}

export async function getConversation(id: string) {
  const db = await getDb();
  return db.query.conversations.findFirst({
    where: eq(schema.conversations.id, id),
    with: {
      listing: { columns: { id: true, slug: true, title: true, city: true }, with: { photos: { orderBy: asc(schema.listingPhotos.position), limit: 1 } } },
      guest: { columns: { id: true, name: true, avatarUrl: true } },
      host: { columns: { id: true, name: true, avatarUrl: true } },
      booking: { columns: { id: true, code: true, date: true, startHour: true, endHour: true, status: true } },
      messages: { orderBy: asc(schema.messages.createdAt), with: { sender: { columns: { id: true, name: true, avatarUrl: true } } } },
    },
  });
}
