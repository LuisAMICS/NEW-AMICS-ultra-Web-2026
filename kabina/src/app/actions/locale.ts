"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { LOCALE_COOKIE } from "@/lib/constants";
import { isLocale } from "@/lib/i18n/types";

export async function setLocale(formData: FormData) {
  const locale = formData.get("locale");
  const back = String(formData.get("back") ?? "/");
  if (isLocale(locale)) {
    const store = await cookies();
    store.set(LOCALE_COOKIE, locale, { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
  }
  redirect(back.startsWith("/") ? back : "/");
}
