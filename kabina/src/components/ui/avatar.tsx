import { cn, initials } from "@/lib/utils";

export function Avatar({ name, src, size = "md", className }: { name: string; src?: string | null; size?: "sm" | "md" | "lg" | "xl"; className?: string }) {
  const sizes = { sm: "h-8 w-8 text-xs", md: "h-10 w-10 text-sm", lg: "h-14 w-14 text-base", xl: "h-20 w-20 text-xl" };
  return src ? (
    <img src={src} alt={name} className={cn("rounded-full object-cover", sizes[size], className)} />
  ) : (
    <span className={cn("inline-flex shrink-0 items-center justify-center rounded-full bg-ink-950 font-display font-bold text-brand-300", sizes[size], className)} aria-hidden>
      {initials(name)}
    </span>
  );
}
