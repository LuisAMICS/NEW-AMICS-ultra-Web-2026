"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Mic2, Building2 } from "lucide-react";
import { login, loginDemo, register, type AuthState } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Checkbox, Field, Input } from "@/components/ui/field";
import { useT } from "@/lib/i18n/client";

export function DemoButtons({ next, demo }: { next?: string; demo: boolean }) {
  const { t } = useT();
  if (!demo) return null;
  return (
    <div className="rounded-2xl border border-dashed border-brand-400 bg-brand-50 p-4">
      <p className="text-sm font-semibold text-ink-900">{t.auth.demoTitle}</p>
      <form action={loginDemo} className="mt-3 grid grid-cols-2 gap-2">
        {next ? <input type="hidden" name="next" value={next} /> : null}
        <Button type="submit" name="role" value="guest" variant="outline" size="sm">
          <Mic2 className="h-4 w-4" aria-hidden /> {t.auth.demoGuest}
        </Button>
        <Button type="submit" name="role" value="host" variant="outline" size="sm">
          <Building2 className="h-4 w-4" aria-hidden /> {t.auth.demoHost}
        </Button>
      </form>
    </div>
  );
}

export function LoginForm({ next }: { next?: string }) {
  const { t } = useT();
  const [state, action, pending] = useActionState<AuthState, FormData>(login, null);
  return (
    <form action={action} className="space-y-4">
      {next ? <input type="hidden" name="next" value={next} /> : null}
      <Field label={t.auth.email} htmlFor="email">
        <Input id="email" name="email" type="email" autoComplete="email" required />
      </Field>
      <Field label={t.auth.password} htmlFor="password">
        <Input id="password" name="password" type="password" autoComplete="current-password" required />
      </Field>
      {state?.error ? (
        <p className="rounded-xl bg-red-50 p-3 text-sm text-rec" role="alert">
          {state.error}
        </p>
      ) : null}
      <Button type="submit" size="lg" className="w-full" loading={pending}>
        {t.auth.loginButton}
      </Button>
      <p className="text-center text-sm text-ink-600">
        {t.auth.noAccount}{" "}
        <Link href={`/register${next ? `?next=${encodeURIComponent(next)}` : ""}`} className="font-semibold text-ink-950 underline-offset-4 hover:underline">
          {t.nav.register}
        </Link>
      </p>
    </form>
  );
}

export function RegisterForm({ next, host }: { next?: string; host?: boolean }) {
  const { t } = useT();
  const [state, action, pending] = useActionState<AuthState, FormData>(register, null);
  return (
    <form action={action} className="space-y-4">
      {next ? <input type="hidden" name="next" value={next} /> : null}
      <Field label={t.auth.name} htmlFor="name" error={state?.fieldErrors?.name}>
        <Input id="name" name="name" autoComplete="name" required />
      </Field>
      <Field label={t.auth.email} htmlFor="email" error={state?.fieldErrors?.email}>
        <Input id="email" name="email" type="email" autoComplete="email" required />
      </Field>
      <Field label={t.auth.password} htmlFor="password" hint={`(${t.auth.passwordHint})`} error={state?.fieldErrors?.password}>
        <Input id="password" name="password" type="password" autoComplete="new-password" minLength={8} required />
      </Field>
      <Checkbox name="host" value="1" defaultChecked={host} label={t.auth.iAmHost} />
      <Button type="submit" size="lg" className="w-full" loading={pending}>
        {t.auth.registerButton}
      </Button>
      <p className="text-center text-xs text-ink-500">{t.auth.terms}</p>
      <p className="text-center text-sm text-ink-600">
        {t.auth.haveAccount}{" "}
        <Link href={`/login${next ? `?next=${encodeURIComponent(next)}` : ""}`} className="font-semibold text-ink-950 underline-offset-4 hover:underline">
          {t.nav.login}
        </Link>
      </p>
    </form>
  );
}
