import type { Metadata } from "next";
import { ArrowRight, Check } from "lucide-react";
import { getT } from "@/lib/i18n";
import { getCurrentUser } from "@/lib/auth";
import { ButtonLink } from "@/components/ui/button";
import { EarningsCalculator } from "@/components/home/earnings-calculator";
import { Faq } from "@/components/home/faq";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT();
  return { title: t.meta.forStudios, description: t.meta.forStudiosDescription };
}

export default async function ForStudiosPage() {
  const [{ t }, user] = await Promise.all([getT(), getCurrentUser()]);
  const p = t.pages.forStudios;
  const cta = user ? (user.isHost ? "/host/listings/new" : "/account/profile?host=1") : "/register?host=1";
  return (
    <>
      <section className="bg-ink-950 text-white">
        <div className="container-x grid items-center gap-12 py-16 md:py-24 lg:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-brand-300">{p.kicker}</p>
            <h1 className="mt-3 text-balance text-4xl font-bold md:text-6xl">{p.title}</h1>
            <p className="mt-5 text-lg text-ink-300">{p.subtitle}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href={cta} size="lg">
                {p.cta} <ArrowRight className="h-4 w-4" aria-hidden />
              </ButtonLink>
              <ButtonLink href="/how-it-works" size="lg" variant="light">
                {p.secondaryCta}
              </ButtonLink>
            </div>
          </div>
          <EarningsCalculator />
        </div>
      </section>
      <section className="container-x py-16 md:py-20">
        <h2 className="text-3xl font-bold md:text-4xl">{p.benefitsTitle}</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {p.benefits.map((b) => (
            <div key={b.title} className="rounded-3xl border border-ink-100 bg-white p-6 shadow-card">
              <Check className="h-5 w-5 text-brand-600" aria-hidden />
              <h3 className="mt-3 font-bold">{b.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-600">{b.text}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="bg-white py-16 md:py-20">
        <div className="container-x">
          <h2 className="text-3xl font-bold md:text-4xl">{p.stepsTitle}</h2>
          <ol className="mt-8 grid gap-4 md:grid-cols-4">
            {p.steps.map((s, i) => (
              <li key={s} className="rounded-3xl bg-paper p-6 ring-1 ring-ink-100">
                <span className="font-display text-4xl font-bold text-brand-400">0{i + 1}</span>
                <p className="mt-3 font-medium">{s}</p>
              </li>
            ))}
          </ol>
          <ButtonLink href={cta} size="lg" className="mt-10">
            {p.cta}
          </ButtonLink>
        </div>
      </section>
      <section id="faq" className="container-x grid gap-10 py-16 md:py-20 lg:grid-cols-[1fr_1.6fr]">
        <h2 className="text-3xl font-bold md:text-4xl">{p.faqTitle}</h2>
        <Faq items={p.faqs} />
      </section>
    </>
  );
}
