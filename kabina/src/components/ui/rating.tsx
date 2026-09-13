import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function Rating({ value, count, className, size = "sm", showCount = true }: { value: number; count?: number; className?: string; size?: "sm" | "md"; showCount?: boolean }) {
  if (!count) {
    return null;
  }
  return (
    <span className={cn("inline-flex items-center gap-1 font-semibold text-ink-900", size === "sm" ? "text-sm" : "text-base", className)}>
      <Star className={cn("fill-ink-950 text-ink-950", size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4")} aria-hidden />
      {value.toFixed(1)}
      {showCount && count !== undefined ? <span className="font-normal text-ink-500">({count})</span> : null}
    </span>
  );
}

export function Stars({ value, className }: { value: number; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-0.5", className)} aria-label={`${value} / 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} className={cn("h-3.5 w-3.5", i <= Math.round(value) ? "fill-brand-400 text-brand-400" : "fill-ink-200 text-ink-200")} aria-hidden />
      ))}
    </span>
  );
}
