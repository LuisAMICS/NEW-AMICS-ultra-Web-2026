import { getT } from "@/lib/i18n";
import { requireUser } from "@/lib/auth";
import { getGuestBookings, sweepCompletedBookings } from "@/lib/queries/bookings";
import { BookingRow } from "@/components/booking/booking-row";
import { ButtonLink } from "@/components/ui/button";

export default async function AccountBookingsPage() {
  const user = await requireUser("/account/bookings");
  await sweepCompletedBookings();
  const [{ t, locale }, { upcoming, past }] = await Promise.all([getT(), getGuestBookings(user.id)]);
  if (!upcoming.length && !past.length) {
    return (
      <div className="rounded-3xl border border-dashed border-ink-200 bg-white p-10 text-center">
        <h2 className="text-xl font-bold">{t.account.noBookings}</h2>
        <p className="mt-2 text-ink-600">{t.account.noBookingsText}</p>
        <ButtonLink href="/studios" className="mt-6">
          {t.account.exploreCta}
        </ButtonLink>
      </div>
    );
  }
  return (
    <div className="space-y-10">
      <section>
        <h2 className="text-lg font-bold">{t.account.upcoming}</h2>
        <div className="mt-4 space-y-3">
          {upcoming.length ? upcoming.map((b) => <BookingRow key={b.id} booking={{ ...b, counterpart: b.host }} t={t} locale={locale} perspective="guest" />) : <p className="text-sm text-ink-500">—</p>}
        </div>
      </section>
      <section>
        <h2 className="text-lg font-bold">{t.account.past}</h2>
        <div className="mt-4 space-y-3">
          {past.length ? past.map((b) => <BookingRow key={b.id} booking={{ ...b, counterpart: b.host }} t={t} locale={locale} perspective="guest" />) : <p className="text-sm text-ink-500">—</p>}
        </div>
      </section>
    </div>
  );
}
