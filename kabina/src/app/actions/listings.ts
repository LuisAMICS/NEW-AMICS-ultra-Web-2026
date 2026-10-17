"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getDb, schema } from "@/db";
import { getCurrentUser } from "@/lib/auth";
import { getT } from "@/lib/i18n";
import { AMENITIES, CANCELLATION_POLICIES, CURRENCIES, EQUIPMENT_CATEGORIES, LISTING_TYPES, WEEKDAYS, type Amenity, type Equipment, type OpeningHours } from "@/lib/constants";
import { COUNTRY_CODES, TIMEZONES } from "@/lib/covers";
import { getStripe } from "@/lib/stripe";
import { getBaseUrl } from "@/lib/base-url";
import { isValidISODate, newId, shortId, slugify } from "@/lib/utils";

export type ListingFormState = { errors?: Record<string, string>; ok?: boolean } | null;

const num = (v: FormDataEntryValue | null, fallback = 0) => {
  const n = Number(String(v ?? "").replace(",", "."));
  return Number.isFinite(n) ? n : fallback;
};

const base = z.object({
  title: z.string().trim().min(5).max(120),
  type: z.enum(LISTING_TYPES),
  description: z.string().trim().min(40).max(5000),
  city: z.string().trim().min(2).max(80),
  country: z.string().trim().min(2).max(80),
  countryCode: z.enum(COUNTRY_CODES),
  neighborhood: z.string().trim().max(80).optional(),
  address: z.string().trim().max(200).optional(),
  timezone: z.enum(TIMEZONES),
  currency: z.enum(CURRENCIES),
  cancellationPolicy: z.enum(CANCELLATION_POLICIES),
  rules: z.string().trim().max(2000).optional(),
});

export async function saveListing(_prev: ListingFormState, formData: FormData): Promise<ListingFormState> {
  const { t } = await getT();
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/host/listings/new");
  const db = await getDb();
  const id = String(formData.get("id") ?? "");
  const intent = String(formData.get("intent") ?? "save");
  const errors: Record<string, string> = {};

  const countryCode = String(formData.get("countryCode") ?? "ES");
  const { locale } = await getT();
  const countryName = (() => {
    try {
      return new Intl.DisplayNames([locale], { type: "region" }).of(countryCode) ?? countryCode;
    } catch {
      return countryCode;
    }
  })();
  const parsed = base.safeParse({
    title: formData.get("title"),
    type: formData.get("type"),
    description: formData.get("description"),
    city: formData.get("city"),
    country: countryName,
    countryCode,
    neighborhood: formData.get("neighborhood") ?? "",
    address: formData.get("address") ?? "",
    timezone: formData.get("timezone"),
    currency: formData.get("currency"),
    cancellationPolicy: formData.get("cancellationPolicy"),
    rules: formData.get("rules") ?? "",
  });
  if (!parsed.success) {
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0]);
      errors[key] = key === "title" ? t.host.wizard.errors.title : key === "description" ? t.host.wizard.errors.description : key === "city" ? t.host.wizard.errors.city : t.common.genericError;
    }
  }
  const hourlyRate = Math.round(num(formData.get("hourlyRate")) * 100);
  if (!(hourlyRate > 0)) errors.hourlyRate = t.host.wizard.errors.rate;
  const minHours = Math.max(1, Math.round(num(formData.get("minHours"), 1)));
  const maxHours = Math.max(1, Math.round(num(formData.get("maxHours"), 10)));
  if (minHours > maxHours) errors.maxHours = t.host.wizard.errors.hours;
  const photos = formData
    .getAll("photos")
    .map((p) => String(p).trim())
    .filter((p) => p.startsWith("http") || p.startsWith("/covers/"));
  if (intent === "publish" && photos.length === 0) errors.photos = t.host.wizard.errors.photos;
  if (Object.keys(errors).length || !parsed.success) return { errors };

  const amenities = formData.getAll("amenities").map(String).filter((a): a is Amenity => (AMENITIES as readonly string[]).includes(a));
  const equipment: Equipment = {};
  for (const cat of EQUIPMENT_CATEGORIES) {
    const items = String(formData.get(`equipment_${cat}`) ?? "")
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    if (items.length) equipment[cat] = items;
  }
  const openingHours = {} as OpeningHours;
  for (const d of WEEKDAYS) {
    const closed = formData.get(`hours_${d}_closed`) === "1";
    const open = Math.min(23, Math.max(0, Math.round(num(formData.get(`hours_${d}_open`), 10))));
    const close = Math.min(24, Math.max(open + 1, Math.round(num(formData.get(`hours_${d}_close`), 22))));
    openingHours[d] = closed ? null : { open, close };
  }
  const addonNames = formData.getAll("addon_name").map(String);
  const addonPrices = formData.getAll("addon_price").map((p) => Math.round(num(p) * 100));
  const addonUnits = formData.getAll("addon_unit").map((u) => (u === "hour" ? "hour" : "session") as "hour" | "session");
  const addons = addonNames.map((name, i) => ({ name: name.trim(), priceCents: addonPrices[i] ?? 0, unit: addonUnits[i] ?? "session" })).filter((a) => a.name && a.priceCents > 0);

  const values = {
    ...parsed.data,
    neighborhood: parsed.data.neighborhood || null,
    address: parsed.data.address || null,
    rules: parsed.data.rules || null,
    lat: formData.get("lat") ? num(formData.get("lat")) : null,
    lng: formData.get("lng") ? num(formData.get("lng")) : null,
    sizeM2: formData.get("sizeM2") ? Math.round(num(formData.get("sizeM2"))) : null,
    capacity: Math.max(1, Math.round(num(formData.get("capacity"), 4))),
    rooms: Math.max(1, Math.round(num(formData.get("rooms"), 1))),
    hourlyRate,
    minHours,
    maxHours,
    instantBook: formData.get("instantBook") === "1",
    engineerAvailable: formData.get("engineerAvailable") === "1",
    engineerRate: formData.get("engineerAvailable") === "1" ? Math.round(num(formData.get("engineerRate")) * 100) || null : null,
    offPeakDiscount: Math.min(70, Math.max(0, Math.round(num(formData.get("offPeakDiscount"))))),
    offPeakEndHour: Math.min(23, Math.max(1, Math.round(num(formData.get("offPeakEndHour"), 14)))),
    openingHours,
    amenities,
    equipment,
    updatedAt: new Date(),
  };

  let listingId = id;
  if (id) {
    const existing = await db.query.listings.findFirst({ where: eq(schema.listings.id, id), columns: { id: true, hostId: true, status: true } });
    if (!existing || existing.hostId !== user.id) redirect("/host/listings");
    const status = intent === "publish" ? "published" : intent === "draft" ? "draft" : existing.status;
    await db.update(schema.listings).set({ ...values, status }).where(eq(schema.listings.id, id));
    await db.delete(schema.listingPhotos).where(eq(schema.listingPhotos.listingId, id));
    await db.delete(schema.listingAddons).where(eq(schema.listingAddons.listingId, id));
  } else {
    listingId = newId();
    await db.insert(schema.listings).values({
      id: listingId,
      hostId: user.id,
      slug: `${slugify(parsed.data.title)}-${shortId(4).toLowerCase()}`,
      status: intent === "publish" ? "published" : "draft",
      ...values,
    });
    if (!user.isHost) await db.update(schema.users).set({ isHost: true }).where(eq(schema.users.id, user.id));
  }
  if (photos.length) await db.insert(schema.listingPhotos).values(photos.map((url, position) => ({ id: newId(), listingId, url, position })));
  if (addons.length) await db.insert(schema.listingAddons).values(addons.map((a, position) => ({ id: newId(), listingId, ...a, position })));

  revalidatePath("/host/listings");
  revalidatePath("/studios");
  redirect(`/host/listings?saved=1`);
}

