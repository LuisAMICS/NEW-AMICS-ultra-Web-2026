import { Avatar } from "@/components/ui/avatar";
import { Stars } from "@/components/ui/rating";
import type { Dictionary, Locale } from "@/lib/i18n";
import { formatDate } from "@/lib/utils";
import type { Review } from "@/db/schema";

export type ReviewWithAuthor = Review & { author: { id: string; name: string; avatarUrl: string | null } };

export function ReviewsSection({ reviews, ratingAvg, t, locale }: { reviews: ReviewWithAuthor[]; ratingAvg: number; t: Dictionary; locale: Locale }) {
  if (!reviews.length) {
    return (
      <section>
        <h2 className="text-xl font-bold">{t.listing.reviewsTitle}</h2>
        <p className="mt-2 text-ink-500">{t.common.noReviewsYet}</p>
      </section>
    );
  }
  const avg = (key: keyof Pick<Review, "ratingSound" | "ratingEquipment" | "ratingHost" | "ratingValue">) => reviews.reduce((s, r) => s + r[key], 0) / reviews.length;
  const subs: [string, number][] = [
    [t.listing.subratings.sound, avg("ratingSound")],
    [t.listing.subratings.equipment, avg("ratingEquipment")],
    [t.listing.subratings.host, avg("ratingHost")],
    [t.listing.subratings.value, avg("ratingValue")],
  ];
  return (
    <section>
      <h2 className="flex items-center gap-2 text-xl font-bold">
        {t.listing.reviewsTitle}
        <span className="text-ink-500">· ★ {ratingAvg.toFixed(1)} ({reviews.length})</span>
      </h2>
      <dl className="mt-4 grid grid-cols-2 gap-x-8 gap-y-3 sm:grid-cols-4">
        {subs.map(([label, value]) => (
          <div key={label}>
            <dt className="text-xs font-semibold uppercase tracking-wide text-ink-500">{label}</dt>
            <dd className="mt-1 flex items-center gap-2">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink-100">
                <div className="h-full rounded-full bg-ink-950" style={{ width: `${(value / 5) * 100}%` }} />
              </div>
              <span className="text-sm font-semibold">{value.toFixed(1)}</span>
            </dd>
          </div>
        ))}
      </dl>
      <ul className="mt-8 grid gap-6 md:grid-cols-2">
        {reviews.map((r) => (
          <li key={r.id} className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <Avatar name={r.author.name} src={r.author.avatarUrl} />
              <div>
                <p className="font-semibold leading-tight">{r.author.name}</p>
                <p className="text-xs text-ink-500">{formatDate(r.createdAt, locale)}</p>
              </div>
              <Stars value={r.rating} className="ml-auto" />
            </div>
            <p className="leading-relaxed text-ink-800">{r.comment}</p>
            {r.hostReply ? (
              <div className="rounded-2xl bg-ink-50 p-3 text-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">{t.listing.hostReply}</p>
                <p className="mt-1 text-ink-700">{r.hostReply}</p>
              </div>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
