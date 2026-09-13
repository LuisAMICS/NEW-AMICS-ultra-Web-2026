import "server-only";
import { and, asc, desc, eq, ilike, inArray, lte, or, sql, count } from "drizzle-orm";
import { getDb, schema } from "@/db";
import { isRangeAvailable, longestFreeRun, slotsForDate } from "@/lib/availability";
import { LISTING_TYPES, AMENITIES, type Amenity, type ListingType } from "@/lib/constants";
import { isValidISODate } from "@/lib/utils";

export type ListingSummary = {
  id: string;
  slug: string;
  title: string;
  type: ListingType;
  city: string;
  country: string;
  neighborhood: string | null;
  lat: number | null;
  lng: number | null;
  hourlyRate: number;
  currency: string;
  minHours: number;
  capacity: number;
  ratingAvg: number;
  ratingCount: number;
  instantBook: boolean;
  engineerAvailable: boolean;
  offPeakDiscount: number;
  featured: boolean;
  photo: string | null;
};

const summaryWith = { photos: { orderBy: asc(schema.listingPhotos.position), limit: 1 } } as const;

function toSummary(l: typeof schema.listings.$inferSelect & { photos: { url: string }[] }): ListingSummary {
  return {
    id: l.id,
    slug: l.slug,
    title: l.title,
    type: l.type,
    city: l.city,
    country: l.country,
    neighborhood: l.neighborhood,
    lat: l.lat,
    lng: l.lng,
    hourlyRate: l.hourlyRate,
    currency: l.currency,
    minHours: l.minHours,
    capacity: l.capacity,
    ratingAvg: l.ratingAvg,
    ratingCount: l.ratingCount,
    instantBook: l.instantBook,
    engineerAvailable: l.engineerAvailable,
    offPeakDiscount: l.offPeakDiscount,
    featured: l.featured,
    photo: l.photos[0]?.url ?? null,
  };
}

export async function getFeaturedListings(limit = 8): Promise<ListingSummary[]> {
  const db = await getDb();
  const rows = await db.query.listings.findMany({
    where: eq(schema.listings.status, "published"),
    with: summaryWith,
    orderBy: [desc(schema.listings.featured), desc(schema.listings.ratingAvg), desc(schema.listings.ratingCount)],
    limit,
  });
  return rows.map(toSummary);
}

export async function getSiteStats() {
  const db = await getDb();
  const [[listingsCount], [citiesCount], [bookingsCount]] = await Promise.all([
    db.select({ n: count() }).from(schema.listings).where(eq(schema.listings.status, "published")),
    db.select({ n: sql<number>`count(distinct ${schema.listings.city})` }).from(schema.listings).where(eq(schema.listings.status, "published")),
    db.select({ n: sql<number>`coalesce(sum(${schema.listings.bookingCount}), 0)` }).from(schema.listings),
  ]);
  return { listings: Number(listingsCount.n), cities: Number(citiesCount.n), sessions: Number(bookingsCount.n) };
}

export async function getCities(): Promise<{ city: string; country: string; n: number }[]> {
  const db = await getDb();
  const rows = await db
    .select({ city: schema.listings.city, country: schema.listings.country, n: count() })
    .from(schema.listings)
    .where(eq(schema.listings.status, "published"))
    .groupBy(schema.listings.city, schema.listings.country)
    .orderBy(desc(count()), asc(schema.listings.city));
  return rows.map((r) => ({ ...r, n: Number(r.n) }));
}

export type SearchParams = {
  q?: string;
  date?: string;
  from?: number;
  to?: number;
  type?: ListingType;
  max?: number; // max hourly rate in currency units (applied to listing.hourlyRate/100 regardless of currency)
  amenities?: Amenity[];
  instant?: boolean;
  engineer?: boolean;
  sort?: "recommended" | "price_asc" | "price_desc" | "rating";
};

export function parseSearchParams(raw: Record<string, string | string[] | undefined>): SearchParams {
  const get = (k: string) => (Array.isArray(raw[k]) ? raw[k]?.[0] : raw[k]) as string | undefined;
  const type = get("type");
  const from = Number(get("from"));
  const to = Number(get("to"));
  const max = Number(get("max"));
  const amenities = (get("amenities") ?? "")
    .split(",")
    .map((a) => a.trim())
    .filter((a): a is Amenity => (AMENITIES as readonly string[]).includes(a));
  const sort = get("sort");
  return {
    q: get("q")?.trim() || undefined,
    date: isValidISODate(get("date")) ? get("date") : undefined,
    from: Number.isFinite(from) && from >= 0 && from < 24 && get("from") ? from : undefined,
    to: Number.isFinite(to) && to > 0 && to <= 24 && get("to") ? to : undefined,
    type: type && (LISTING_TYPES as readonly string[]).includes(type) ? (type as ListingType) : undefined,
    max: Number.isFinite(max) && max > 0 ? max : undefined,
    amenities: amenities.length ? amenities : undefined,
    instant: get("instant") === "1",
    engineer: get("engineer") === "1",
    sort: sort === "price_asc" || sort === "price_desc" || sort === "rating" ? sort : "recommended",
  };
}

export type SearchResult = ListingSummary & { freeHours?: number };

