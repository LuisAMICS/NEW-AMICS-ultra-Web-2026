import Link from "next/link";
import { ArrowRight, Plus, CreditCard, Lightbulb } from "lucide-react";
import { getT } from "@/lib/i18n";
import { requireHost } from "@/lib/auth";
import { getHostBookings, getHostStats, sweepCompletedBookings } from "@/lib/queries/bookings";
import { getHostListings } from "@/lib/queries/host";
import { BookingRow } from "@/components/booking/booking-row";
import { Button, ButtonLink } from "@/components/ui/button";
import { respondBooking } from "@/app/actions/bookings";
import { connectStripe } from "@/app/actions/listings";
import { stripeConfigured } from "@/lib/stripe";
import { formatMoney, tpl } from "@/lib/utils";

export default async function HostDashboard(props: PageProps<"/host">) {
  const sp = await props.searchParams;
  const user = await requireHost("/host");
  await sweepCompletedBookings();
  const [{ t, locale }, bookings, listings, stats] = await Promise.all([getT(), getHostBookings(user.id), getHostListings(user.id), getHostStats(user.id)]);
  const currency = listings[0]?.currency ?? "EUR";
  const published = listings.filter((l) => l.status === "published").length;
  const cards = [
    { label: t.host.statsMonth, value: formatMoney(stats.earnings30d, currency, locale, { compact: true }) },
    { label: t.host.statsPending, value: String(bookings.pending.length) },
    { label: t.host.statsUpcoming, value: String(bookings.upcoming.length) },
    { label: t.host.statsListings, value: String(published) },
  ];
  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{tpl(t.host.welcome, { name: user.name.split(" ")[0] })}</h1>
          <p className="mt-1 text-ink-600">{t.host.dashboardTitle}</p>
        </div>
        <ButtonLink href="/host/listings/new">
          <Plus className="h-4 w-4" aria-hidden /> {t.host.newListing}
        </ButtonLink>
      </div>

      <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-3xl border border-ink-100 bg-white p-5 shadow-card">
            <dt className="text-xs font-semibold uppercase tracking-wide text-ink-500">{c.label}</dt>
            <dd className="mt-2 font-display text-3xl font-bold">{c.value}</dd>
          </div>
        ))}
      </dl>

      {bookings.pending.length ? (
        <section>
          <h2 className="text-lg font-bold">{t.host.statsPending}</h2>
          <div className="mt-4 space-y-3">
            {bookings.pending.map((b) => (
              <BookingRow
                key={b.id}
                booking={{ ...b, counterpart: b.guest }}
                t={t}
                locale={locale}
                perspective="host"
                actions={
                  <form action={respondBooking} className="flex gap-2">
                    <input type="hidden" name="bookingId" value={b.id} />
                    <input type="hidden" name="back" value="/host" />
                    <Button type="submit" name="decision" value="accept" size="sm">
                      {t.host.accept}
                    </Button>
                    <Button type="submit" name="decision" value="decline" size="sm" variant="outline">
                      {t.host.decline}
                    </Button>
                  </form>
                }
              />
            ))}
          </div>
        </section>
      ) : null}

      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">{t.host.statsUpcoming}</h2>
          <Link href="/host/bookings" className="inline-flex items-center gap-1 text-sm font-semibold hover:underline">
            {t.common.seeAll} <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
        <div className="mt-4 space-y-3">
          {bookings.upcoming.length ? bookings.upcoming.slice(0, 5).map((b) => <BookingRow key={b.id} booking={{ ...b, counterpart: b.guest }} t={t} locale={locale} perspective="host" />) : <p className="text-sm text-ink-500">{t.host.noRequests}</p>}
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-3xl border border-ink-100 bg-white p-6">
          <h2 className="flex items-center gap-2 text-lg font-bold">
            <CreditCard className="h-5 w-5 text-brand-600" aria-hidden /> {t.host.payoutsTitle}
          </h2>
          <p className="mt-2 text-sm text-ink-600">{t.host.payoutsText}</p>
          {sp.stripe === "connected" || user.stripeAccountId ? (
            <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-800">{t.host.stripeConnected}</p>
          ) : stripeConfigured ? (
            <form action={connectStripe} className="mt-4">
              <Button type="submit" variant="dark">
                {t.host.stripeConnect}
              </Button>
            </form>
          ) : (
            <p className="mt-4 rounded-xl bg-ink-50 p-3 text-xs text-ink-600">{t.host.stripeNotConfigured}</p>
          )}
        </section>
        <section className="rounded-3xl bg-ink-950 p-6 text-white">
          <h2 className="flex items-center gap-2 text-lg font-bold">
            <Lightbulb className="h-5 w-5 text-brand-300" aria-hidden /> {t.host.tips}
          </h2>
          <ul className="mt-3 space-y-2 text-sm text-ink-300">
            {t.host.tipsList.map((tip) => (
              <li key={tip} className="flex gap-2">
                <span className="text-brand-300">•</span> {tip}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
