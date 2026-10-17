import { WEEKDAYS, type OpeningHours, type Weekday } from "@/lib/constants";
import { parseISODate } from "@/lib/utils";

export type Slot = { hour: number; available: boolean };

export function weekdayOf(date: string): Weekday {
  const d = parseISODate(date);
  // JS: 0 = Sunday. Our week starts on Monday.
  const idx = (d.getDay() + 6) % 7;
  return WEEKDAYS[idx];
}

export type BookedRange = { startHour: number; endHour: number };

/**
 * Builds the hourly slots for a date. Each slot represents the hour starting
 * at `hour` (e.g. 10 = 10:00–11:00). A slot is unavailable if the studio is
 * closed, the day is blocked, or an active booking overlaps.
 */
export function slotsForDate(
  opening: OpeningHours,
  date: string,
  booked: BookedRange[],
  blocked: boolean,
  now: Date = new Date(),
): { open: boolean; slots: Slot[]; window: { open: number; close: number } | null } {
  const day = opening[weekdayOf(date)];
  if (!day || blocked) return { open: false, slots: [], window: day };
  const slots: Slot[] = [];
  const isToday = date === toLocalISO(now);
  for (let h = day.open; h < day.close; h++) {
    const overlaps = booked.some((b) => h >= b.startHour && h < b.endHour);
    const past = isToday && h <= now.getHours();
    slots.push({ hour: h, available: !overlaps && !past });
  }
  return { open: true, slots, window: day };
}

export function isRangeAvailable(
  opening: OpeningHours,
  date: string,
  startHour: number,
  endHour: number,
  booked: BookedRange[],
  blocked: boolean,
  now: Date = new Date(),
): boolean {
  if (!(endHour > startHour)) return false;
  const { open, slots } = slotsForDate(opening, date, booked, blocked, now);
  if (!open) return false;
  for (let h = startHour; h < endHour; h++) {
    const slot = slots.find((s) => s.hour === h);
    if (!slot || !slot.available) return false;
  }
  return true;
}

/** Longest run of consecutive available hours on a date. */
export function longestFreeRun(slots: Slot[]): number {
  let best = 0;
  let run = 0;
  for (const s of slots) {
    run = s.available ? run + 1 : 0;
    best = Math.max(best, run);
  }
  return best;
}

function toLocalISO(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
