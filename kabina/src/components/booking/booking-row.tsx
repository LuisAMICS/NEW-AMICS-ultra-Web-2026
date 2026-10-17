import Link from "next/link";
import { CalendarDays, Clock, ChevronRight } from "lucide-react";
import { StatusBadge } from "./status-badge";
import { Avatar } from "@/components/ui/avatar";
import type { Dictionary, Locale } from "@/lib/i18n";
import { formatDate, formatHourRange, formatMoney } from "@/lib/utils";
import type { BookingStatus } from "@/lib/constants";

export type BookingRowData = {
  id: string;
  code: string;
  date: string;
  startHour: number;
  endHour: number;
  hours: number;
  status: BookingStatus;
  totalCents: number;
  hostPayoutCents: number;
  currency: string;
  listing: { title: string; city: string; slug: string; photos: { url: string }[] };
  counterpart?: { name: string; avatarUrl: string | null } | null;
};

export function BookingRow({ booking, t, locale, perspective, actions }: { booking: BookingRowData; t: Dictionary; locale: Locale; perspective: "guest" | "host"; actions?: React.ReactNode }) {
  const amount = perspective === "guest" ? booking.totalCents : booking.hostPayoutCents;
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-ink-100 bg-white p-4 shadow-card sm:flex-row sm:items-center">
      <Link href={`/bookings/${booking.id}`} className="flex flex-1 items-center gap-4">
        {booking.listing.photos[0] ? <img src={booking.listing.photos[0].url} alt="" className="h-16 w-24 shrink-0 rounded-xl object-cover" /> : <div className="h-16 w-24 shrink-0 rounded-xl bg-ink-100" />}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={booking.status} t={t} />
            <span className="text-xs text-ink-400">{booking.code}</span>
          </div>
          <p className="mt-1 truncate font-semibold">{booking.listing.title}</p>
          <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-sm text-ink-600">
            <span className="inline-flex items-center gap-1 capitalize">
              <CalendarDays className="h-3.5 w-3.5" aria-hidden /> {formatDate(booking.date, locale, "weekday")}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" aria-hidden /> {formatHourRange(booking.startHour, booking.endHour)}
            </span>
          </p>
        </div>
      </Link>
      <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
        {booking.counterpart ? (
          <span className="inline-flex items-center gap-2 text-sm text-ink-700">
            <Avatar name={booking.counterpart.name} src={booking.counterpart.avatarUrl} size="sm" /> {booking.counterpart.name.split(" ")[0]}
          </span>
        ) : null}
        <span className="font-bold">{formatMoney(amount, booking.currency, locale)}</span>
      </div>
      {actions ? <div className="flex gap-2">{actions}</div> : <ChevronRight className="hidden h-5 w-5 text-ink-300 sm:block" aria-hidden />}
    </div>
  );
}
