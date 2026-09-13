export const LISTING_TYPES = [
  "recording",
  "mixing",
  "rehearsal",
  "podcast",
  "voiceover",
  "production",
  "live",
] as const;
export type ListingType = (typeof LISTING_TYPES)[number];

export const AMENITIES = [
  "wifi",
  "soundproof",
  "isolation_booth",
  "engineer_onsite",
  "instruments",
  "ac",
  "lounge",
  "kitchen",
  "coffee",
  "bathroom",
  "parking",
  "access_24h",
  "accessible",
  "natural_light",
  "streaming",
  "storage",
] as const;
export type Amenity = (typeof AMENITIES)[number];

export const EQUIPMENT_CATEGORIES = [
  "console",
  "monitors",
  "microphones",
  "preamps",
  "daw",
  "instruments",
  "other",
] as const;
export type EquipmentCategory = (typeof EQUIPMENT_CATEGORIES)[number];
export type Equipment = Partial<Record<EquipmentCategory, string[]>>;

export const CANCELLATION_POLICIES = ["flexible", "moderate", "strict"] as const;
export type CancellationPolicy = (typeof CANCELLATION_POLICIES)[number];

export const BOOKING_STATUSES = [
  "pending",
  "confirmed",
  "declined",
  "cancelled",
  "completed",
] as const;
export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export const PAYMENT_STATUSES = ["unpaid", "paid", "refunded", "demo"] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export const LISTING_STATUSES = ["draft", "published", "paused"] as const;
export type ListingStatus = (typeof LISTING_STATUSES)[number];

export const WEEKDAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;
export type Weekday = (typeof WEEKDAYS)[number];
export type OpeningHours = Record<Weekday, { open: number; close: number } | null>;

export const CURRENCIES = ["EUR", "USD", "GBP", "MXN", "COP", "ARS"] as const;
export type Currency = (typeof CURRENCIES)[number];

export const ADDON_UNITS = ["hour", "session"] as const;
export type AddonUnit = (typeof ADDON_UNITS)[number];

/** Platform economics (fractions). */
export const GUEST_FEE_RATE = 0; // artists pay exactly the studio price: no service fee
export const HOST_FEE_RATE = 0.12; // single 12 % commission paid by the studio per completed booking
export const DAMAGE_PROTECTION_EUR = 5000; // per-booking gear protection communicated in the trust section

export const DEFAULT_OPENING_HOURS: OpeningHours = {
  mon: { open: 10, close: 22 },
  tue: { open: 10, close: 22 },
  wed: { open: 10, close: 22 },
  thu: { open: 10, close: 22 },
  fri: { open: 10, close: 23 },
  sat: { open: 11, close: 23 },
  sun: null,
};

export const SESSION_COOKIE = "kb_session";
export const LOCALE_COOKIE = "kb_lang";
export const SESSION_DAYS = 30;

export const DEMO_ACCOUNTS = {
  guest: { email: "artista@kabina.demo", password: "kabina2026" },
  host: { email: "estudio@kabina.demo", password: "kabina2026" },
} as const;

export const SITE = {
  name: "Kabina",
  domain: "kabina.studio",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://kabina.studio",
  supportEmail: "hola@kabina.studio",
} as const;
