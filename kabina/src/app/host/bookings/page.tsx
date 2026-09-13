import { getT } from "@/lib/i18n";
import { requireHost } from "@/lib/auth";
import { getHostBookings, sweepCompletedBookings } from "@/lib/queries/bookings";
import { BookingRow } from "@/components/booking/booking-row";
import { Button } from "@/components/ui/button";
import { respondBooking } from "@/app/actions/bookings";

export default async function HostBookingsPage() {
  const user = await requireHost("/host/bookings");
  await sweepCompletedBookings();
  const [{ t, locale }, bookings] = await Promise.all([getT(), getHostBookings(user.id)]);
  const groups = [
    { title: t.host.statsPending, items: bookings.pending, pending: true },
    { title: t.account.upcoming, items: bookings.upcoming },
    { title: t.account.past, items: bookings.past },
  ];
  return (
    <div className="space-y-10">
      <h1 className="text-2xl font-bold">{t.host.requestsTitle}</h1>
      {bookings.all.length === 0 ? <p className="rounded-3xl border border-dashed border-ink-200 bg-white p-10 text-center text-ink-600">{t.host.noRequests}</p> : null}
      {groups.map((g) =>
        g.items.length ? (
          <section key={g.title}>
            <h2 className="text-lg font-bold">{g.title}</h2>
            <div className="mt-4 space-y-3">
              {g.items.map((b) => (
                <BookingRow
                  key={b.id}
                  booking={{ ...b, counterpart: b.guest }}
                  t={t}
                  locale={locale}
                  perspective="host"
                  actions={
                    g.pending ? (
                      <form action={respondBooking} className="flex gap-2">
                        <input type="hidden" name="bookingId" value={b.id} />
                        <input type="hidden" name="back" value="/host/bookings" />
                        <Button type="submit" name="decision" value="accept" size="sm">
                          {t.host.accept}
                        </Button>
                        <Button type="submit" name="decision" value="decline" size="sm" variant="outline">
                          {t.host.decline}
                        </Button>
                      </form>
                    ) : undefined
                  }
                />
              ))}
            </div>
          </section>
        ) : null,
      )}
    </div>
  );
}
