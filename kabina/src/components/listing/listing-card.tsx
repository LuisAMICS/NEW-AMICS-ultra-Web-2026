import Link from "next/link";
import { Zap, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Rating } from "@/components/ui/rating";
import { FavoriteButton } from "./favorite-button";
import type { ListingSummary } from "@/lib/queries/listings";
import type { Dictionary, Locale } from "@/lib/i18n";
import { cn, formatMoney, tpl } from "@/lib/utils";

export function ListingCard({
  listing,
  t,
  locale,
  favorite = false,
  href,
  className,
  compact = false,
}: {
  listing: ListingSummary & { freeHours?: number };
  t: Dictionary;
  locale: Locale;
  favorite?: boolean;
  href?: string;
  className?: string;
  compact?: boolean;
}) {
  const url = href ?? `/studios/${listing.slug}`;
  return (
    <article className={cn("group relative flex flex-col", className)}>
      <Link href={url} className="block overflow-hidden rounded-2xl bg-ink-100">
        <div className="relative aspect-[4/3]">
          {listing.photo ? (
            <img src={listing.photo} alt={listing.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" loading="lazy" />
          ) : (
            <div className="h-full w-full bg-ink-200" />
          )}
          <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
            {listing.instantBook ? (
              <Badge tone="dark" className="bg-ink-950/85 backdrop-blur">
                <Zap className="h-3 w-3 fill-brand-400 text-brand-400" aria-hidden /> {t.common.instantBook}
              </Badge>
            ) : null}
            {listing.offPeakDiscount ? <Badge tone="brand">{tpl(t.listing.offPeakBadge, { pct: listing.offPeakDiscount })}</Badge> : null}
          </div>
        </div>
      </Link>
      <div className="absolute right-3 top-3">
        <FavoriteButton listingId={listing.id} initial={favorite} />
      </div>
      <div className="mt-3 flex flex-col gap-1">
        <div className="flex items-start justify-between gap-3">
          <Link href={url} className="line-clamp-1 font-semibold text-ink-950 hover:underline">
            {listing.title}
          </Link>
          <Rating value={listing.ratingAvg} count={listing.ratingCount} />
        </div>
        <p className="text-sm text-ink-500">
          {t.types[listing.type].short} · {listing.neighborhood ? `${listing.neighborhood}, ` : ""}
          {listing.city}
        </p>
        {!compact ? (
          <p className="flex items-center gap-3 text-xs text-ink-500">
            <span className="inline-flex items-center gap-1">
              <Users className="h-3.5 w-3.5" aria-hidden /> {tpl(t.common.capacity, { n: listing.capacity })}
            </span>
            <span>{tpl(t.common.minHours, { n: listing.minHours })}</span>
          </p>
        ) : null}
        <p className="mt-1 text-[15px]">
          <span className="font-bold text-ink-950">{formatMoney(listing.hourlyRate, listing.currency, locale, { compact: true })}</span>
          <span className="text-ink-500"> {t.common.perHour}</span>
          {listing.freeHours ? <span className="ml-2 text-xs font-semibold text-ok">· {listing.freeHours} {t.common.hoursShort} {locale === "es" ? "libres" : "free"}</span> : null}
        </p>
      </div>
    </article>
  );
}