export async function searchListings(params: SearchParams): Promise<SearchResult[]> {
  const db = await getDb();
  const conditions = [eq(schema.listings.status, "published")];
  if (params.q) {
    const like = `%${params.q}%`;
    conditions.push(
      or(ilike(schema.listings.city, like), ilike(schema.listings.neighborhood, like), ilike(schema.listings.title, like), ilike(schema.listings.country, like))!,
    );
  }
  if (params.type) conditions.push(eq(schema.listings.type, params.type));
  if (params.max) conditions.push(lte(schema.listings.hourlyRate, Math.round(params.max * 100)));
  if (params.instant) conditions.push(eq(schema.listings.instantBook, true));
  if (params.engineer) conditions.push(eq(schema.listings.engineerAvailable, true));
  if (params.amenities?.length) conditions.push(sql`${schema.listings.amenities} @> ${JSON.stringify(params.amenities)}::jsonb`);

  const orderBy =
    params.sort === "price_asc"
      ? [asc(schema.listings.hourlyRate)]
      : params.sort === "price_desc"
        ? [desc(schema.listings.hourlyRate)]
        : params.sort === "rating"
          ? [desc(schema.listings.ratingAvg), desc(schema.listings.ratingCount)]
          : [desc(schema.listings.featured), desc(schema.listings.ratingCount), desc(schema.listings.ratingAvg)];

  const rows = await db.query.listings.findMany({ where: and(...conditions), with: summaryWith, orderBy, limit: 60 });
  if (!params.date) return rows.map(toSummary);

  // Availability filter for the requested date.
  const ids = rows.map((r) => r.id);
  if (!ids.length) return [];
  const [booked, blocked] = await Promise.all([
    db
      .select({ listingId: schema.bookings.listingId, startHour: schema.bookings.startHour, endHour: schema.bookings.endHour })
      .from(schema.bookings)
      .where(and(inArray(schema.bookings.listingId, ids), eq(schema.bookings.date, params.date), inArray(schema.bookings.status, ["pending", "confirmed"]))),
    db.select({ listingId: schema.blockedDates.listingId }).from(schema.blockedDates).where(and(inArray(schema.blockedDates.listingId, ids), eq(schema.blockedDates.date, params.date))),
  ]);
  const blockedSet = new Set(blocked.map((b) => b.listingId));
  const results: SearchResult[] = [];
  for (const row of rows) {
    const ranges = booked.filter((b) => b.listingId === row.id);
    const isBlocked = blockedSet.has(row.id);
    if (params.from !== undefined && params.to !== undefined && params.to > params.from) {
      if (!isRangeAvailable(row.openingHours, params.date, params.from, params.to, ranges, isBlocked)) continue;
      results.push({ ...toSummary(row), freeHours: params.to - params.from });
    } else {
      const { open, slots } = slotsForDate(row.openingHours, params.date, ranges, isBlocked);
      const free = open ? longestFreeRun(slots) : 0;
      if (free < row.minHours) continue;
      results.push({ ...toSummary(row), freeHours: free });
    }
  }
  return results;
}

export async function getListingBySlug(slug: string) {
  const db = await getDb();
  return db.query.listings.findFirst({
    where: eq(schema.listings.slug, slug),
    with: {
      host: { columns: { id: true, name: true, avatarUrl: true, bio: true, createdAt: true } },
      photos: { orderBy: asc(schema.listingPhotos.position) },
      addons: { orderBy: asc(schema.listingAddons.position) },
      blockedDates: true,
      reviews: { orderBy: desc(schema.reviews.createdAt), with: { author: { columns: { id: true, name: true, avatarUrl: true } } } },
    },
  });
}

export type ListingDetail = NonNullable<Awaited<ReturnType<typeof getListingBySlug>>>;

export async function getListingById(id: string) {
  const db = await getDb();
  return db.query.listings.findFirst({
    where: eq(schema.listings.id, id),
    with: { photos: { orderBy: asc(schema.listingPhotos.position) }, addons: { orderBy: asc(schema.listingAddons.position) }, blockedDates: true },
  });
}

/** Bookings that occupy hours on a listing for a range of dates (inclusive). */
export async function getBookedRanges(listingId: string, dates: string[]) {
  if (!dates.length) return [];
  const db = await getDb();
  return db
    .select({ date: schema.bookings.date, startHour: schema.bookings.startHour, endHour: schema.bookings.endHour })
    .from(schema.bookings)
    .where(and(eq(schema.bookings.listingId, listingId), inArray(schema.bookings.date, dates), inArray(schema.bookings.status, ["pending", "confirmed"])));
}

export async function getSimilarListings(listing: { id: string; city: string; type: ListingType }, limit = 4): Promise<ListingSummary[]> {
  const db = await getDb();
  const rows = await db.query.listings.findMany({
    where: and(eq(schema.listings.status, "published"), or(eq(schema.listings.city, listing.city), eq(schema.listings.type, listing.type)), sql`${schema.listings.id} <> ${listing.id}`),
    with: summaryWith,
    orderBy: [desc(sql`${schema.listings.city} = ${listing.city}`), desc(schema.listings.ratingAvg)],
    limit,
  });
  return rows.map(toSummary);
}

export async function getHostCounts(hostId: string) {
  const db = await getDb();
  const [row] = await db.select({ n: count() }).from(schema.listings).where(and(eq(schema.listings.hostId, hostId), eq(schema.listings.status, "published")));
  return Number(row?.n ?? 0);
}
