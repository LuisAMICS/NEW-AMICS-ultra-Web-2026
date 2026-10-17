import type { Metadata } from "next";
import { getT } from "@/lib/i18n";
import { LegalPage } from "@/components/legal-page";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT();
  return { title: t.pages.terms.title };
}

export default async function TermsPage() {
  const { t } = await getT();
  return <LegalPage title={t.pages.terms.title} updated={t.pages.terms.updated} sections={t.pages.terms.sections} />;
}
