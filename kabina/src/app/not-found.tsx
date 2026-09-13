import { ButtonLink } from "@/components/ui/button";
import { getT } from "@/lib/i18n";

export default async function NotFound() {
  const { t } = await getT();
  return (
    <div className="container-x flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="font-display text-7xl font-bold text-ink-200">404</p>
      <h1 className="mt-4 text-3xl font-bold">{t.common.notFoundTitle}</h1>
      <p className="mt-2 max-w-md text-ink-600">{t.common.notFoundText}</p>
      <ButtonLink href="/" variant="dark" className="mt-8">
        {t.common.goHome}
      </ButtonLink>
    </div>
  );
}
