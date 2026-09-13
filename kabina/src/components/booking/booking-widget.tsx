"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Zap, Clock, Info } from "lucide-react";
import { useT } from "@/lib/i18n/client";
import { slotsForDate, longestFreeRun, type BookedRange } from "@/lib/availability";
import { offPeakPct, quote, type AddonInput } from "@/lib/pricing";
import { buttonClasses } from "@/components/ui/button";
import { addDaysISO, cn, formatHour, formatMoney, parseISODate, todayISO, toISODate, tpl } from "@/lib/utils";
import type { OpeningHours, CancellationPolicy } from "@/lib/constants";

export type WidgetListing = {
  id: string;
  slug: string;
  hourlyRate: number;
  currency: string;
  minHours: number;
  maxHours: number;
  instantBook: boolean;
  openingHours: OpeningHours;
  offPeakDiscount: number;
  offPeakEndHour: number;
  engineerAvailable: boolean;
  engineerRate: number | null;
  cancellationPolicy: CancellationPolicy;
  addons: { id: string; name: string; description: string | null; priceCents: number; unit: "hour" | "session" }[];
};

type Props = {
  listing: WidgetListing;
  booked: Record<string, BookedRange[]>;
  blocked: string[];
  loggedIn: boolean;
  isOwner: boolean;
  initial?: { date?: string; from?: number; to?: number };
  pathname: string;
};

