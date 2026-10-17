import { GUEST_FEE_RATE, HOST_FEE_RATE, type CancellationPolicy } from "@/lib/constants";
import type { BookingAddonSnapshot } from "@/db/schema";

export type AddonInput = { name: string; priceCents: number; unit: "hour" | "session" };

export type Quote = {
  hours: number;
  hourlyRate: number;
  subtotalCents: number;
  discountPct: number;
  discountCents: number;
  addonsCents: number;
  addons: BookingAddonSnapshot[];
  guestFeeCents: number;
  hostFeeCents: number;
  totalCents: number;
  hostPayoutCents: number;
};

export function quote(hourlyRate: number, hours: number, addons: AddonInput[] = [], discountPct = 0): Quote {
  const subtotalCents = hourlyRate * hours;
  const discountCents = Math.round((subtotalCents * discountPct) / 100);
  const snapshots: BookingAddonSnapshot[] = addons.map((a) => ({
    name: a.name,
    priceCents: a.priceCents,
    unit: a.unit,
    totalCents: a.unit === "hour" ? a.priceCents * hours : a.priceCents,
  }));
  const addonsCents = snapshots.reduce((sum, a) => sum + a.totalCents, 0);
  const base = subtotalCents - discountCents + addonsCents;
  const guestFeeCents = Math.round(base * GUEST_FEE_RATE);
  const hostFeeCents = Math.round(base * HOST_FEE_RATE);
  return {
    hours,
    hourlyRate,
    subtotalCents,
    discountPct,
    discountCents,
    addonsCents,
    addons: snapshots,
    guestFeeCents,
    hostFeeCents,
    totalCents: base + guestFeeCents,
    hostPayoutCents: base - hostFeeCents,
  };
}

/**
 * Off-peak pricing: a percentage discount on weekday sessions that end before
 * the listing's off-peak cut-off hour (e.g. weekday mornings).
 */
export function offPeakPct(listing: { offPeakDiscount: number; offPeakEndHour: number }, date: string, endHour: number): number {
  if (!listing.offPeakDiscount) return 0;
  const [y, m, d] = date.split("-").map(Number);
  const weekday = new Date(y, m - 1, d).getDay(); // 0 = Sunday
  if (weekday === 0 || weekday === 6) return 0;
  return endHour <= listing.offPeakEndHour ? listing.offPeakDiscount : 0;
}

/**
 * Refund fraction for a guest-initiated cancellation, based on how many hours
 * remain until the session starts.
 */
export function refundFraction(policy: CancellationPolicy, hoursUntilStart: number): number {
  switch (policy) {
    case "flexible":
      return hoursUntilStart >= 24 ? 1 : 0;
    case "moderate":
      if (hoursUntilStart >= 72) return 1;
      if (hoursUntilStart >= 24) return 0.5;
      return 0;
    case "strict":
      if (hoursUntilStart >= 24 * 7) return 1;
      if (hoursUntilStart >= 48) return 0.5;
      return 0;
  }
}

export function hoursUntil(date: string, startHour: number, now = new Date()): number {
  const [y, m, d] = date.split("-").map(Number);
  const start = new Date(y, m - 1, d, startHour, 0, 0, 0);
  return (start.getTime() - now.getTime()) / 36e5;
}

/** Monthly earnings estimate used by the host calculator on the landing page. */
export function estimateMonthlyEarnings(hourlyRateCents: number, freeHoursPerWeek: number, occupancy = 0.6) {
  const weekly = hourlyRateCents * freeHoursPerWeek * occupancy;
  const monthly = weekly * 4.33;
  return Math.round(monthly * (1 - HOST_FEE_RATE));
}
