import type { Metadata } from "next";
import { getT } from "@/lib/i18n";
import { Faq } from "@/components/home/faq";
import { SITE } from "@/lib/constants";
import { tpl } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT();
  return { title: t.pages.help.title };
}

export default async function HelpPage() {
  const { t } = await getT();
  const p = t.pages.help;
  return (
    <div className="container-x max-w-4xl py-12 md:py-16">
      <h1 className="text-4xl font-bold md:text-5xl">{p.title}</h1>
      <p className="mt-4 text-lg text-ink-600">
        {tpl(p.intro, { email: "" })}
        <a href={`mailto:${SITE.supportEmail}`} className="font-semibold text-ink-950 underline-offset-4 hover:underline">
          {SITE.supportEmail}
        </a>
      </p>
      <div className="mt-10 space-y-10">
        {p.sections.map((s) => (
          <section key={s.title}>
            <h2 className="text-2xl font-bold">{s.title}</h2>
            <Faq items={s.faqs} className="mt-2 rounded-3xl border border-ink-100 bg-white px-6" />
          </section>
        ))}
      </div>
    </div>
  );
}
