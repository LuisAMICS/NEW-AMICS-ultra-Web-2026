import Link from "next/link";
import { ChevronLeft, ChevronRight, Lock } from "lucide-react";
import { getT } from "@/lib/i18n";
import { requireHost } from "@/lib/auth";
import { getHostListings, getListingCalendar } from "@/lib/queries/host";
import { toggleBlockedDate } from "@/app/actions/listings";
import { ButtonLink } from "@/components/ui/button";
import { WEEKDAYS } from "@/lib/constants";
import { cn, formatHourRange, todayISO, toISODate } from "@/lib/utils";

export default async function HostCalendarPage(props: PageProps<"/host/calendar">) {
  const sp = await props.searchParams;
  const user = await requireHost("/host/calendar");
  const [{ t, locale }, listings] = await Promise.all([getT(), getHostListings(user.id)]);
  if (!listings.length) {
    return (
      <div className="rounded-3xl border border-dashed border-ink-200 bg-white p-10 text-center">
        <p className="text-ink-600">{t.host.noListings}</p>
        <ButtonLink href="/host/listings/new" className="mt-6">
          {t.host.newListing}
        </ButtonLink>
      </div>
    );
  }
  const listing = listings.find((l) => l.id === sp.listing) ?? listings[0];
  const today = todayISO();
  const monthStr = typeof sp.month === "string" && /^\d{4}-\d{2}$/.test(sp.month) ? sp.month : today.slice(0, 7);
  const [y, m] = monthStr.split("-").map(Number);
  const { bookings, blocked } = await getListingCalendar(listing.id, monthStr);
  const first = new Date(y, m - 1, 1);
  const offset = (first.getDay() + 6) % 7;
  const days = new Date(y, m, 0).getDate();
  const prev = `${new Date(y, m - 2, 1).getFullYear()}-${String(new Date(y, m - 2, 1).getMonth() + 1).padStart(2, "0")}`;
  const next = `${new Date(y, m, 1).getFullYear()}-${String(new Date(y, m, 1).getMonth() + 1).padStart(2, "0")}`;
  const monthLabel = first.toLocaleDateString(locale === "es" ? "es-ES" : "en-GB", { month: "long", year: "numeric" });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">{t.host.calendarTitle}</h1>
        <form method="get" className="flex items-center gap-2">
          <input type="hidden" name="month" value={monthStr} />
          <select name="listing" defaultValue={listing.id} className="h-10 rounded-xl border border-ink-200 bg-white px-3 text-sm font-medium">
            {listings.map((l) => (
              <option key={l.id} value={l.id}>
                {l.title}
              </option>
            ))}
          </select>
          <button type="submit" className="h-10 rounded-xl bg-ink-950 px-4 text-sm font-semibold text-white">
            {t.common.apply}
          </button>
        </form>
      </div>
      <p className="mt-2 text-sm text-ink-500">{t.host.blockHint}</p>

      <div className="mt-6 rounded-3xl border border-ink-100 bg-white p-4 md:p-6">
        <div className="flex items-center justify-between">
          <Link href={`/host/calendar?listing=${listing.id}&month=${prev}`} className="rounded-full p-2 hover:bg-ink-100" aria-label={t.common.prev}>
            <ChevronLeft className="h-5 w-5" aria-hidden />
          </Link>
          <p className="font-semibold capitalize">{monthLabel}</p>
          <Link href={`/host/calendar?listing=${listing.id}&month=${next}`} className="rounded-full p-2 hover:bg-ink-100" aria-label={t.common.next}>
            <ChevronRight className="h-5 w-5" aria-hidden />
          </Link>
        </div>
        <div className="mt-4 grid grid-cols-7 gap-1 text-center text-[11px] font-semibold uppercase text-ink-400">
          {WEEKDAYS.map((d) => (
            <span key={d}>{t.weekdays.short[d]}</span>
          ))}
        </div>
        <div className="mt-1 grid grid-cols-7 gap-1">
          {Array.from({ length: offset }).map((_, i) => (
            <span key={`e${i}`} />
          ))}
          {Array.from({ length: days }, (_, i) => {
            const date = toISODate(new Date(y, m - 1, i + 1));
            const dayBookings = bookings.filter((b) => b.date === date);
            const isBlocked = blocked.has(date);
            const past = date < today;
            const closed = !listing.openingHours[WEEKDAYS[(new Date(y, m - 1, i + 1).getDay() + 6) % 7]];
            return (
              <div key={date} className={cn("flex min-h-24 flex-col rounded-xl border p-1.5 text-left text-xs", past ? "border-ink-50 bg-ink-50 text-ink-400" : isBlocked ? "border-ink-200 bg-ink-100" : closed ? "border-ink-50 bg-paper text-ink-400" : "border-ink-100 bg-white")}>
                <div className="flex items-center justify-between">
                  <span className={cn("font-semibold", date === today && "rounded-full bg-ink-950 px-1.5 text-white")}>{i + 1}</span>
                  {!past && !dayBookings.length ? (
                    <form action={toggleBlockedDate}>
                      <input type="hidden" name="listingId" value={listing.id} />
                      <input type="hidden" name="date" value={date} />
                      <input type="hidden" name="month" value={monthStr} />
                      <button type="submit" className={cn("rounded p-0.5", isBlocked ? "text-ink-900" : "text-ink-300 hover:text-ink-900")} title={isBlocked ? t.host.unblock : t.host.blockDate} aria-label={isBlocked ? t.host.unblock : t.host.blockDate}>
                        <Lock className="h-3.5 w-3.5" aria-hidden />
                      </button>
                    </form>
                  ) : null}
                </div>
                <ul className="mt-1 space-y-0.5">
                  {dayBookings.map((b) => (
                    <li key={b.id}>
                      <Link href={`/bookings/${b.id}`} className={cn("block truncate rounded px-1 py-0.5", b.status === "pending" ? "bg-brand-100 text-brand-900" : "bg-ink-950 text-white")}>
                        {formatHourRange(b.startHour, b.endHour)} {b.guest.name.split(" ")[0]}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
