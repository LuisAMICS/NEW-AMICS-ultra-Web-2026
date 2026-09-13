import "server-only";
import { asc, desc, eq } from "drizzle-orm";
import { getDb, schema } from "@/db";

export async function getHostListings(hostId: string) {
  const db = await getDb();
  return db.query.listings.findMany({
    where: eq(schema.listings.hostId, hostId),
    orderBy: [desc(schema.listings.updatedAt)],
    with: { photos: { orderBy: asc(schema.listingPhotos.position), limit: 1 } },
  });
}

export async function getHostListingForEdit(id: string, hostId: string) {
  const db = await getDb();
  const listing = await db.query.listings.findFirst({
    where: eq(schema.listings.id, id),
    with: { photos: { orderBy: asc(schema.listingPhotos.position) }, addons: { orderBy: asc(schema.listingAddons.position) } },
  });
  return listing && listing.hostId === hostId ? listing : null;
}

export async function getListingCalendar(listingId: string, monthPrefix: string) {
  const db = await getDb();
  const [bookings, blocked] = await Promise.all([
    db.query.bookings.findMany({
      where: eq(schema.bookings.listingId, listingId),
      columns: { id: true, date: true, startHour: true, endHour: true, status: true, code: true },
      with: { guest: { columns: { name: true } } },
    }),
    db.query.blockedDates.findMany({ where: eq(schema.blockedDates.listingId, listingId) }),
  ]);
  return {
    bookings: bookings.filter((b) => b.date.startsWith(monthPrefix) && (b.status === "pending" || b.status === "confirmed" || b.status === "completed")),
    blocked: new Set(blocked.filter((b) => b.date.startsWith(monthPrefix)).map((b) => b.date)),
  };
}
