"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { Dictionary } from "./es";
import type { Locale } from "./types";

const LocaleContext = createContext<{ t: Dictionary; locale: Locale } | null>(null);

export function LocaleProvider({ t, locale, children }: { t: Dictionary; locale: Locale; children: ReactNode }) {
  return <LocaleContext.Provider value={{ t, locale }}>{children}</LocaleContext.Provider>;
}

export function useT() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useT must be used inside LocaleProvider");
  return ctx;
}
