CREATE TABLE "blocked_dates" (
	"listing_id" text NOT NULL,
	"date" text NOT NULL,
	"reason" text,
	CONSTRAINT "blocked_dates_listing_id_date_pk" PRIMARY KEY("listing_id","date")
);
--> statement-breakpoint
CREATE TABLE "bookings" (
	"id" text PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"listing_id" text NOT NULL,
	"guest_id" text NOT NULL,
	"host_id" text NOT NULL,
	"date" text NOT NULL,
	"start_hour" integer NOT NULL,
	"end_hour" integer NOT NULL,
	"hours" integer NOT NULL,
	"currency" text NOT NULL,
	"hourly_rate" integer NOT NULL,
	"subtotal_cents" integer NOT NULL,
	"discount_cents" integer DEFAULT 0 NOT NULL,
	"addons_cents" integer DEFAULT 0 NOT NULL,
	"guest_fee_cents" integer NOT NULL,
	"host_fee_cents" integer NOT NULL,
	"total_cents" integer NOT NULL,
	"host_payout_cents" integer NOT NULL,
	"addons" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"notes" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"payment_status" text DEFAULT 'unpaid' NOT NULL,
	"cancellation_policy" text NOT NULL,
	"stripe_session_id" text,
	"stripe_payment_intent_id" text,
	"refund_cents" integer,
	"cancelled_by" text,
	"cancelled_at" timestamp with time zone,
	"confirmed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "conversations" (
	"id" text PRIMARY KEY NOT NULL,
	"listing_id" text NOT NULL,
	"guest_id" text NOT NULL,
	"host_id" text NOT NULL,
	"booking_id" text,
	"last_message_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "favorites" (
	"user_id" text NOT NULL,
	"listing_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "favorites_user_id_listing_id_pk" PRIMARY KEY("user_id","listing_id")
);
--> statement-breakpoint
CREATE TABLE "listing_addons" (
	"id" text PRIMARY KEY NOT NULL,
	"listing_id" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"price_cents" integer NOT NULL,
	"unit" text DEFAULT 'session' NOT NULL,
	"position" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "listing_photos" (
	"id" text PRIMARY KEY NOT NULL,
	"listing_id" text NOT NULL,
	"url" text NOT NULL,
	"alt" text,
	"position" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "listings" (
	"id" text PRIMARY KEY NOT NULL,
	"host_id" text NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"type" text NOT NULL,
	"description" text NOT NULL,
	"city" text NOT NULL,
	"country" text NOT NULL,
	"country_code" text NOT NULL,
	"neighborhood" text,
	"address" text,
	"lat" double precision,
	"lng" double precision,
	"timezone" text DEFAULT 'Europe/Madrid' NOT NULL,
	"size_m2" integer,
	"capacity" integer DEFAULT 4 NOT NULL,
	"rooms" integer DEFAULT 1 NOT NULL,
	"hourly_rate" integer NOT NULL,
	"currency" text DEFAULT 'EUR' NOT NULL,
	"min_hours" integer DEFAULT 2 NOT NULL,
	"max_hours" integer DEFAULT 10 NOT NULL,
	"instant_book" boolean DEFAULT false NOT NULL,
	"engineer_available" boolean DEFAULT false NOT NULL,
	"engineer_rate" integer,
	"off_peak_discount" integer DEFAULT 0 NOT NULL,
	"off_peak_end_hour" integer DEFAULT 14 NOT NULL,
	"opening_hours" jsonb NOT NULL,
	"amenities" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"equipment" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"rules" text,
	"cancellation_policy" text DEFAULT 'moderate' NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"rating_avg" real DEFAULT 0 NOT NULL,
	"rating_count" integer DEFAULT 0 NOT NULL,
	"booking_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" text PRIMARY KEY NOT NULL,
	"conversation_id" text NOT NULL,
	"sender_id" text NOT NULL,
	"body" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reviews" (
	"id" text PRIMARY KEY NOT NULL,
	"booking_id" text NOT NULL,
	"listing_id" text NOT NULL,
	"author_id" text NOT NULL,
	"rating" integer NOT NULL,
	"rating_sound" integer NOT NULL,
	"rating_equipment" integer NOT NULL,
	"rating_host" integer NOT NULL,
	"rating_value" integer NOT NULL,
	"comment" text NOT NULL,
	"host_reply" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"name" text NOT NULL,
	"avatar_url" text,
	"bio" text,
	"locale" text DEFAULT 'es' NOT NULL,
	"is_host" boolean DEFAULT false NOT NULL,
	"stripe_account_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "blocked_dates" ADD CONSTRAINT "blocked_dates_listing_id_listings_id_fk" FOREIGN KEY ("listing_id") REFERENCES "public"."listings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_listing_id_listings_id_fk" FOREIGN KEY ("listing_id") REFERENCES "public"."listings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_guest_id_users_id_fk" FOREIGN KEY ("guest_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_host_id_users_id_fk" FOREIGN KEY ("host_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_listing_id_listings_id_fk" FOREIGN KEY ("listing_id") REFERENCES "public"."listings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_guest_id_users_id_fk" FOREIGN KEY ("guest_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_host_id_users_id_fk" FOREIGN KEY ("host_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_booking_id_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_listing_id_listings_id_fk" FOREIGN KEY ("listing_id") REFERENCES "public"."listings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "listing_addons" ADD CONSTRAINT "listing_addons_listing_id_listings_id_fk" FOREIGN KEY ("listing_id") REFERENCES "public"."listings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "listing_photos" ADD CONSTRAINT "listing_photos_listing_id_listings_id_fk" FOREIGN KEY ("listing_id") REFERENCES "public"."listings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "listings" ADD CONSTRAINT "listings_host_id_users_id_fk" FOREIGN KEY ("host_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_conversation_id_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_id_users_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_booking_id_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_listing_id_listings_id_fk" FOREIGN KEY ("listing_id") REFERENCES "public"."listings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "bookings_code_idx" ON "bookings" USING btree ("code");--> statement-breakpoint
CREATE INDEX "bookings_listing_date_idx" ON "bookings" USING btree ("listing_id","date");--> statement-breakpoint
CREATE INDEX "bookings_guest_idx" ON "bookings" USING btree ("guest_id");--> statement-breakpoint
CREATE INDEX "bookings_host_idx" ON "bookings" USING btree ("host_id");--> statement-breakpoint
CREATE UNIQUE INDEX "conversations_pair_idx" ON "conversations" USING btree ("listing_id","guest_id");--> statement-breakpoint
CREATE INDEX "conversations_guest_idx" ON "conversations" USING btree ("guest_id");--> statement-breakpoint
CREATE INDEX "conversations_host_idx" ON "conversations" USING btree ("host_id");--> statement-breakpoint
CREATE INDEX "listing_addons_listing_idx" ON "listing_addons" USING btree ("listing_id");--> statement-breakpoint
CREATE INDEX "listing_photos_listing_idx" ON "listing_photos" USING btree ("listing_id");--> statement-breakpoint
CREATE UNIQUE INDEX "listings_slug_idx" ON "listings" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "listings_host_idx" ON "listings" USING btree ("host_id");--> statement-breakpoint
CREATE INDEX "listings_city_idx" ON "listings" USING btree ("city");--> statement-breakpoint
CREATE INDEX "listings_status_idx" ON "listings" USING btree ("status");--> statement-breakpoint
CREATE INDEX "messages_conversation_idx" ON "messages" USING btree ("conversation_id");--> statement-breakpoint
CREATE UNIQUE INDEX "reviews_booking_idx" ON "reviews" USING btree ("booking_id");--> statement-breakpoint
CREATE INDEX "reviews_listing_idx" ON "reviews" USING btree ("listing_id");--> statement-breakpoint
CREATE INDEX "sessions_user_idx" ON "sessions" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");