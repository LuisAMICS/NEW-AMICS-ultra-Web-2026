import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter";
import "@fontsource-variable/bricolage-grotesque/opsz.css";
import "./globals.css";
import { LocaleProvider } from "@/lib/i18n/client";
import { getT } from "@/lib/i18n";
import { getCurrentUser } from "@/lib/auth";
import { isDemoMode } from "@/db";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { DemoBanner } from "@/components/demo-banner";
import { SITE } from "@/lib/constants";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT();
  return {
    metadataBase: new URL(SITE.url),
    title: { default: t.meta.home, template: `%s · ${SITE.name}` },
    description: t.meta.homeDescription,
    openGraph: { siteName: SITE.name, type: "website" },
    twitter: { card: "summary_large_image" },
  };
}

export const viewport: Viewport = { themeColor: "#0f0e0c", width: "device-width", initialScale: 1 };

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const [{ t, locale }, user] = await Promise.all([getT(), getCurrentUser()]);
  return (
    <html lang={locale} className="h-full">
      <body className="flex min-h-full flex-col">
        <LocaleProvider t={t} locale={locale}>
          {isDemoMode ? <DemoBanner t={t} /> : null}
          <SiteHeader user={user ? { id: user.id, name: user.name, avatarUrl: user.avatarUrl, isHost: user.isHost } : null} />
          <main className="flex-1">{children}</main>
          <SiteFooter t={t} locale={locale} demo={isDemoMode} />
        </LocaleProvider>
      </body>
    </html>
  );
}
