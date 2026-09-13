import Link from "next/link";
import { Logo } from "@/components/logo";
import { setLocale } from "@/app/actions/locale";
import type { Dictionary, Locale } from "@/lib/i18n";
import { tpl } from "@/lib/utils";

export function SiteFooter({ t, locale, demo }: { t: Dictionary; locale: Locale; demo: boolean }) {
  const columns = [
    {
      title: t.footer.explore,
      links: [
        { href: "/studios", label: t.footer.allStudios },
        { href: "/studios?type=recording", label: t.types.recording.label },
        { href: "/studios?type=rehearsal", label: t.types.rehearsal.label },
        { href: "/studios?type=podcast", label: t.types.podcast.label },
        { href: "/studios?type=voiceover", label: t.types.voiceover.label },
      ],
    },
    {
      title: t.footer.studios,
      links: [
        { href: "/for-studios", label: t.footer.listStudio },
        { href: "/for-studios#faq", label: t.footer.hostFaq },
        { href: "/host", label: t.nav.hostDashboard },
      ],
    },
    {
      title: t.footer.company,
      links: [
        { href: "/how-it-works", label: t.footer.about },
        { href: "/help", label: t.footer.help },
      ],
    },
    {
      title: t.footer.legal,
      links: [
        { href: "/terms", label: t.footer.terms },
        { href: "/privacy", label: t.footer.privacy },
      ],
    },
  ];
  return (
    <footer className="mt-16 border-t border-ink-100 bg-white">
      <div className="container-x grid gap-10 py-14 md:grid-cols-[1.4fr_repeat(4,1fr)]">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-600">{t.footer.tagline}</p>
          <form action={setLocale} className="mt-5 flex gap-2">
            <input type="hidden" name="back" value="/" />
            {(["es", "en"] as const).map((l) => (
              <button
                key={l}
                type="submit"
                name="locale"
                value={l}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${locale === l ? "border-ink-950 bg-ink-950 text-white" : "border-ink-200 text-ink-600 hover:border-ink-400"}`}
              >
                {l === "es" ? t.common.spanish : t.common.english}
              </button>
            ))}
          </form>
        </div>
        {columns.map((col) => (
          <div key={col.title}>
            <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-ink-500">{col.title}</h3>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((l) => (
                <li key={l.href + l.label}>
                  <Link href={l.href} className="text-sm text-ink-700 hover:text-ink-950">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-ink-100">
        <div className="container-x flex flex-col gap-2 py-5 text-xs text-ink-500 sm:flex-row sm:items-center sm:justify-between">
          <p>{tpl(t.footer.copyright, { year: new Date().getFullYear() })}</p>
          {demo ? <p className="inline-flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-rec" /> {t.footer.demo}</p> : null}
        </div>
      </div>
    </footer>
  );
}
