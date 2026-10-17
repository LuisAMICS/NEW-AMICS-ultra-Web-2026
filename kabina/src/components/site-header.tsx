"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, Search, Globe, ChevronDown, LogOut, CalendarDays, Heart, MessageSquare, User, LayoutDashboard, Plus } from "lucide-react";
import { Logo } from "@/components/logo";
import { Avatar } from "@/components/ui/avatar";
import { buttonClasses } from "@/components/ui/button";
import { useT } from "@/lib/i18n/client";
import { setLocale } from "@/app/actions/locale";
import { logout } from "@/app/actions/auth";
import { cn } from "@/lib/utils";

export type HeaderUser = { id: string; name: string; avatarUrl: string | null; isHost: boolean } | null;

export function SiteHeader({ user }: { user: HeaderUser }) {
  const { t, locale } = useT();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const isHostArea = pathname.startsWith("/host");

  // Close any open menu when the route changes (state adjustment during render, no effect needed).
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
    setMenu(false);
  }

  const nav = [
    { href: "/studios", label: t.nav.explore },
    { href: "/how-it-works", label: t.nav.howItWorks },
    { href: "/for-studios", label: t.nav.forStudios },
  ];

  const accountLinks = [
    { href: "/account/bookings", label: t.nav.myBookings, icon: CalendarDays },
    { href: "/account/favorites", label: t.nav.favorites, icon: Heart },
    { href: "/account/messages", label: t.nav.messages, icon: MessageSquare },
    { href: "/account/profile", label: t.nav.profile, icon: User },
  ];

  const otherLocale = locale === "es" ? "en" : "es";

  return (
    <header className="sticky top-0 z-40 border-b border-ink-100 bg-paper/90 backdrop-blur supports-[backdrop-filter]:bg-paper/75">
      <div className="container-x flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <Logo />
          <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn("rounded-lg px-3 py-2 text-sm font-medium text-ink-700 transition hover:bg-ink-100 hover:text-ink-950", pathname.startsWith(item.href) && "text-ink-950")}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/studios" className="hidden h-10 items-center gap-2 rounded-full border border-ink-200 bg-white px-4 text-sm font-medium text-ink-700 shadow-card transition hover:border-ink-300 sm:inline-flex" aria-label={t.common.search}>
            <Search className="h-4 w-4" aria-hidden />
            <span>{t.common.search}</span>
          </Link>

          <form action={setLocale} className="hidden sm:block">
            <input type="hidden" name="locale" value={otherLocale} />
            <input type="hidden" name="back" value={pathname} />
            <button type="submit" className="inline-flex h-10 items-center gap-1.5 rounded-full px-3 text-sm font-medium text-ink-700 hover:bg-ink-100" aria-label={t.common.language}>
              <Globe className="h-4 w-4" aria-hidden />
              {otherLocale.toUpperCase()}
            </button>
          </form>

          {user ? (
            <div className="relative hidden md:block">
              <button type="button" onClick={() => setMenu((m) => !m)} className="flex h-10 items-center gap-2 rounded-full border border-ink-200 bg-white pl-1 pr-3 shadow-card hover:border-ink-300" aria-haspopup="menu" aria-expanded={menu}>
                <Avatar name={user.name} src={user.avatarUrl} size="sm" />
                <span className="max-w-28 truncate text-sm font-medium">{user.name.split(" ")[0]}</span>
                <ChevronDown className="h-4 w-4 text-ink-500" aria-hidden />
              </button>
              {menu ? (
                <div role="menu" className="absolute right-0 mt-2 w-64 overflow-hidden rounded-2xl border border-ink-100 bg-white p-2 shadow-float">
                  {user.isHost ? (
                    <Link href="/host" className={cn("flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold hover:bg-ink-50", isHostArea && "bg-ink-50")}>
                      <LayoutDashboard className="h-4 w-4" aria-hidden /> {t.nav.hostDashboard}
                    </Link>
                  ) : (
                    <Link href="/account/profile?host=1" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold hover:bg-ink-50">
                      <Plus className="h-4 w-4" aria-hidden /> {t.nav.listYourStudio}
                    </Link>
                  )}
                  <div className="my-1 border-t border-ink-100" />
                  {accountLinks.map((l) => (
                    <Link key={l.href} href={l.href} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm hover:bg-ink-50">
                      <l.icon className="h-4 w-4 text-ink-500" aria-hidden /> {l.label}
                    </Link>
                  ))}
                  <div className="my-1 border-t border-ink-100" />
                  <form action={logout}>
                    <button type="submit" className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm hover:bg-ink-50">
                      <LogOut className="h-4 w-4 text-ink-500" aria-hidden /> {t.nav.logout}
                    </button>
                  </form>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <Link href="/login" className={buttonClasses("ghost", "sm")}>
                {t.nav.login}
              </Link>
              <Link href="/register" className={buttonClasses("dark", "sm")}>
                {t.nav.register}
              </Link>
            </div>
          )}

          <button type="button" className="inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-ink-100 md:hidden" onClick={() => setOpen(true)} aria-label={t.nav.menu}>
            <Menu className="h-5 w-5" aria-hidden />
          </button>
        </div>
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-ink-950/40" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 right-0 flex w-[88%] max-w-sm flex-col bg-paper shadow-float">
            <div className="flex h-16 items-center justify-between px-4">
              <Logo />
              <button type="button" className="inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-ink-100" onClick={() => setOpen(false)} aria-label={t.common.close}>
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-4 pb-6">
              {user ? (
                <div className="mb-4 flex items-center gap-3 rounded-2xl bg-white p-3 shadow-card">
                  <Avatar name={user.name} src={user.avatarUrl} />
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{user.name}</p>
                    <p className="text-xs text-ink-500">{user.isHost ? t.nav.hostMode : t.nav.guestMode}</p>
                  </div>
                </div>
              ) : null}
              <nav className="flex flex-col">
                {nav.map((item) => (
                  <Link key={item.href} href={item.href} className="rounded-xl px-3 py-3 text-base font-medium hover:bg-ink-100">
                    {item.label}
                  </Link>
                ))}
                <Link href="/help" className="rounded-xl px-3 py-3 text-base font-medium hover:bg-ink-100">
                  {t.nav.help}
                </Link>
              </nav>
              <div className="my-3 border-t border-ink-100" />
              {user ? (
                <nav className="flex flex-col">
                  {user.isHost ? (
                    <Link href="/host" className="flex items-center gap-3 rounded-xl px-3 py-3 text-base font-semibold hover:bg-ink-100">
                      <LayoutDashboard className="h-5 w-5" aria-hidden /> {t.nav.hostDashboard}
                    </Link>
                  ) : (
                    <Link href="/account/profile?host=1" className="flex items-center gap-3 rounded-xl px-3 py-3 text-base font-semibold hover:bg-ink-100">
                      <Plus className="h-5 w-5" aria-hidden /> {t.nav.listYourStudio}
                    </Link>
                  )}
                  {accountLinks.map((l) => (
                    <Link key={l.href} href={l.href} className="flex items-center gap-3 rounded-xl px-3 py-3 text-base hover:bg-ink-100">
                      <l.icon className="h-5 w-5 text-ink-500" aria-hidden /> {l.label}
                    </Link>
                  ))}
                  <form action={logout}>
                    <button type="submit" className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-base hover:bg-ink-100">
                      <LogOut className="h-5 w-5 text-ink-500" aria-hidden /> {t.nav.logout}
                    </button>
                  </form>
                </nav>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link href="/register" className={buttonClasses("dark", "lg")}>
                    {t.nav.register}
                  </Link>
                  <Link href="/login" className={buttonClasses("outline", "lg")}>
                    {t.nav.login}
                  </Link>
                </div>
              )}
              <div className="my-3 border-t border-ink-100" />
              <form action={setLocale} className="px-1">
                <input type="hidden" name="locale" value={otherLocale} />
                <input type="hidden" name="back" value={pathname} />
                <button type="submit" className="inline-flex items-center gap-2 rounded-xl px-2 py-2 text-sm font-medium text-ink-700 hover:bg-ink-100">
                  <Globe className="h-4 w-4" aria-hidden />
                  {otherLocale === "en" ? t.common.english : t.common.spanish}
                </button>
              </form>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
