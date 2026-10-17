import Link from "next/link";
import { Plus, Pencil, Eye, Pause, Play, Trash2 } from "lucide-react";
import { getT } from "@/lib/i18n";
import { requireHost } from "@/lib/auth";
import { getHostListings } from "@/lib/queries/host";
import { Badge } from "@/components/ui/badge";
import { Rating } from "@/components/ui/rating";
import { Button, ButtonLink, buttonClasses } from "@/components/ui/button";
import { deleteListing, setListingStatus } from "@/app/actions/listings";
import { DeleteListingButton } from "@/components/host/delete-listing-button";
import { formatMoney } from "@/lib/utils";

export default async function HostListingsPage(props: PageProps<"/host/listings">) {
  const sp = await props.searchParams;
  const user = await requireHost("/host/listings");
  const [{ t, locale }, listings] = await Promise.all([getT(), getHostListings(user.id)]);
  const tone = { published: "ok", draft: "neutral", paused: "brand" } as const;
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">{t.host.listingsTitle}</h1>
        <ButtonLink href="/host/listings/new">
          <Plus className="h-4 w-4" aria-hidden /> {t.host.newListing}
        </ButtonLink>
      </div>
      {sp.saved === "1" ? <p className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm font-medium text-emerald-800">{t.host.wizard.saved}</p> : null}
      {listings.length === 0 ? (
        <div className="mt-8 rounded-3xl border border-dashed border-ink-200 bg-white p-10 text-center">
          <h2 className="text-xl font-bold">{t.host.noListings}</h2>
          <p className="mt-2 text-ink-600">{t.host.noListingsText}</p>
          <ButtonLink href="/host/listings/new" className="mt-6">
            {t.host.newListing}
          </ButtonLink>
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {listings.map((l) => (
            <li key={l.id} className="flex flex-col gap-4 rounded-2xl border border-ink-100 bg-white p-4 shadow-card md:flex-row md:items-center">
              {l.photos[0] ? <img src={l.photos[0].url} alt="" className="h-20 w-28 shrink-0 rounded-xl object-cover" /> : <div className="h-20 w-28 shrink-0 rounded-xl bg-ink-100" />}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone={tone[l.status]}>{t.host.wizard[l.status]}</Badge>
                  <span className="text-xs text-ink-500">{t.types[l.type].label}</span>
                </div>
                <p className="mt-1 truncate font-semibold">{l.title}</p>
                <p className="text-sm text-ink-600">
                  {l.city} · {formatMoney(l.hourlyRate, l.currency, locale, { compact: true })} {t.common.perHour} · <Rating value={l.ratingAvg} count={l.ratingCount} /> {l.ratingCount === 0 ? t.common.noReviewsYet : ""}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link href={`/host/listings/${l.id}`} className={buttonClasses("outline", "sm")}>
                  <Pencil className="h-4 w-4" aria-hidden /> {t.common.edit}
                </Link>
                <Link href={`/studios/${l.slug}`} className={buttonClasses("ghost", "sm")}>
                  <Eye className="h-4 w-4" aria-hidden /> {t.host.wizard.preview}
                </Link>
                <form action={setListingStatus}>
                  <input type="hidden" name="id" value={l.id} />
                  <input type="hidden" name="status" value={l.status === "published" ? "paused" : "published"} />
                  <Button type="submit" variant="ghost" size="sm">
                    {l.status === "published" ? <Pause className="h-4 w-4" aria-hidden /> : <Play className="h-4 w-4" aria-hidden />}
                    {l.status === "published" ? t.host.wizard.unpublish : t.host.wizard.republish}
                  </Button>
                </form>
                <form action={deleteListing}>
                  <input type="hidden" name="id" value={l.id} />
                  <DeleteListingButton confirmText={t.host.wizard.deleteConfirm}>
                    <Trash2 className="h-4 w-4" aria-hidden />
                  </DeleteListingButton>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
