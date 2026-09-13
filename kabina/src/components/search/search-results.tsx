"use client";

import { useState } from "react";
import { List, Map as MapIcon } from "lucide-react";
import { StudioMapLazy } from "@/components/map/studio-map-lazy";
import { useT } from "@/lib/i18n/client";
import type { MapPoint } from "@/components/map/studio-map";
import { cn } from "@/lib/utils";

export function SearchResults({ cards, points, empty }: { cards: React.ReactNode; points: MapPoint[]; empty: React.ReactNode }) {
  const { t, locale } = useT();
  const [showMap, setShowMap] = useState(false);
  return (
    <div className="relative mt-6 grid gap-6 lg:grid-cols-[1fr_minmax(360px,42%)]">
      <div className={cn(showMap ? "hidden lg:block" : "")}>
        {points.length || cards ? <div className="grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 xl:grid-cols-3">{cards}</div> : null}
        {empty}
      </div>
      <div className={cn("lg:sticky lg:top-24 lg:h-[calc(100vh-7rem)]", showMap ? "h-[70vh]" : "hidden lg:block")}>
        <div className="h-full overflow-hidden rounded-2xl border border-ink-100 bg-ink-100 shadow-card">
          <StudioMapLazy points={points} locale={locale} />
        </div>
      </div>
      <button
        type="button"
        onClick={() => setShowMap((m) => !m)}
        className="fixed bottom-5 left-1/2 z-30 inline-flex h-11 -translate-x-1/2 items-center gap-2 rounded-full bg-ink-950 px-5 text-sm font-semibold text-white shadow-float lg:hidden"
      >
        {showMap ? <List className="h-4 w-4" aria-hidden /> : <MapIcon className="h-4 w-4" aria-hidden />}
        {showMap ? t.search.hideMap : t.search.showMap}
      </button>
    </div>
  );
}
