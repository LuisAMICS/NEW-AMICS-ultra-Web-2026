import type { Metadata } from "next";
import { getT } from "@/lib/i18n";
import { LegalPage } from "@/components/legal-page";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT();
  return { title: t.pages.privacy.title };
}

export default async function PrivacyPage() {
  const { t } = await getT();
  return <LegalPage title={t.pages.privacy.title} updated={t.pages.privacy.updated} sections={t.pages.privacy.sections} />;
}