export async function setListingStatus(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const id = String(formData.get("id") ?? "");
  const status = formData.get("status") === "published" ? "published" : "paused";
  const db = await getDb();
  await db.update(schema.listings).set({ status, updatedAt: new Date() }).where(and(eq(schema.listings.id, id), eq(schema.listings.hostId, user.id)));
  revalidatePath("/host/listings");
  revalidatePath("/studios");
  redirect("/host/listings");
}

export async function deleteListing(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const id = String(formData.get("id") ?? "");
  const db = await getDb();
  await db.delete(schema.listings).where(and(eq(schema.listings.id, id), eq(schema.listings.hostId, user.id)));
  revalidatePath("/host/listings");
  revalidatePath("/studios");
  redirect("/host/listings");
}

export async function toggleBlockedDate(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const listingId = String(formData.get("listingId") ?? "");
  const date = String(formData.get("date") ?? "");
  const month = String(formData.get("month") ?? "");
  if (!isValidISODate(date)) redirect("/host/calendar");
  const db = await getDb();
  const listing = await db.query.listings.findFirst({ where: eq(schema.listings.id, listingId), columns: { hostId: true } });
  if (!listing || listing.hostId !== user.id) redirect("/host/calendar");
  const existing = await db.query.blockedDates.findFirst({ where: and(eq(schema.blockedDates.listingId, listingId), eq(schema.blockedDates.date, date)) });
  if (existing) await db.delete(schema.blockedDates).where(and(eq(schema.blockedDates.listingId, listingId), eq(schema.blockedDates.date, date)));
  else await db.insert(schema.blockedDates).values({ listingId, date });
  revalidatePath("/host/calendar");
  redirect(`/host/calendar?listing=${listingId}${month ? `&month=${month}` : ""}`);
}

/** Creates a Stripe Connect Express account for the host (only when Stripe is configured). */
export async function connectStripe() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const stripe = getStripe();
  if (!stripe) redirect("/host?stripe=unconfigured");
  const db = await getDb();
  let accountId = user.stripeAccountId;
  if (!accountId) {
    const account = await stripe.accounts.create({ type: "express", email: user.email, capabilities: { transfers: { requested: true } } });
    accountId = account.id;
    await db.update(schema.users).set({ stripeAccountId: accountId }).where(eq(schema.users.id, user.id));
  }
  const baseUrl = await getBaseUrl();
  const link = await stripe.accountLinks.create({ account: accountId, type: "account_onboarding", refresh_url: `${baseUrl}/host`, return_url: `${baseUrl}/host?stripe=connected` });
  redirect(link.url);
}
