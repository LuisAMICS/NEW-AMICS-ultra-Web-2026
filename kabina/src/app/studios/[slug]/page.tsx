import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, Users, Ruler, DoorOpen, Zap, ChevronRight, MessageSquare } from "lucide-react";
import { getT } from "@/lib/i18n";
import { getCurrentUser } from "@/lib/auth";
import { getBookedRanges, getHostCounts, getListingBySlug, getSimilarListings } from "@/lib/queries/listings";
import { getFavoriteIds } from "@/lib/queries/favorites";
import { Gallery } from "@/components/listing/gallery";
import { ShareButton } from "@/components/listing/share-button";
import { FavoriteButton } from "@/components/listing/favorite-button";
import { ReviewsSection } from "@/components/listing/reviews";
import { ListingCard } from "@/components/listing/listing-card";
import { AMENITY_ICONS, EQUIPMENT_ICONS } from "@/components/listing/icons";
import { BookingWidget } from "@/components/booking/booking-widget";
import { StudioMapLazy } from "@/components/map/studio-map-lazy";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Rating } from "@/components/ui/rating";
import { Button } from "@/components/ui/button";
import { startConversation } from "@/app/actions/messages";
import { EQUIPMENT_CATEGORIES, WEEKDAYS } from "@/lib/constants";
import { addDaysISO, formatHour, todayISO, tpl, truncate } from "@/lib/utils";
import type { BookedRange } from "@/lib/availability";

export async function generateMetadata(props: PageProps<"/studios/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const listing = await getListingBySlug(slug);
  if (!listing) return {};
  return {
    title: `${listing.title} · ${listing.city}`,
    description: truncate(listing.description, 160),
    openGraph: { images: listing.photos[0] ? [listing.photos[0].url] : undefined },
  };
}