export function BookingWidget({ listing, booked, blocked, loggedIn, isOwner, initial, pathname }: Props) {
  const { t, locale } = useT();
  const today = todayISO();
  const blockedSet = useMemo(() => new Set(blocked), [blocked]);

  const dayInfo = (date: string) => {
    const { open, slots } = slotsForDate(listing.openingHours, date, booked[date] ?? [], blockedSet.has(date));
    return { open, slots, free: open ? longestFreeRun(slots) : 0 };
  };

  const firstAvailable = useMemo(() => {
    for (let i = 0; i < 60; i++) {
      const d = addDaysISO(today, i);
      if (dayInfo(d).free >= listing.minHours) return d;
    }
    return today;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [date, setDate] = useState(initial?.date && initial.date >= today ? initial.date : firstAvailable);
  const [month, setMonth] = useState(() => {
    const d = parseISODate(date);
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const [start, setStart] = useState<number | null>(initial?.from ?? null);
  const [end, setEnd] = useState<number | null>(initial?.to ?? null);
  const [addonIds, setAddonIds] = useState<string[]>([]);
  const [engineer, setEngineer] = useState(false);

  const info = dayInfo(date);
  // While choosing the end hour, only hours reachable without crossing a taken slot (and within maxHours) are enabled.
  const reachableEnd = (() => {
    if (start === null || end !== null) return null;
    let h = start + 1;
    while (h < start + listing.maxHours) {
      const s = info.slots.find((x) => x.hour === h);
      if (!s || !s.available) break;
      h++;
    }
    return h;
  })();
  const hours = start !== null && end !== null ? end - start : 0;
  const validRange =
    start !== null &&
    end !== null &&
    hours >= listing.minHours &&
    hours <= listing.maxHours &&
    info.slots.length > 0 &&
    Array.from({ length: hours }, (_, i) => start + i).every((h) => info.slots.find((s) => s.hour === h)?.available);

  const addonInputs: AddonInput[] = [
    ...listing.addons.filter((a) => addonIds.includes(a.id)).map((a) => ({ name: a.name, priceCents: a.priceCents, unit: a.unit })),
    ...(engineer && listing.engineerRate ? [{ name: t.listing.engineerAddon, priceCents: listing.engineerRate, unit: "hour" as const }] : []),
  ];
  const pct = validRange ? offPeakPct(listing, date, end!) : 0;
  const q = validRange ? quote(listing.hourlyRate, hours, addonInputs, pct) : null;

  function pickHour(h: number) {
    if (start !== null && end === null) {
      // Second tap: same hour = one-hour session, later hour = range end (exclusive), earlier hour = new start.
      if (h < start) setStart(h);
      else setEnd(h + 1);
      return;
    }
    setStart(h);
    setEnd(null);
  }

  function selectDate(d: string) {
    setDate(d);
    setStart(null);
    setEnd(null);
  }

  // Calendar grid
  const monthDays = useMemo(() => {
    const first = new Date(month.getFullYear(), month.getMonth(), 1);
    const offset = (first.getDay() + 6) % 7; // Monday first
    const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
    const cells: (string | null)[] = Array(offset).fill(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(toISODate(new Date(month.getFullYear(), month.getMonth(), d)));
    return cells;
  }, [month]);
  const maxDate = addDaysISO(today, 59);

  const params = new URLSearchParams({ date, from: String(start ?? ""), to: String(end ?? "") });
  if (addonIds.length) params.set("addons", addonIds.join(","));
  if (engineer) params.set("engineer", "1");
  const bookHref = `/studios/${listing.slug}/book?${params.toString()}`;
  const loginHref = `/login?next=${encodeURIComponent(`${pathname}?${params.toString()}`)}`;
  const weekdayKeys = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;

  return (
    <div className="rounded-3xl border border-ink-100 bg-white p-5 shadow-float">
      <div className="flex items-baseline justify-between">
        <p>
          <span className="text-2xl font-bold">{formatMoney(listing.hourlyRate, listing.currency, locale, { compact: true })}</span>
          <span className="text-ink-500"> {t.common.perHour}</span>
        </p>
        <p className="text-xs text-ink-500">{tpl(t.listing.minHoursNote, { n: listing.minHours })}</p>
      </div>
      {listing.offPeakDiscount ? (
        <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-brand-100 px-2.5 py-1 text-xs font-semibold text-brand-800">
          <Clock className="h-3.5 w-3.5" aria-hidden /> {tpl(t.listing.offPeakNote, { pct: listing.offPeakDiscount, hour: formatHour(listing.offPeakEndHour) })}
        </p>
      ) : null}

      {/* Calendar */}
      <div className="mt-5">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold">{t.listing.chooseDate}</p>
          <div className="flex items-center gap-1">
            <button type="button" className="rounded-full p-1.5 hover:bg-ink-100" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))} aria-label={t.common.prev}>
              <ChevronLeft className="h-4 w-4" aria-hidden />
            </button>
            <span className="min-w-28 text-center text-sm font-medium capitalize">{month.toLocaleDateString(locale === "es" ? "es-ES" : "en-GB", { month: "long", year: "numeric" })}</span>
            <button type="button" className="rounded-full p-1.5 hover:bg-ink-100" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))} aria-label={t.common.next}>
              <ChevronRight className="h-4 w-4" aria-hidden />
            </button>
          </div>
        </div>
        <div className="mt-2 grid grid-cols-7 gap-1 text-center text-[11px] font-semibold uppercase text-ink-400">
          {weekdayKeys.map((k) => (
            <span key={k}>{t.weekdays.short[k]}</span>
          ))}
        </div>
        <div className="mt-1 grid grid-cols-7 gap-1">
          {monthDays.map((d, i) =>
            d === null ? (
              <span key={`e${i}`} />
            ) : (
              (() => {
                const past = d < today || d > maxDate;
                const di = past ? null : dayInfo(d);
                const available = !!di && di.free >= listing.minHours;
                const selected = d === date;
                return (
                  <button
                    key={d}
                    type="button"
                    disabled={!available}
                    onClick={() => selectDate(d)}
                    className={cn(
                      "flex h-9 items-center justify-center rounded-lg text-sm transition",
                      selected ? "bg-ink-950 font-semibold text-white" : available ? "font-medium text-ink-900 hover:bg-ink-100" : "text-ink-300 line-through decoration-ink-200",
                    )}
                  >
                    {Number(d.slice(-2))}
                  </button>
                );
              })()
            ),
          )}
        </div>
      </div>

      {/* Hours */}
      <div className="mt-5">
        <p className="text-sm font-semibold">{t.listing.chooseHours}</p>
        {!info.open ? (
          <p className="mt-2 text-sm text-ink-500">{t.listing.closedThatDay}</p>
        ) : info.free === 0 ? (
          <p className="mt-2 text-sm text-ink-500">{t.listing.noSlots}</p>
        ) : (
          <>
            <p className="mt-1 text-xs text-ink-500">{t.listing.selectHoursHint} · {tpl(t.listing.dayOpen, { open: formatHour(info.slots[0].hour), close: formatHour(info.slots[info.slots.length - 1].hour + 1) })}</p>
            <div className="mt-2 grid grid-cols-4 gap-1.5 sm:grid-cols-5">
              {info.slots.map((s) => {
                const inRange = start !== null && (end !== null ? s.hour >= start && s.hour < end : s.hour === start);
                const unreachable = reachableEnd !== null && start !== null && s.hour > start && s.hour + 1 > reachableEnd;
                return (
                  <button
                    key={s.hour}
                    type="button"
                    disabled={!s.available || unreachable}
                    onClick={() => pickHour(s.hour)}
                    className={cn(
                      "h-9 rounded-lg border text-sm font-medium transition",
                      !s.available ? "cursor-not-allowed border-ink-100 bg-ink-50 text-ink-300 line-through" : unreachable ? "cursor-not-allowed border-ink-100 bg-white text-ink-300" : inRange ? "border-ink-950 bg-ink-950 text-white" : "border-ink-200 bg-white text-ink-800 hover:border-ink-950",
                    )}
                    aria-label={`${formatHour(s.hour)}${!s.available ? ` (${t.listing.unavailableSlot})` : ""}`}
                  >
                    {formatHour(s.hour)}
                  </button>
                );
              })}
            </div>
            {start !== null && end === null ? <p className="mt-2 text-xs text-ink-500">{t.listing.endTime}: {formatHour(start + 1)}…</p> : null}
            {start !== null && end !== null && !validRange ? (
              <p className="mt-2 flex items-start gap-1.5 text-xs text-rec">
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
                {hours < listing.minHours ? tpl(t.listing.minHoursNote, { n: listing.minHours }) : hours > listing.maxHours ? tpl(t.listing.maxHoursNote, { n: listing.maxHours }) : t.booking.conflict}
              </p>
            ) : null}
          </>
        )}
      </div>

      {/* Add-ons */}
      {listing.addons.length || (listing.engineerAvailable && listing.engineerRate) ? (
        <div className="mt-5">
          <p className="text-sm font-semibold">{t.listing.addonsTitle}</p>
          <ul className="mt-2 space-y-2">
            {listing.engineerAvailable && listing.engineerRate ? (
              <li>
                <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-ink-100 p-3 hover:bg-ink-50">
                  <input type="checkbox" checked={engineer} onChange={(e) => setEngineer(e.target.checked)} className="mt-1 accent-ink-950" />
                  <span className="flex-1 text-sm">
                    <span className="font-medium">{t.listing.engineerAddon}</span>
                    <span className="block text-xs text-ink-500">
                      {formatMoney(listing.engineerRate, listing.currency, locale, { compact: true })} {t.common.perHour}
                    </span>
                  </span>
                </label>
              </li>
            ) : null}
            {listing.addons.map((a) => (
              <li key={a.id}>
                <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-ink-100 p-3 hover:bg-ink-50">
                  <input type="checkbox" checked={addonIds.includes(a.id)} onChange={(e) => setAddonIds((ids) => (e.target.checked ? [...ids, a.id] : ids.filter((x) => x !== a.id)))} className="mt-1 accent-ink-950" />
                  <span className="flex-1 text-sm">
                    <span className="font-medium">{a.name}</span>
                    {a.description ? <span className="block text-xs text-ink-500">{a.description}</span> : null}
                    <span className="block text-xs text-ink-500">
                      {formatMoney(a.priceCents, listing.currency, locale, { compact: true })} {a.unit === "hour" ? t.common.perHour : t.listing.perSession}
                    </span>
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {/* Price */}
      {q ? (
        <dl className="mt-5 space-y-1.5 border-t border-ink-100 pt-4 text-sm">
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
      ) : null}

      <div className="mt-5">
        {isOwner ? (
          <p className="rounded-xl bg-ink-50 p-3 text-center text-sm text-ink-600">{t.booking.ownListing}</p>
        ) : !loggedIn ? (
          <Link href={validRange ? loginHref : `/login?next=${encodeURIComponent(pathname)}`} className={buttonClasses("dark", "lg", "w-full")}>
            {t.listing.loginToBook}
          </Link>
        ) : validRange ? (
          <Link href={bookHref} className={buttonClasses("primary", "lg", "w-full")}>
            {listing.instantBook ? <Zap className="h-4 w-4" aria-hidden /> : null}
            {listing.instantBook ? t.listing.bookCta : t.listing.requestCta}
          </Link>
        ) : (
          <button type="button" disabled className={buttonClasses("primary", "lg", "w-full")}>
            {listing.instantBook ? t.listing.bookCta : t.listing.requestCta}
          </button>
        )}
        <p className="mt-3 text-center text-xs text-ink-500">{listing.instantBook ? t.listing.instantBookNote : t.listing.requestNote}</p>
      </div>
    </div>
  );
}
