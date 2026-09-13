import type { Metadata } from "next";
import { ArrowRight, Mic2, Building2 } from "lucide-react";
import { getT } from "@/lib/i18n";
import { ButtonLink } from "@/components/ui/button";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT();
  return { title: t.pages.howItWorks.title };
}

export default async function HowItWorksPage() {
  const { t } = await getT();
  const p = t.pages.howItWorks;
  return (
    <div className="container-x py-12 md:py-16">
      <div className="max-w-3xl">
        <h1 className="text-balance text-4xl font-bold md:text-5xl">{p.title}</h1>
        <p className="mt-4 text-lg text-ink-600">{p.intro}</p>
      </div>
      <div className="mt-12 grid gap-8 lg:grid-cols-2">
        {[
          { title: p.artistsTitle, items: p.artists, Icon: Mic2 },
          { title: p.studiosTitle, items: p.studios, Icon: Building2 },
        ].map(({ title, items, Icon }) => (
          <section key={title} className="rounded-3xl border border-ink-100 bg-white p-6 md:p-8">
            <h2 className="flex items-center gap-2 text-2xl font-bold">
              <Icon className="h-6 w-6 text-brand-600" aria-hidden /> {title}
            </h2>
            <ol className="mt-6 space-y-5">
              {items.map((item, i) => (
                <li key={item.title} className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink-950 font-display text-sm font-bold text-brand-300">{i + 1}</span>
                  <div>
                    <h3 className="font-bold">{item.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-ink-600">{item.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>
      <section className="mt-10 rounded-3xl bg-ink-950 p-8 text-white md:p-10">
        <h2 className="text-2xl font-bold">{p.feesTitle}</h2>
        <p className="mt-3 max-w-3xl leading-relaxed text-ink-300">{p.feesText}</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:max-w-2xl">
          <div className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10">
            <p className="font-display text-4xl font-bold text-brand-300">0 %</p>
            <p className="mt-1 text-sm text-ink-300">{t.booking.guest}</p>
          </div>
          <div className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10">
            <p className="font-display text-4xl font-bold text-brand-300">12 %</p>
            <p className="mt-1 text-sm text-ink-300">{t.booking.studio}</p>
          </div>
        </div>
        <ButtonLink href="/studios" className="mt-8">
          {p.cta} <ArrowRight className="h-4 w-4" aria-hidden />
        </ButtonLink>
      </section>
    </div>
  );
}
