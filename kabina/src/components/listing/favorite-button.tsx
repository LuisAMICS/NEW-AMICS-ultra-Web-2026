"use client";

import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useOptimistic, useTransition } from "react";
import { toggleFavorite } from "@/app/actions/favorites";
import { useT } from "@/lib/i18n/client";
import { cn } from "@/lib/utils";

export function FavoriteButton({ listingId, initial, className, variant = "overlay" }: { listingId: string; initial: boolean; className?: string; variant?: "overlay" | "inline" }) {
  const { t } = useT();
  const router = useRouter();
  const [pending, start] = useTransition();
  const [favorite, setOptimistic] = useOptimistic(initial);

  return (
    <button
      type="button"
      aria-pressed={favorite}
      aria-label={favorite ? t.listing.saved : t.listing.save}
      disabled={pending}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        start(async () => {
          setOptimistic(!favorite);
          const res = await toggleFavorite(listingId);
          if (res.login) router.push(`/login?next=${encodeURIComponent(window.location.pathname)}`);
        });
      }}
      className={cn(
        variant === "overlay"
          ? "inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-ink-900 shadow-card backdrop-blur transition hover:scale-105"
          : "inline-flex h-10 items-center gap-2 rounded-xl border border-ink-200 bg-white px-3.5 text-sm font-semibold hover:bg-ink-50",
        className,
      )}
    >
      <Heart className={cn("h-4.5 w-4.5 transition", favorite ? "fill-rec text-rec" : "")} aria-hidden />
      {variant === "inline" ? <span>{favorite ? t.listing.saved : t.listing.save}</span> : null}
    </button>
  );
}
