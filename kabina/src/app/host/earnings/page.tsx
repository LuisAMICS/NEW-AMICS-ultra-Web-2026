import Link from "next/link";
import { getT } from "@/lib/i18n";
import { requireHost } from "@/lib/auth";
import { getHostEarnings, sweepCompletedBookings } from "@/lib/queries/bookings";
import { StatusBadge } from "@/components/booking/status-badge";
import { formatDate, formatHourRange, formatMoney } from "@/lib/utils";

export default async function HostEarningsPage() {
  const user = await requireHost("/host/earnings");
  await sweepCompletedBookings();
  const [{ t, locale }, { rows, months }] = await Promise.all([getT(), getHostEarnings(user.id)]);
  return (
    <div>
      <h1 className="text-2xl font-bold">{t.host.earningsTitle}</h1>
      <p className="mt-1 text-sm text-ink-500">{t.host.earningsNote}</p>
      <div className="mt-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {months.slice(0, 6).map((m) => (
          <div key={m.month} className="rounded-2xl border border-ink-100 bg-white p-4">
            <p className="text-xs font-semibold uppercase text-ink-500">{new Date(Number(m.month.slice(0, 4)), Number(m.month.slice(5, 7)) - 1, 1).toLocaleDateString(locale === "es" ? "es-ES" : "en-GB", { month: "short", year: "2-digit" })}</p>
            <p className="mt-1 font-display text-xl font-bold">{formatMoney(m.payout, m.currency, locale, { compact: true })}</p>
            <p className="text-xs text-ink-500">
              {m.sessions} {m.sessions === 1 ? t.common.hour.replace("hora", "sesión").replace("hour", "session") : locale === "es" ? "sesiones" : "sessions"}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-8 overflow-x-auto rounded-3xl border border-ink-100 bg-white">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="bg-ink-50 text-left text-xs uppercase tracking-wide text-ink-500">
            <tr>
              <th className="px-4 py-3">{t.common.date}</th>
              <th className="px-4 py-3">{t.booking.studio}</th>
              <th className="px-4 py-3">{t.booking.guest}</th>
              <th className="px-4 py-3">{t.common.status}</th>
              <th className="px-4 py-3 text-right">{t.booking.payout}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {rows.map((b) => (
              <tr key={b.id}>
                <td className="px-4 py-3 whitespace-nowrap">
                  <Link href={`/bookings/${b.id}`} className="hover:underline">
                    {formatDate(b.date, locale, "short")} · {formatHourRange(b.startHour, b.endHour)}
                  </Link>
                </td>
                <td className="max-w-56 truncate px-4 py-3">{b.listing.title}</td>
                <td className="px-4 py-3">{b.guest.name}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={b.status} t={t} />
                </td>
                <td className="px-4 py-3 text-right font-semibold">{formatMoney(b.hostPayoutCents, b.currency, locale)}</td>
              </tr>
            ))}
            {rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-ink-500">
                  {t.host.noRequests}
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
