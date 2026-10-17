"use client";

import { useRef, useState } from "react";
import { Images, X } from "lucide-react";
import { useT } from "@/lib/i18n/client";
import { cn } from "@/lib/utils";

export function Gallery({ photos, title }: { photos: { id: string; url: string; alt: string | null }[]; title: string }) {
  const { t } = useT();
  const dialog = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState(0);
  if (!photos.length) return <div className="aspect-[16/9] rounded-3xl bg-ink-200" />;
  const open = (i: number) => {
    setIndex(i);
    dialog.current?.showModal();
  };
  return (
    <>
      {/* Mobile: swipeable strip */}
      <div className="scrollbar-none -mx-4 flex snap-x snap-mandatory gap-2 overflow-x-auto px-4 md:hidden">
        {photos.map((p, i) => (
          <button key={p.id} type="button" onClick={() => open(i)} className="w-[88%] shrink-0 snap-center overflow-hidden rounded-2xl bg-ink-100">
            <img src={p.url} alt={p.alt ?? title} className="aspect-[4/3] w-full object-cover" loading={i === 0 ? "eager" : "lazy"} />
          </button>
        ))}
      </div>
      {/* Desktop: mosaic */}
      <div className="relative hidden grid-cols-4 grid-rows-2 gap-2 overflow-hidden rounded-3xl md:grid md:h-[460px]">
        {photos.slice(0, 5).map((p, i) => (
          <button key={p.id} type="button" onClick={() => open(i)} className={cn("overflow-hidden bg-ink-100", i === 0 ? "col-span-2 row-span-2" : "", photos.length === 4 && i === 3 ? "col-span-2" : "")}>
            <img src={p.url} alt={p.alt ?? title} className="h-full w-full object-cover transition hover:scale-[1.02]" loading={i === 0 ? "eager" : "lazy"} />
          </button>
        ))}
        {photos.length < 4
          ? Array.from({ length: 5 - photos.length }).map((_, i) => <div key={i} className="bg-ink-100" />)
          : null}
        <button type="button" onClick={() => open(0)} className="absolute bottom-4 right-4 inline-flex h-9 items-center gap-2 rounded-xl border border-ink-950/10 bg-white px-3 text-sm font-semibold shadow-card hover:bg-ink-50">
          <Images className="h-4 w-4" aria-hidden /> {t.listing.showAllPhotos}
        </button>
      </div>
      <dialog ref={dialog} className="m-auto w-[min(96vw,1100px)] rounded-3xl bg-ink-950 p-0 text-white backdrop:bg-ink-950/80" onClick={(e) => e.target === dialog.current && dialog.current?.close()}>
        <div className="flex items-center justify-between p-4">
          <p className="text-sm text-ink-300">
            {index + 1} / {photos.length}
          </p>
          <button type="button" className="rounded-full p-2 hover:bg-white/10" onClick={() => dialog.current?.close()} aria-label={t.common.close}>
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>
        <div className="px-4 pb-4">
          <img src={photos[index]?.url} alt={photos[index]?.alt ?? title} className="max-h-[70vh] w-full rounded-2xl object-contain" />
          <div className="scrollbar-none mt-3 flex gap-2 overflow-x-auto">
            {photos.map((p, i) => (
              <button key={p.id} type="button" onClick={() => setIndex(i)} className={cn("h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2", i === index ? "border-brand-400" : "border-transparent opacity-70")}>
                <img src={p.url} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      </dialog>
    </>
  );
}
