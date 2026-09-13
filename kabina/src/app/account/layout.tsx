import { requireUser } from "@/lib/auth";
import { getT } from "@/lib/i18n";
import { SubNav } from "@/components/sub-nav";

export default async function AccountLayout({ children }: LayoutProps<"/account">) {
  const [{ t }] = await Promise.all([getT(), requireUser("/account/bookings")]);
  return (
    <div className="container-x py-8 md:py-10">
      <h1 className="text-3xl font-bold">{t.account.title}</h1>
      <div className="mt-6">
        <SubNav
          items={[
            { href: "/account/bookings", label: t.account.bookingsTitle },
            { href: "/account/favorites", label: t.account.favoritesTitle },
            { href: "/account/messages", label: t.account.messagesTitle },
            { href: "/account/profile", label: t.account.profileTitle },
          ]}
        />
      </div>
      <div className="mt-8">{children}</div>
    </div>
  );
}
