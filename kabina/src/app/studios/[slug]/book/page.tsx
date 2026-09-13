import { notFound, redirect } from "next/navigation";
import { CalendarDays, Clock } from "lucide-react";
import { getT } from "@/lib/i18n";
import { requireUser } from "@/lib/auth";
import { getBookedRanges, getListingBySlug } from "@/lib/queries/listings";
import { isRangeAvailable } from "@/lib/availability";
import { offPeakPct, quote, type AddonInput } from "@/lib/pricing";
import { stripeConfigured } from "@/lib/stripe";
import { CheckoutForm } from "@/components/booking/checkout-form";
import { formatDate, formatHourRange, formatMoney, isValidISODate, todayISO, tpl } from "@/lib/utils";

export default async function BookPage(props: PageProps<"/studios/[slug]/book">) {
  const [{ slug }, sp] = await Promise.all([props.params, props.searchParams]);
  const qs = new URLSearchParams(Object.entries(sp).flatMap(([k, v]) => (typeof v === "string" ? [[k, v]] : [])) as [string, string][]);
  const user = await requireUser(`/studios/${slug}/book?${qs.toString()}`);
  const [{ t, locale }, listing] = await Promise.all([getT(), getListingBySlug(slug)]);
  if (!listing || listing.status !== "published") notFound();

  const date = typeof sp.date === "string" ? sp.date : "";
  const from = Number(sp.from);
  const to = Number(sp.to);
  const addonIds = typeof sp.addons === "string" ? sp.addons.split(",").filter(Boolean) : [];
  const engineer = sp.engineer === "1";
  const valid = isValidISODate(date) && date >= todayISO() && Number.isInteger(from) && Number.isInteger(to) && to > from;
  if (!valid) redirect(`/studios/${slug}`);

  const ranges = await getBookedRanges(listing.id, [date]);
  const available = isRangeAvailable(listing.openingHours, date, from, to, ranges, listing.blockedDates.some((b) => b.date === date));
  const hours = to - from;
  if (!available || hours < listing.minHours || hours > listing.maxHours || listing.hostId === user.id) redirect(`/studios/${slug}?date=${date}`);

  const addons: AddonInput[] = listing.addons.filter((a) => addonIds.includes(a.id)).map((a) => ({ name: a.name, priceCents: a.priceCents, unit: a.unit }));
  if (engineer && listing.engineerAvailable && listing.engineerRate) addons.push({ name: t.listing.engineerAddon, priceCents: listing.engineerRate, unit: "hour" });
  const q = quote(listing.hourlyRate, hours, addons, offPeakPct(listing, date, to));

  return (
    <div className="container-x py-8 md:py-12">
      <h1 className="text-3xl font-bold md:text-4xl">{t.booking.title}</h1>
      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_420px]">
        <div className="order-2 lg:order-1">
          <CheckoutForm listingId={listing.id} date={date} from={from} to={to} addons={addonIds} engineer={engineer} totalCents={q.totalCents} currency={listing.currency} instantBook={listing.instantBook} stripe={stripeConfigured} />
        </div>
        <aside className="order-1 lg:order-2">
          <div className="rounded-3xl border border-ink-100 bg-white p-5 shadow-card">
            <div className="flex gap-4">
              {listing.photos[0] ? <img src={listing.photos[0].url} alt="" className="h-20 w-28 shrink-0 rounded-xl object-cover" /> : null}
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">{t.types[listing.type].label}</p>
                <p className="font-bold leading-snug">{listing.title}</p>
                <p className="text-sm text-ink-500">
                  {listing.neighborhood ? `${listing.neighborhood}, ` : ""}
                  {listing.city}
                </p>
              </div>
            </div>
            <dl className="mt-5 space-y-2 border-t border-ink-100 pt-4 text-sm">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-ink-500" aria-hidden />
                <dd className="font-medium capitalize">{formatDate(date, locale, "weekday")}</dd>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-ink-500" aria-hidden />
                <dd className="font-medium">
                  {formatHourRange(from, to)} · {hours} {t.common.hours}
                </dd>
              </div>
            </dl>
            <h2 className="mt-5 text-sm font-bold">{t.booking.priceDetails}</h2>
            <dl className="mt-2 space-y-1.5 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink-600">{tpl(t.listing.priceBase, { rate: formatMoney(listing.hourlyRate, listing.currency, locale, { compact: true }), hours })}</dt>
                <dd>{formatMoney(q.subtotalCents, listing.currency, locale)}</dd>
              </div>
              {q.discountCents ? (
                <div className="flex justify-between text-ok">
                  <dt>{t.listing.offPeak} (-{q.discountPct} %)</dt>
                  <dd>-{formatMoney(q.discountCents, listing.currency, locale)}</dd>
                </div>
              ) : null}
              {q.addons.map((a) => (
                <div key={a.name} className="flex justify-between">
                  <dt className="text-ink-600">{a.name}</dt>
                  <dd>{formatMoney(a.totalCents, listing.currency, locale)}</dd>
                </div>
              ))}
              <div className="flex justify-between text-ink-500">
                <dt>{t.listing.serviceFee}</dt>
                <dd>{q.guestFeeCents ? formatMoney(q.guestFeeCents, listing.currency, locale) : t.listing.noServiceFee}</dd>
              </div>
              <div className="flex justify-between border-t border-ink-100 pt-2 text-base font-bold">
                <dt>{t.listing.total}</dt>
                <dd>{formatMoney(q.totalCents, listing.currency, locale)}</dd>
              </div>
            </dl>
            <div className="mt-5 rounded-2xl bg-ink-50 p-3 text-xs text-ink-600">
              <p className="font-semibold text-ink-800">{t.listing.policyTitle}: {t.policies[listing.cancellationPolicy].label}</p>
              <p className="mt-1">{t.policies[listing.cancellationPolicy].description}</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