export default async function ListingPage(props: PageProps<"/studios/[slug]">) {
  const [{ slug }, sp] = await Promise.all([props.params, props.searchParams]);
  const [{ t, locale }, user, listing] = await Promise.all([getT(), getCurrentUser(), getListingBySlug(slug)]);
  if (!listing) notFound();
  const isOwner = user?.id === listing.hostId;
  if (listing.status !== "published" && !isOwner) notFound();

  const today = todayISO();
  const dates = Array.from({ length: 60 }, (_, i) => addDaysISO(today, i));
  const [ranges, favorites, similar, hostCount] = await Promise.all([
    getBookedRanges(listing.id, dates),
    getFavoriteIds(user?.id, [listing.id]),
    getSimilarListings(listing, 4),
    getHostCounts(listing.hostId),
  ]);
  const booked: Record<string, BookedRange[]> = {};
  for (const r of ranges) (booked[r.date] ??= []).push({ startHour: r.startHour, endHour: r.endHour });

  const from = Number(sp.from);
  const to = Number(sp.to);
  const initial = { date: typeof sp.date === "string" ? sp.date : undefined, from: Number.isFinite(from) && sp.from ? from : undefined, to: Number.isFinite(to) && sp.to ? to : undefined };
  const pathname = `/studios/${listing.slug}`;
  const equipmentEntries = EQUIPMENT_CATEGORIES.filter((c) => listing.equipment[c]?.length);

  return (
    <div className="container-x py-6 md:py-8">
      <nav className="mb-4 flex items-center gap-1 text-sm text-ink-500" aria-label="Breadcrumb">
        <Link href="/studios" className="hover:text-ink-950">
          {t.listing.breadcrumbAll}
        </Link>
        <ChevronRight className="h-3.5 w-3.5" aria-hidden />
        <Link href={`/studios?q=${encodeURIComponent(listing.city)}`} className="hover:text-ink-950">
          {listing.city}
        </Link>
      </nav>

      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          {listing.status !== "published" ? <Badge tone="rec" className="mb-2">{t.host.wizard[listing.status]}</Badge> : null}
          <h1 className="text-balance text-3xl font-bold md:text-4xl">{listing.title}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink-600">
            <Rating value={listing.ratingAvg} count={listing.ratingCount} size="md" />
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-4 w-4" aria-hidden /> {listing.neighborhood ? `${listing.neighborhood}, ` : ""}
              {listing.city}, {listing.country}
            </span>
            <span>{t.types[listing.type].label}</span>
            {listing.instantBook ? (
              <Badge tone="dark">
                <Zap className="h-3 w-3 fill-brand-400 text-brand-400" aria-hidden /> {t.common.instantBook}
              </Badge>
            ) : null}
          </div>
        </div>
        <div className="flex gap-2">
          <ShareButton title={listing.title} />
          <FavoriteButton listingId={listing.id} initial={favorites.has(listing.id)} variant="inline" />
        </div>
      </div>

      <div className="mt-6">
        <Gallery photos={listing.photos} title={listing.title} />
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_400px] lg:gap-14">
        <div className="min-w-0 space-y-10">
          {/* Key facts */}
          <section className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-700">
            <span className="inline-flex items-center gap-1.5">
              <Users className="h-4 w-4 text-ink-500" aria-hidden /> {tpl(t.common.capacity, { n: listing.capacity })}
            </span>
            {listing.sizeM2 ? (
              <span className="inline-flex items-center gap-1.5">
                <Ruler className="h-4 w-4 text-ink-500" aria-hidden /> {tpl(t.common.sqm, { n: listing.sizeM2 })}
              </span>
            ) : null}
            <span className="inline-flex items-center gap-1.5">
              <DoorOpen className="h-4 w-4 text-ink-500" aria-hidden /> {listing.rooms === 1 ? t.common.room : tpl(t.common.rooms, { n: listing.rooms })}
            </span>
          </section>

          <section>
            <h2 className="text-xl font-bold">{t.listing.about}</h2>
            <div className="prose-p:leading-relaxed mt-3 space-y-4 text-[15px] leading-relaxed text-ink-800">
              {listing.description.split(/\n\n+/).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </section>

          {equipmentEntries.length ? (
            <section>
              <h2 className="text-xl font-bold">{t.listing.equipmentTitle}</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {equipmentEntries.map((cat) => {
                  const Icon = EQUIPMENT_ICONS[cat];
                  return (
                    <div key={cat} className="rounded-2xl border border-ink-100 bg-white p-4">
                      <h3 className="flex items-center gap-2 text-sm font-bold">
                        <Icon className="h-4 w-4 text-brand-600" aria-hidden /> {t.equipment[cat]}
                      </h3>
                      <ul className="mt-2 space-y-1 text-sm text-ink-700">
                        {listing.equipment[cat]!.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </section>
          ) : null}

          {listing.amenities.length ? (
            <section>
              <h2 className="text-xl font-bold">{t.listing.amenitiesTitle}</h2>
              <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {listing.amenities.map((a) => {
                  const Icon = AMENITY_ICONS[a];
                  return (
                    <li key={a} className="flex items-center gap-2.5 text-sm text-ink-800">
                      <Icon className="h-4.5 w-4.5 text-ink-500" aria-hidden /> {t.amenities[a]}
                    </li>
                  );
                })}
              </ul>
            </section>
          ) : null}

          <section className="grid gap-8 sm:grid-cols-2">
            <div>
              <h2 className="text-xl font-bold">{t.listing.openingHours}</h2>
              <dl className="mt-3 space-y-1.5 text-sm">
                {WEEKDAYS.map((d) => {
                  const h = listing.openingHours[d];
                  return (
                    <div key={d} className="flex justify-between border-b border-ink-100 py-1">
                      <dt className="text-ink-600">{t.weekdays.long[d]}</dt>
                      <dd className="font-medium">{h ? `${formatHour(h.open)} – ${formatHour(h.close)}` : t.listing.closed}</dd>
                    </div>
                  );
                })}
              </dl>
            </div>
            <div className="space-y-6">
              {listing.rules ? (
                <div>
                  <h2 className="text-xl font-bold">{t.listing.rulesTitle}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-ink-700">{listing.rules}</p>
                </div>
              ) : null}
              <div>
                <h2 className="text-xl font-bold">{t.listing.policyTitle}</h2>
                <p className="mt-3 text-sm leading-relaxed text-ink-700">
                  <span className="font-semibold">{t.policies[listing.cancellationPolicy].label}.</span> {t.policies[listing.cancellationPolicy].description}
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold">{t.listing.locationTitle}</h2>
            <p className="mt-1 text-sm text-ink-600">
              {listing.neighborhood ? `${listing.neighborhood}, ` : ""}
              {listing.city}, {listing.country}. {t.listing.locationNote}
            </p>
            {listing.lat !== null && listing.lng !== null ? (
              <div className="mt-4 h-72 overflow-hidden rounded-2xl border border-ink-100">
                <StudioMapLazy points={[{ id: listing.id, slug: listing.slug, title: listing.title, lat: listing.lat, lng: listing.lng, hourlyRate: listing.hourlyRate, currency: listing.currency }]} locale={locale} interactive={false} />
              </div>
            ) : null}
          </section>

          <section className="rounded-3xl border border-ink-100 bg-white p-6">
            <h2 className="text-xl font-bold">{t.listing.hostTitle}</h2>
            <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start">
              <Avatar name={listing.host.name} src={listing.host.avatarUrl} size="xl" />
              <div className="flex-1">
                <p className="text-lg font-bold">{listing.host.name}</p>
                <p className="text-sm text-ink-500">
                  {tpl(t.listing.hostSince, { year: listing.host.createdAt.getFullYear() })} · {tpl(t.listing.hostListings, { n: hostCount })}
                </p>
                {listing.host.bio ? <p className="mt-3 text-sm leading-relaxed text-ink-700">{listing.host.bio}</p> : null}
                {!isOwner ? (
                  <form action={startConversation} className="mt-4">
                    <input type="hidden" name="listingId" value={listing.id} />
                    <input type="hidden" name="back" value={pathname} />
                    <Button type="submit" variant="outline" size="sm">
                      <MessageSquare className="h-4 w-4" aria-hidden /> {t.listing.contactHost}
                    </Button>
                  </form>
                ) : null}
              </div>
            </div>
          </section>

          <ReviewsSection reviews={listing.reviews} ratingAvg={listing.ratingAvg} t={t} locale={locale} />
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <BookingWidget
            listing={{
              id: listing.id,
              slug: listing.slug,
              hourlyRate: listing.hourlyRate,
              currency: listing.currency,
              minHours: listing.minHours,
              maxHours: listing.maxHours,
              instantBook: listing.instantBook,
              openingHours: listing.openingHours,
              offPeakDiscount: listing.offPeakDiscount,
              offPeakEndHour: listing.offPeakEndHour,
              engineerAvailable: listing.engineerAvailable,
              engineerRate: listing.engineerRate,
              cancellationPolicy: listing.cancellationPolicy,
              addons: listing.addons.map((a) => ({ id: a.id, name: a.name, description: a.description, priceCents: a.priceCents, unit: a.unit })),
            }}
            booked={booked}
            blocked={listing.blockedDates.map((b) => b.date)}
            loggedIn={!!user}
            isOwner={isOwner}
            initial={initial}
            pathname={pathname}
          />
        </aside>
      </div>

      {similar.length ? (
        <section className="mt-16">
          <h2 className="text-2xl font-bold">{tpl(t.listing.similar, { city: listing.city })}</h2>
          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {similar.map((l) => (
              <ListingCard key={l.id} listing={l} t={t} locale={locale} compact />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
