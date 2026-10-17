"use client";

import { MapPin, CalendarDays, SlidersHorizontal, Search } from "lucide-react";
import { useT } from "@/lib/i18n/client";
import { LISTING_TYPES } from "@/lib/constants";
import { cn, todayISO } from "@/lib/utils";

export function SearchBar({
  cities,
  defaults,
  variant = "hero",
  className,
}: {
  cities: string[];
  defaults?: { q?: string; date?: string; type?: string };
  variant?: "hero" | "compact";
  className?: string;
}) {
  const { t } = useT();
  const hero = variant === "hero";
  return (
    <form
      action="/studios"
      method="get"
      className={cn(
        "grid gap-2 rounded-3xl bg-white p-2 shadow-float ring-1 ring-ink-950/5",
        hero ? "md:grid-cols-[1.4fr_1fr_1fr_auto]" : "md:grid-cols-[1.4fr_1fr_1fr_auto] md:rounded-full",
        className,
      )}
      role="search"
    >
      <label className="flex items-center gap-3 rounded-2xl px-4 py-2.5 hover:bg-ink-50 md:rounded-full">
        <MapPin className="h-5 w-5 shrink-0 text-ink-500" aria-hidden />
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-500">{t.home.searchWhere}</span>
          <input name="q" list="kb-cities" defaultValue={defaults?.q} placeholder={t.home.searchWherePlaceholder} className="w-full bg-transparent text-[15px] font-medium text-ink-950 placeholder:font-normal placeholder:text-ink-400 focus:outline-none" autoComplete="off" />
        </span>
        <datalist id="kb-cities">
          {cities.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>
      </label>
      <label className="flex items-center gap-3 rounded-2xl px-4 py-2.5 hover:bg-ink-50 md:rounded-full">
        <CalendarDays className="h-5 w-5 shrink-0 text-ink-500" aria-hidden />
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-500">{t.home.searchWhen}</span>
          <input type="date" name="date" min={todayISO()} defaultValue={defaults?.date} className="w-full bg-transparent text-[15px] font-medium text-ink-950 focus:outline-none" />
        </span>
      </label>
      <label className="flex items-center gap-3 rounded-2xl px-4 py-2.5 hover:bg-ink-50 md:rounded-full">
        <SlidersHorizontal className="h-5 w-5 shrink-0 text-ink-500" aria-hidden />
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-500">{t.home.searchWhat}</span>
          <select name="type" defaultValue={defaults?.type ?? ""} className="w-full bg-transparent text-[15px] font-medium text-ink-950 focus:outline-none">
            <option value="">{t.home.searchAnyType}</option>
            {LISTING_TYPES.map((type) => (
              <option key={type} value={type}>
                {t.types[type].label}
              </option>
            ))}
          </select>
        </span>
      </label>
      <button type="submit" className={cn("inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-400 px-6 font-semibold text-ink-950 transition hover:bg-brand-300 md:rounded-full", hero ? "h-14" : "h-12 md:h-auto")}>
        <Search className="h-5 w-5" aria-hidden />
        <span className={hero ? "" : "md:sr-only lg:not-sr-only"}>{t.home.searchButton}</span>
      </button>
    </form>
  );
}
