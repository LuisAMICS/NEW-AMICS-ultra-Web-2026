import { Building2 } from "lucide-react";
import { getT } from "@/lib/i18n";
import { requireUser } from "@/lib/auth";
import { updateProfile } from "@/app/actions/profile";
import { becomeHost } from "@/app/actions/auth";
import { Button, ButtonLink } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { Avatar } from "@/components/ui/avatar";
import { formatDate, tpl } from "@/lib/utils";

export default async function ProfilePage(props: PageProps<"/account/profile">) {
  const sp = await props.searchParams;
  const user = await requireUser("/account/profile");
  const { t, locale } = await getT();
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <form action={updateProfile} className="space-y-5 rounded-3xl border border-ink-100 bg-white p-6">
        <div className="flex items-center gap-4">
          <Avatar name={user.name} src={user.avatarUrl} size="xl" />
          <div>
            <p className="text-lg font-bold">{user.name}</p>
            <p className="text-sm text-ink-500">{user.email}</p>
            <p className="text-xs text-ink-500">{tpl(t.account.memberSince, { date: formatDate(user.createdAt, locale) })}</p>
          </div>
        </div>
        {sp.saved === "1" ? <p className="rounded-xl bg-emerald-50 p-3 text-sm font-medium text-emerald-800">{t.account.profileSaved}</p> : null}
        {sp.error === "1" ? <p className="rounded-xl bg-red-50 p-3 text-sm text-rec">{t.common.genericError}</p> : null}
        <Field label={t.auth.name} htmlFor="name">
          <Input id="name" name="name" defaultValue={user.name} required minLength={2} />
        </Field>
        <Field label={t.account.bio} htmlFor="bio">
          <Textarea id="bio" name="bio" defaultValue={user.bio ?? ""} placeholder={t.account.bioPlaceholder} maxLength={600} />
        </Field>
        <Field label={t.account.avatarUrl} htmlFor="avatarUrl" hint={`(${t.common.optional})`}>
          <Input id="avatarUrl" name="avatarUrl" type="url" defaultValue={user.avatarUrl ?? ""} placeholder="https://…" />
        </Field>
        <Field label={t.common.language} htmlFor="locale">
          <Select id="locale" name="locale" defaultValue={locale}>
            <option value="es">{t.common.spanish}</option>
            <option value="en">{t.common.english}</option>
          </Select>
        </Field>
        <Button type="submit" variant="dark">
          {t.common.save}
        </Button>
      </form>
      <aside>
        {user.isHost ? (
          <div className="rounded-3xl bg-ink-950 p-6 text-white">
            <Building2 className="h-6 w-6 text-brand-300" aria-hidden />
            <p className="mt-3 font-bold">{t.nav.hostMode}</p>
            <ButtonLink href="/host" className="mt-4 w-full">
              {t.nav.hostDashboard}
            </ButtonLink>
          </div>
        ) : (
          <form action={becomeHost} className={`rounded-3xl p-6 ${sp.host === "1" ? "bg-brand-100 ring-2 ring-brand-400" : "bg-ink-950 text-white"}`}>
            <Building2 className={`h-6 w-6 ${sp.host === "1" ? "text-brand-700" : "text-brand-300"}`} aria-hidden />
            <p className="mt-3 text-lg font-bold">{t.account.becomeHostTitle}</p>
            <p className={`mt-1 text-sm ${sp.host === "1" ? "text-ink-700" : "text-ink-300"}`}>{t.account.becomeHostText}</p>
            <Button type="submit" className="mt-4 w-full" variant={sp.host === "1" ? "dark" : "primary"}>
              {t.account.becomeHostButton}
            </Button>
          </form>
        )}
      </aside>
    </div>
  );
}
