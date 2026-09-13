import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Mic2, Sliders, Drum, Podcast, AudioLines, Disc3, Radio, Quote, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { getT } from "@/lib/i18n";
import { getCurrentUser } from "@/lib/auth";
import { getCities, getFeaturedListings, getSiteStats } from "@/lib/queries/listings";
import { getFavoriteIds } from "@/lib/queries/favorites";
import { SearchBar } from "@/components/search-bar";
import { ListingCard } from "@/components/listing/listing-card";
import { EarningsCalculator } from "@/components/home/earnings-calculator";
import { Faq } from "@/components/home/faq";
import { ButtonLink } from "@/components/ui/button";
import { LISTING_TYPES, type ListingType } from "@/lib/constants";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT();
  return { title: { absolute: t.meta.home }, description: t.meta.homeDescription };
}

const TYPE_ICONS: Record<ListingType, typeof Mic2> = {
  recording: Mic2,
  mixing: Sliders,
  rehearsal: Drum,
  podcast: Podcast,
  voiceover: AudioLines,
  production: Disc3,
  live: Radio,
};

export default async function HomePage() {
  const [{ t, locale }, user, featured, cities, stats] = await Promise.all([getT(), getCurrentUser(), getFeaturedListings(8), getCities(), getSiteStats()]);
  const favorites = await getFavoriteIds(user?.id, featured.map((l) => l.id));
  const trustIcons = [ShieldCheck, Zap, Sparkles, Quote];

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-ink-950 text-white">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute -left-40 top-10 h-[520px] w-[520px] rounded-full bg-brand-500/25 blur-[140px]" />
          <div className="absolute -right-32 -top-20 h-[420px] w-[420px] rounded-full bg-rec/20 blur-[140px]" />
          <svg className="absolute inset-x-0 bottom-0 h-40 w-full opacity-[0.12]" viewBox="0 0 1200 160" preserveAspectRatio="none">
            <path d="M0 80 Q 25 20 50 80 T 100 80 T 150 80 T 200 80 T 250 80 T 300 80 T 350 80 T 400 80 T 450 80 T 500 80 T 550 80 T 600 80 T 650 80 T 700 80 T 750 80 T 800 80 T 850 80 T 900 80 T 950 80 T 1000 80 T 1050 80 T 1100 80 T 1150 80 T 1200 80" fill="none" stroke="#f7b32b" strokeWidth="2" />
          </svg>
        </div>
        <div className="container-x relative pb-20 pt-16 md:pb-28 md:pt-24">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-300">
            <span className="h-1.5 w-1.5 rounded-full bg-rec animate-pulse-soft" /> {t.home.heroKicker}
          </p>
          <h1 className="mt-6 max-w-3xl text-balance text-[44px] font-bold leading-[1.02] md:text-7xl">{t.home.heroTitle}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-300 md:text-xl">{t.home.heroSubtitle}</p>
          <div className="mt-10 max-w-4xl">
            <SearchBar cities={cities.map((c) => c.city)} />
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-ink-400">
            <span className="text-ink-300">{t.home.popularCities}:</span>
            {cities.slice(0, 6).map((c) => (
              <Link key={c.city} href={`/studios?q=${encodeURIComponent(c.city)}`} className="font-medium text-white/90 underline-offset-4 hover:underline">
                {c.city}
              </Link>
            ))}
          </div>
          <dl className="mt-12 grid max-w-xl grid-cols-3 gap-6 border-t border-white/10 pt-8">
            {[
              [stats.listings, t.home.statsStudios],
              [stats.cities, t.home.statsCities],
              [stats.sessions, t.home.statsSessions],
            ].map(([n, label]) => (
              <div key={String(label)}>
                <dt className="font-display text-3xl font-bold text-white md:text-4xl">{n}</dt>
                <dd className="mt-1 text-sm text-ink-400">{label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Categories */}
      <section className="container-x py-16 md:py-20">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold md:text-4xl">{t.home.categoriesTitle}</h2>
          <p className="mt-3 text-lg text-ink-600">{t.home.categoriesSubtitle}</p>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">
          {LISTING_TYPES.map((type) => {
            const Icon = TYPE_ICONS[type];
            return (
              <Link key={type} href={`/studios?type=${type}`} className="group rounded-2xl border border-ink-100 bg-white p-4 shadow-card transition hover:-translate-y-0.5 hover:border-ink-200 hover:shadow-float">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-ink-950 text-brand-300 transition group-hover:bg-brand-400 group-hover:text-ink-950">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <p className="mt-4 font-semibold">{t.types[type].short}</p>
                <p className="mt-1 line-clamp-2 text-xs text-ink-500">{t.types[type].description}</p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured */}
      <section className="container-x pb-16 md:pb-20">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold md:text-4xl">{t.home.featuredTitle}</h2>
            <p className="mt-3 text-lg text-ink-600">{t.home.featuredSubtitle}</p>
          </div>
          <Link href="/studios" className="hidden items-center gap-1 font-semibold text-ink-950 hover:underline sm:inline-flex">
            {t.common.seeAll} <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((l) => (
            <ListingCard key={l.id} listing={l} t={t} locale={locale} favorite={favorites.has(l.id)} />
          ))}
        </div>
        <div className="mt-8 sm:hidden">
          <ButtonLink href="/studios" variant="outline" className="w-full">
            {t.common.seeAll}
          </ButtonLink>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white py-16 md:py-24">
        <div className="container-x">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold md:text-4xl">{t.home.howTitle}</h2>
            <p className="mt-3 text-lg text-ink-600">{t.home.howSubtitle}</p>
          </div>
          <ol className="mt-10 grid gap-6 md:grid-cols-3">
            {t.home.howSteps.map((step, i) => (
              <li key={step.title} className="relative rounded-3xl bg-paper p-6 ring-1 ring-ink-100">
                <span className="font-display text-5xl font-bold text-brand-400">0{i + 1}</span>
                <h3 className="mt-4 text-xl font-bold">{step.title}</h3>
                <p className="mt-2 leading-relaxed text-ink-600">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Trust */}
      <section className="container-x py-16 md:py-24">
        <h2 className="text-3xl font-bold md:text-4xl">{t.home.trustTitle}</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {t.home.trustItems.map((item, i) => {
            const Icon = trustIcons[i] ?? ShieldCheck;
            return (
              <div key={item.title} className="rounded-3xl border border-ink-100 bg-white p-6 shadow-card">
                <Icon className="h-6 w-6 text-brand-600" aria-hidden />
                <h3 className="mt-4 font-bold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">{item.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Host section */}
      <section className="bg-ink-950 py-16 text-white md:py-24">
        <div className="container-x grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-brand-300">{t.nav.forStudios}</p>
            <h2 className="mt-3 text-balance text-3xl font-bold md:text-5xl">{t.home.hostTitle}</h2>
            <p className="mt-4 text-lg text-ink-300">{t.home.hostSubtitle}</p>
            <ul className="mt-8 space-y-3">
              {t.home.hostBullets.map((b) => (
                <li key={b} className="flex items-start gap-3 text-ink-100">
                  <span className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-400 text-ink-950">
                    <ArrowRight className="h-3 w-3" aria-hidden />
                  </span>
                  {b}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/for-studios" size="lg">
                {t.home.hostCta}
              </ButtonLink>
              <ButtonLink href="/how-it-works" size="lg" variant="light">
                {t.nav.howItWorks}
              </ButtonLink>
            </div>
          </div>
          <EarningsCalculator />
        </div>
      </section>

      {/* Testimonials */}
      <section className="container-x py-16 md:py-24">
        <h2 className="text-3xl font-bold md:text-4xl">{t.home.testimonialsTitle}</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {t.home.testimonials.map((item) => (
            <figure key={item.name} className="flex flex-col rounded-3xl bg-white p-6 shadow-card ring-1 ring-ink-100">
              <Quote className="h-6 w-6 text-brand-400" aria-hidden />
              <blockquote className="mt-4 flex-1 leading-relaxed text-ink-800">“{item.quote}”</blockquote>
              <figcaption className="mt-5 text-sm">
                <span className="font-semibold">{item.name}</span>
                <span className="text-ink-500"> · {item.role}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-16 md:py-24">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <div>
            <h2 className="text-3xl font-bold md:text-4xl">{t.home.faqTitle}</h2>
            <Link href="/help" className="mt-4 inline-flex items-center gap-1 font-semibold hover:underline">
              {t.nav.help} <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
          <Faq items={t.home.faqs} />
        </div>
      </section>

      {/* CTA */}
      <section className="container-x py-16 md:py-20">
        <div className="relative overflow-hidden rounded-[2rem] bg-brand-400 px-6 py-14 text-center text-ink-950 md:px-12 md:py-20">
          <div className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 rounded-full bg-white/30 blur-3xl" aria-hidden />
          <h2 className="text-balance text-3xl font-bold md:text-5xl">{t.home.ctaTitle}</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-ink-800">{t.home.ctaText}</p>
          <ButtonLink href="/studios" variant="dark" size="lg" className="mt-8">
            {t.home.ctaButton} <ArrowRight className="h-4 w-4" aria-hidden />
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
