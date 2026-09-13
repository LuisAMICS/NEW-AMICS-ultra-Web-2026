import { getT } from "@/lib/i18n";
import { requireUser } from "@/lib/auth";
import { getFavoriteListings } from "@/lib/queries/favorites";
import { ListingCard } from "@/components/listing/listing-card";
import { ButtonLink } from "@/components/ui/button";

export default async function FavoritesPage() {
  const user = await requireUser("/account/favorites");
  const [{ t, locale }, listings] = await Promise.all([getT(), getFavoriteListings(user.id)]);
  if (!listings.length) {
    return (
      <div className="rounded-3xl border border-dashed border-ink-200 bg-white p-10 text-center">
        <h2 className="text-xl font-bold">{t.account.noFavorites}</h2>
        <ButtonLink href="/studios" className="mt-6">
          {t.account.exploreCta}
        </ButtonLink>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
      {listings.map((l) => (
        <ListingCard key={l.id} listing={{ ...l, photo: l.photos[0]?.url ?? null }} t={t} locale={locale} favorite />
      ))}
    </div>
  );
}
