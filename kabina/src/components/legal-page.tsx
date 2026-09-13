import { SITE } from "@/lib/constants";
import { tpl } from "@/lib/utils";

export function LegalPage({ title, updated, sections }: { title: string; updated: string; sections: { title: string; text: string }[] }) {
  return (
    <div className="container-x max-w-3xl py-12 md:py-16">
      <h1 className="text-4xl font-bold">{title}</h1>
      <p className="mt-2 text-sm text-ink-500">{updated}</p>
      <div className="mt-10 space-y-8">
        {sections.map((s) => (
          <section key={s.title}>
            <h2 className="text-xl font-bold">{s.title}</h2>
            <p className="mt-2 leading-relaxed text-ink-700">{tpl(s.text, { email: SITE.supportEmail })}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
