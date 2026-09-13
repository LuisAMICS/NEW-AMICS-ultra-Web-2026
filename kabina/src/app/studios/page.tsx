import type { Metadata } from "next";
import { Suspense } from "react";
import { getT } from "@/lib/i18n";
import { getCurrentUser } from "@/lib/auth";
import { getCities, parseSearchParams, searchListings } from "@/lib/queries/listings";
import { getFavoriteIds } from "@/lib/queries/favorites";
import { SearchBar } from "@/components/search-bar";
import { SearchFilters } from "@/components/search/search-filters";
import { SearchResults } from "@/components/search/search-results";
import { ListingCard } from "@/components/listing/listing-card";
import { ButtonLink } from "@/components/ui/button";
import { formatDate, tpl } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT();
  return { title: t.meta.search, description: t.meta.searchDescription };
}

export default async function StudiosPage(props: PageProps<"/studios">) {
  const raw = await props.searchParams;
  const params = parseSearchParams(raw);
  const [{ t, locale }, user, results, cities] = await Promise.all([getT(), getCurrentUser(), searchListings(params), getCities()]);
  const favorites = await getFavoriteIds(user?.id, results.map((l) => l.id));

  const cityMatch = params.q ? cities.find((c) => c.city.toLowerCase() === params.q!.toLowerCase()) : undefined;
  const title = params.type && cityMatch ? tpl(t.search.titleType, { type: t.types[params.type].label, city: cityMatch.city }) : cityMatch ? tpl(t.search.titleCity, { city: cityMatch.city }) : params.type ? t.types[params.type].label : t.search.titleAll;

  const points = results.filter((l) => l.lat !== null && l.lng !== null).map((l) => ({ id: l.id, slug: l.slug, title: l.title, lat: l.lat!, lng: l.lng!, hourlyRate: l.hourlyRate, currency: l.currency, photo: l.photo }));

  return (
    <div className="container-x py-6 md:py-8">
      <SearchBar cities={cities.map((c) => c.city)} defaults={{ q: params.q, date: params.date, type: params.type }} variant="compact" />
      <div className="mt-6 flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="text-2xl font-bold md:text-3xl">{title}</h1>
        {params.date ? <p className="text-sm font-medium text-ok">{tpl(t.search.availableOn, { date: formatDate(params.date, locale, "weekday") })}</p> : null}
      </div>
      <div className="mt-4">
        <Suspense>
          <SearchFilters resultCount={results.length} />
        </Suspense>
      </div>
      <SearchResults
        points={points}
        cards={results.map((l) => (
          <ListingCard key={l.id} listing={l} t={t} locale={locale} favorite={favorites.has(l.id)} />
        ))}
        empty={
          results.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-ink-200 bg-white p-10 text-center">
              <h2 className="text-xl font-bold">{t.search.emptyTitle}</h2>
              <p className="mt-2 text-ink-600">{t.search.emptyText}</p>
              <ButtonLink href="/studios" variant="outline" className="mt-6">
                {t.search.clearFilters}
              </ButtonLink>
            </div>
          ) : null
        }
      />
    </div>
  );
}
