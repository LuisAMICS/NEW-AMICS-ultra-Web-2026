import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getT } from "@/lib/i18n";
import { getCurrentUser } from "@/lib/auth";
import { isDemoMode } from "@/db";
import { AuthShell } from "@/components/auth/auth-shell";
import { DemoButtons, LoginForm } from "@/components/auth/auth-forms";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT();
  return { title: t.nav.login };
}

export default async function LoginPage(props: PageProps<"/login">) {
  const sp = await props.searchParams;
  const next = typeof sp.next === "string" && sp.next.startsWith("/") ? sp.next : undefined;
  const [{ t }, user] = await Promise.all([getT(), getCurrentUser()]);
  if (user) redirect(next ?? (user.isHost ? "/host" : "/account/bookings"));
  return (
    <AuthShell title={t.auth.loginTitle} subtitle={t.auth.loginSubtitle}>
      <DemoButtons next={next} demo={isDemoMode} />
      <LoginForm next={next} />
    </AuthShell>
  );
}
