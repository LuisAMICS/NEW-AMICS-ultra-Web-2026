"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { SlidersHorizontal, X, Zap, Headphones } from "lucide-react";
import { useT } from "@/lib/i18n/client";
import { AMENITIES, LISTING_TYPES } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function SearchFilters({ resultCount }: { resultCount: number }) {
  const { t } = useT();
  const router = useRouter();
  const sp = useSearchParams();
  const [more, setMore] = useState(false);
  const [, start] = useTransition();

  const current = {
    type: sp.get("type") ?? "",
    max: sp.get("max") ?? "",
    instant: sp.get("instant") === "1",
    engineer: sp.get("engineer") === "1",
    amenities: (sp.get("amenities") ?? "").split(",").filter(Boolean),
    sort: sp.get("sort") ?? "recommended",
    from: sp.get("from") ?? "",
    to: sp.get("to") ?? "",
  };

  function update(patch: Record<string, string | null>) {
    const next = new URLSearchParams(sp.toString());
    for (const [k, v] of Object.entries(patch)) {
      if (v === null || v === "" || v === "0") next.delete(k);
      else next.set(k, v);
    }
    start(() => router.replace(`/studios?${next.toString()}`, { scroll: false }));
  }

  const activeCount = [current.type, current.max, current.instant ? "1" : "", current.engineer ? "1" : "", ...current.amenities, current.from].filter(Boolean).length;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="scrollbar-none -mx-1 flex max-w-full gap-2 overflow-x-auto px-1 py-1">
          <Chip active={!current.type} onClick={() => update({ type: null })}>
            {t.common.all}
          </Chip>
          {LISTING_TYPES.map((type) => (
            <Chip key={type} active={current.type === type} onClick={() => update({ type })}>
              {t.types[type].short}
            </Chip>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Chip active={current.instant} onClick={() => update({ instant: current.instant ? null : "1" })} icon={<Zap className="h-3.5 w-3.5" />}>
          {t.common.instantBook}
        </Chip>
        <Chip active={current.engineer} onClick={() => update({ engineer: current.engineer ? null : "1" })} icon={<Headphones className="h-3.5 w-3.5" />}>
          {t.search.engineerFilter}
        </Chip>
        <select value={current.max} onChange={(e) => update({ max: e.target.value })} className="h-9 rounded-full border border-ink-200 bg-white px-3 text-sm font-medium text-ink-800" aria-label={t.search.priceMax}>
          <option value="">{t.search.priceMax}</option>
          {[20, 30, 40, 50, 75, 100, 150].map((v) => (
            <option key={v} value={v}>
              ≤ {v} / h
            </option>
          ))}
        </select>
        <div className="flex items-center gap-1 rounded-full border border-ink-200 bg-white px-2 text-sm">
          <select value={current.from} onChange={(e) => update({ from: e.target.value, to: current.to || (e.target.value ? String(Math.min(24, Number(e.target.value) + 3)) : null) })} className="h-9 bg-transparent pl-1 font-medium text-ink-800" aria-label={t.search.from}>
            <option value="">{t.search.anyTime}</option>
            {Array.from({ length: 24 }, (_, h) => (
              <option key={h} value={h}>
                {String(h).padStart(2, "0")}:00
              </option>
            ))}
          </select>
          {current.from ? (
            <>
              <span className="text-ink-400">→</span>
              <select value={current.to} onChange={(e) => update({ to: e.target.value })} className="h-9 bg-transparent pr-1 font-medium text-ink-800" aria-label={t.search.to}>
                {Array.from({ length: 24 - Number(current.from) }, (_, i) => Number(current.from) + i + 1).map((h) => (
                  <option key={h} value={h}>
                    {String(h).padStart(2, "0")}:00
                  </option>
                ))}
              </select>
            </>
          ) : null}
        </div>
        <button type="button" onClick={() => setMore((m) => !m)} className={cn("inline-flex h-9 items-center gap-1.5 rounded-full border px-3 text-sm font-medium", more || current.amenities.length ? "border-ink-950 bg-ink-950 text-white" : "border-ink-200 bg-white text-ink-800")}>
          <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden /> {t.search.moreFilters}
          {current.amenities.length ? <span className="ml-1 rounded-full bg-brand-400 px-1.5 text-[11px] text-ink-950">{current.amenities.length}</span> : null}
        </button>
        <div className="ml-auto flex items-center gap-2">
          {activeCount ? (
            <button type="button" onClick={() => start(() => router.replace(`/studios${sp.get("q") ? `?q=${encodeURIComponent(sp.get("q")!)}` : ""}`))} className="inline-flex h-9 items-center gap-1 rounded-full px-2 text-sm text-ink-600 hover:text-ink-950">
              <X className="h-3.5 w-3.5" aria-hidden /> {t.search.clearFilters}
            </button>
          ) : null}
          <select value={current.sort} onChange={(e) => update({ sort: e.target.value === "recommended" ? null : e.target.value })} className="h-9 rounded-full border border-ink-200 bg-white px-3 text-sm font-medium text-ink-800" aria-label={t.common.sort}>
            <option value="recommended">{t.common.sortRecommended}</option>
            <option value="rating">{t.common.sortRating}</option>
            <option value="price_asc">{t.common.sortPriceAsc}</option>
            <option value="price_desc">{t.common.sortPriceDesc}</option>
          </select>
        </div>
      </div>
      {more ? (
        <div className="flex flex-wrap gap-2 rounded-2xl border border-ink-100 bg-white p-3">
          {AMENITIES.map((a) => {
            const active = current.amenities.includes(a);
            return (
              <Chip
                key={a}
                active={active}
                onClick={() => {
                  const next = active ? current.amenities.filter((x) => x !== a) : [...current.amenities, a];
                  update({ amenities: next.join(",") });
                }}
              >
                {t.amenities[a]}
              </Chip>
            );
          })}
        </div>
      ) : null}
      <p className="text-sm text-ink-500">{resultCount === 1 ? t.search.countOne : t.search.count.replace("{n}", String(resultCount))}</p>
    </div>
  );
}

function Chip({ active, onClick, children, icon }: { active?: boolean; onClick: () => void; children: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn("inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border px-3.5 text-sm font-medium transition", active ? "border-ink-950 bg-ink-950 text-white" : "border-ink-200 bg-white text-ink-800 hover:border-ink-400")}
    >
      {icon}
      {children}
    </button>
  );
}
