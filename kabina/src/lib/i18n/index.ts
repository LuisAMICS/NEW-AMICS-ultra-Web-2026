import "server-only";
import { cache } from "react";
import { cookies, headers } from "next/headers";
import { es } from "./es";
import { en } from "./en";
import { DEFAULT_LOCALE, isLocale, type Locale } from "./types";
import { LOCALE_COOKIE } from "@/lib/constants";

export type { Dictionary } from "./es";
export type { Locale } from "./types";

export const dictionaries = { es, en } as const;

export const getLocale = cache(async (): Promise<Locale> => {
  const store = await cookies();
  const fromCookie = store.get(LOCALE_COOKIE)?.value;
  if (isLocale(fromCookie)) return fromCookie;
  const accept = (await headers()).get("accept-language") ?? "";
  const first = accept.split(",")[0]?.trim().toLowerCase() ?? "";
  if (first.startsWith("en")) return "en";
  return DEFAULT_LOCALE;
});

export async function getT() {
  const locale = await getLocale();
  return { t: dictionaries[locale], locale };
}
