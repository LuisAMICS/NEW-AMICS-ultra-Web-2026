import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getT } from "@/lib/i18n";
import { getCurrentUser } from "@/lib/auth";
import { isDemoMode } from "@/db";
import { AuthShell } from "@/components/auth/auth-shell";
import { DemoButtons, RegisterForm } from "@/components/auth/auth-forms";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT();
  return { title: t.nav.register };
}

export default async function RegisterPage(props: PageProps<"/register">) {
  const sp = await props.searchParams;
  const next = typeof sp.next === "string" && sp.next.startsWith("/") ? sp.next : undefined;
  const [{ t }, user] = await Promise.all([getT(), getCurrentUser()]);
  if (user) redirect(next ?? "/account/bookings");
  return (
    <AuthShell title={t.auth.registerTitle} subtitle={t.auth.registerSubtitle}>
      <RegisterForm next={next} host={sp.host === "1"} />
      <DemoButtons next={next} demo={isDemoMode} />
    </AuthShell>
  );
}
