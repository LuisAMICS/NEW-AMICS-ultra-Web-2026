import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Tone = "neutral" | "brand" | "dark" | "ok" | "rec" | "info" | "outline";

const tones: Record<Tone, string> = {
  neutral: "bg-ink-100 text-ink-800",
  brand: "bg-brand-100 text-brand-800",
  dark: "bg-ink-950 text-white",
  ok: "bg-emerald-50 text-emerald-800",
  rec: "bg-red-50 text-rec",
  info: "bg-blue-50 text-blue-800",
  outline: "border border-ink-200 text-ink-700 bg-white",
};

export function Badge({ children, tone = "neutral", className }: { children: ReactNode; tone?: Tone; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold leading-none", tones[tone], className)}>
      {children}
    </span>
  );
}
