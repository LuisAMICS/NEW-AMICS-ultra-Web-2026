import { relations, sql } from "drizzle-orm";
import {
  boolean,
  doublePrecision,
  index,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  real,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import type {
  Amenity,
  BookingStatus,
  CancellationPolicy,
  Equipment,
  ListingStatus,
  ListingType,
  OpeningHours,
  PaymentStatus,
} from "@/lib/constants";

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
};

export const users = pgTable(
  "users",
  {
    id: text("id").primaryKey(),
    email: text("email").notNull(),
    passwordHash: text("password_hash").notNull(),
    name: text("name").notNull(),
    avatarUrl: text("avatar_url"),
    bio: text("bio"),
    locale: text("locale").notNull().default("es"),
    isHost: boolean("is_host").notNull().default(false),
    stripeAccountId: text("stripe_account_id"),
    ...timestamps,
  },
  (t) => [uniqueIndex("users_email_idx").on(t.email)],
);

export const sessions = pgTable(
  "sessions",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("sessions_user_idx").on(t.userId)],
);

export const listings = pgTable(
  "listings",
  {
    id: text("id").primaryKey(),
    hostId: text("host_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    type: text("type").$type<ListingType>().notNull(),
    description: text("description").notNull(),
    city: text("city").notNull(),
    country: text("country").notNull(),
    countryCode: text("country_code").notNull(),
    neighborhood: text("neighborhood"),
    address: text("address"),
    lat: doublePrecision("lat"),
    lng: doublePrecision("lng"),
    timezone: text("timezone").notNull().default("Europe/Madrid"),
    sizeM2: integer("size_m2"),
    capacity: integer("capacity").notNull().default(4),
    rooms: integer("rooms").notNull().default(1),
    hourlyRate: integer("hourly_rate").notNull(), // cents
    currency: text("currency").notNull().default("EUR"),
    minHours: integer("min_hours").notNull().default(2),
    maxHours: integer("max_hours").notNull().default(10),
    instantBook: boolean("instant_book").notNull().default(false),
    engineerAvailable: boolean("engineer_available").notNull().default(false),
    engineerRate: integer("engineer_rate"), // cents per hour
    offPeakDiscount: integer("off_peak_discount").notNull().default(0), // percent off weekday sessions ending before offPeakEndHour
    offPeakEndHour: integer("off_peak_end_hour").notNull().default(14),
    openingHours: jsonb("opening_hours").$type<OpeningHours>().notNull(),
    amenities: jsonb("amenities").$type<Amenity[]>().notNull().default(sql`'[]'::jsonb`),
    equipment: jsonb("equipment").$type<Equipment>().notNull().default(sql`'{}'::jsonb`),
    rules: text("rules"),
    cancellationPolicy: text("cancellation_policy").$type<CancellationPolicy>().notNull().default("moderate"),
    status: text("status").$type<ListingStatus>().notNull().default("draft"),
    featured: boolean("featured").notNull().default(false),
    ratingAvg: real("rating_avg").notNull().default(0),
    ratingCount: integer("rating_count").notNull().default(0),
    bookingCount: integer("booking_count").notNull().default(0),
    ...timestamps,
  },
  (t) => [
    uniqueIndex("listings_slug_idx").on(t.slug),
    index("listings_host_idx").on(t.hostId),
    index("listings_city_idx").on(t.city),
    index("listings_status_idx").on(t.status),
  ],
);

export const listingPhotos = pgTable(
  "listing_photos",
  {
    id: text("id").primaryKey(),
    listingId: text("listing_id")
      .notNull()
      .references(() => listings.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    alt: text("alt"),
    position: integer("position").notNull().default(0),
  },
  (t) => [index("listing_photos_listing_idx").on(t.listingId)],
);

export const listingAddons = pgTable(
  "listing_addons",
  {
    id: text("id").primaryKey(),
    listingId: text("listing_id")
      .notNull()
      .references(() => listings.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    description: text("description"),
    priceCents: integer("price_cents").notNull(),
    unit: text("unit").$type<"hour" | "session">().notNull().default("session"),
    position: integer("position").notNull().default(0),
  },
  (t) => [index("listing_addons_listing_idx").on(t.listingId)],
);

export const blockedDates = pgTable(
  "blocked_dates",
  {
    listingId: text("listing_id")
      .notNull()
      .references(() => listings.id, { onDelete: "cascade" }),
    date: text("date").notNull(), // YYYY-MM-DD in the studio's local time
    reason: text("reason"),
  },
  (t) => [primaryKey({ columns: [t.listingId, t.date] })],
);

export type BookingAddonSnapshot = { name: string; priceCents: number; unit: "hour" | "session"; totalCents: number };

export const bookings = pgTable(
  "bookings",
  {
    id: text("id").primaryKey(),
    code: text("code").notNull(),
    listingId: text("listing_id")
      .notNull()
      .references(() => listings.id, { onDelete: "cascade" }),
    guestId: text("guest_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    hostId: text("host_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    date: text("date").notNull(), // YYYY-MM-DD local to the studio
    startHour: integer("start_hour").notNull(),
    endHour: integer("end_hour").notNull(),
    hours: integer("hours").notNull(),
    currency: text("currency").notNull(),
    hourlyRate: integer("hourly_rate").notNull(),
    subtotalCents: integer("subtotal_cents").notNull(),
    discountCents: integer("discount_cents").notNull().default(0),
    addonsCents: integer("addons_cents").notNull().default(0),
    guestFeeCents: integer("guest_fee_cents").notNull(),
    hostFeeCents: integer("host_fee_cents").notNull(),
    totalCents: integer("total_cents").notNull(),
    hostPayoutCents: integer("host_payout_cents").notNull(),
    addons: jsonb("addons").$type<BookingAddonSnapshot[]>().notNull().default(sql`'[]'::jsonb`),
    notes: text("notes"),
    status: text("status").$type<BookingStatus>().notNull().default("pending"),
    paymentStatus: text("payment_status").$type<PaymentStatus>().notNull().default("unpaid"),
    cancellationPolicy: text("cancellation_policy").$type<CancellationPolicy>().notNull(),
    stripeSessionId: text("stripe_session_id"),
    stripePaymentIntentId: text("stripe_payment_intent_id"),
    refundCents: integer("refund_cents"),
    cancelledBy: text("cancelled_by").$type<"guest" | "host">(),
    cancelledAt: timestamp("cancelled_at", { withTimezone: true }),
    confirmedAt: timestamp("confirmed_at", { withTimezone: true }),
    ...timestamps,
  },
  (t) => [
    uniqueIndex("bookings_code_idx").on(t.code),
    index("bookings_listing_date_idx").on(t.listingId, t.date),
    index("bookings_guest_idx").on(t.guestId),
    index("bookings_host_idx").on(t.hostId),
  ],
);

export const reviews = pgTable(
  "reviews",
  {
    id: text("id").primaryKey(),
    bookingId: text("booking_id")
      .notNull()
      .references(() => bookings.id, { onDelete: "cascade" }),
    listingId: text("listing_id")
      .notNull()
      .references(() => listings.id, { onDelete: "cascade" }),
    authorId: text("author_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    rating: integer("rating").notNull(),
    ratingSound: integer("rating_sound").notNull(),
    ratingEquipment: integer("rating_equipment").notNull(),
    ratingHost: integer("rating_host").notNull(),
    ratingValue: integer("rating_value").notNull(),
    comment: text("comment").notNull(),
    hostReply: text("host_reply"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("reviews_booking_idx").on(t.bookingId), index("reviews_listing_idx").on(t.listingId)],
);

export const favorites = pgTable(
  "favorites",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    listingId: text("listing_id")
      .notNull()
      .references(() => listings.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.listingId] })],
);

export const conversations = pgTable(
  "conversations",
  {
    id: text("id").primaryKey(),
    listingId: text("listing_id")
      .notNull()
      .references(() => listings.id, { onDelete: "cascade" }),
    guestId: text("guest_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    hostId: text("host_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    bookingId: text("booking_id").references(() => bookings.id, { onDelete: "set null" }),
    lastMessageAt: timestamp("last_message_at", { withTimezone: true }).notNull().defaultNow(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex("conversations_pair_idx").on(t.listingId, t.guestId),
    index("conversations_guest_idx").on(t.guestId),
    index("conversations_host_idx").on(t.hostId),
  ],
);

export const messages = pgTable(
  "messages",
  {
    id: text("id").primaryKey(),
    conversationId: text("conversation_id")
      .notNull()
      .references(() => conversations.id, { onDelete: "cascade" }),
    senderId: text("sender_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    body: text("body").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("messages_conversation_idx").on(t.conversationId)],
);

/* ---------- relations ---------- */

export const usersRelations = relations(users, ({ many }) => ({
  listings: many(listings),
  bookingsAsGuest: many(bookings, { relationName: "guest" }),
  bookingsAsHost: many(bookings, { relationName: "host" }),
  reviews: many(reviews),
  favorites: many(favorites),
}));

export const listingsRelations = relations(listings, ({ one, many }) => ({
  host: one(users, { fields: [listings.hostId], references: [users.id] }),
  photos: many(listingPhotos),
  addons: many(listingAddons),
  blockedDates: many(blockedDates),
  bookings: many(bookings),
  reviews: many(reviews),
  favorites: many(favorites),
}));

export const listingPhotosRelations = relations(listingPhotos, ({ one }) => ({
  listing: one(listings, { fields: [listingPhotos.listingId], references: [listings.id] }),
}));

export const listingAddonsRelations = relations(listingAddons, ({ one }) => ({
  listing: one(listings, { fields: [listingAddons.listingId], references: [listings.id] }),
}));

export const blockedDatesRelations = relations(blockedDates, ({ one }) => ({
  listing: one(listings, { fields: [blockedDates.listingId], references: [listings.id] }),
}));

export const bookingsRelations = relations(bookings, ({ one, many }) => ({
  listing: one(listings, { fields: [bookings.listingId], references: [listings.id] }),
  guest: one(users, { fields: [bookings.guestId], references: [users.id], relationName: "guest" }),
  host: one(users, { fields: [bookings.hostId], references: [users.id], relationName: "host" }),
  review: one(reviews, { fields: [bookings.id], references: [reviews.bookingId] }),
  conversations: many(conversations),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  booking: one(bookings, { fields: [reviews.bookingId], references: [bookings.id] }),
  listing: one(listings, { fields: [reviews.listingId], references: [listings.id] }),
  author: one(users, { fields: [reviews.authorId], references: [users.id] }),
}));

export const favoritesRelations = relations(favorites, ({ one }) => ({
  user: one(users, { fields: [favorites.userId], references: [users.id] }),
  listing: one(listings, { fields: [favorites.listingId], references: [listings.id] }),
}));

export const conversationsRelations = relations(conversations, ({ one, many }) => ({
  listing: one(listings, { fields: [conversations.listingId], references: [listings.id] }),
  guest: one(users, { fields: [conversations.guestId], references: [users.id], relationName: "convGuest" }),
  host: one(users, { fields: [conversations.hostId], references: [users.id], relationName: "convHost" }),
  booking: one(bookings, { fields: [conversations.bookingId], references: [bookings.id] }),
  messages: many(messages),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  conversation: one(conversations, { fields: [messages.conversationId], references: [conversations.id] }),
  sender: one(users, { fields: [messages.senderId], references: [users.id] }),
}));

/* ---------- inferred types ---------- */

export type User = typeof users.$inferSelect;
export type Listing = typeof listings.$inferSelect;
export type NewListing = typeof listings.$inferInsert;
export type ListingPhoto = typeof listingPhotos.$inferSelect;
export type ListingAddon = typeof listingAddons.$inferSelect;
export type BlockedDate = typeof blockedDates.$inferSelect;
export type Booking = typeof bookings.$inferSelect;
export type NewBooking = typeof bookings.$inferInsert;
export type Review = typeof reviews.$inferSelect;
export type Conversation = typeof conversations.$inferSelect;
export type Message = typeof messages.$inferSelect;
