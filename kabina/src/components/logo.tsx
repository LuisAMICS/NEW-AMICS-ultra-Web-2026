import Link from "next/link";
import { cn } from "@/lib/utils";

export function LogoMark({ className, dark = false }: { className?: string; dark?: boolean }) {
  return (
    <svg viewBox="0 0 40 40" className={cn("h-8 w-8", className)} aria-hidden>
      <rect x="2" y="2" width="36" height="36" rx="11" fill={dark ? "#f7b32b" : "#0f0e0c"} />
      <rect x="11" y="18" width="4" height="10" rx="2" fill={dark ? "#0f0e0c" : "#f7b32b"} />
      <rect x="18" y="11" width="4" height="17" rx="2" fill={dark ? "#0f0e0c" : "#f7b32b"} />
      <rect x="25" y="15" width="4" height="13" rx="2" fill={dark ? "#0f0e0c" : "#f7b32b"} />
      <circle cx="30.5" cy="9.5" r="2.5" fill="#e5484d" />
    </svg>
  );
}

export function Logo({ className, dark = false, href = "/" }: { className?: string; dark?: boolean; href?: string }) {
  return (
    <Link href={href} className={cn("inline-flex items-center gap-2.5", className)} aria-label="Kabina">
      <LogoMark dark={dark} />
      <span className={cn("font-display text-[22px] font-bold tracking-tight", dark ? "text-white" : "text-ink-950")} style={{ fontVariationSettings: '"opsz" 48' }}>
        kabina
      </span>
    </Link>
  );
}
