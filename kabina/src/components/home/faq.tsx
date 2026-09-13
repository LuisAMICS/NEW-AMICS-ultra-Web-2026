import { ChevronDown } from "lucide-react";

export function Faq({ items, className }: { items: { q: string; a: string }[]; className?: string }) {
  return (
    <div className={className}>
      {items.map((f) => (
        <details key={f.q} className="group border-b border-ink-100 py-4 last:border-0">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-[15px] font-semibold text-ink-950 [&::-webkit-details-marker]:hidden">
            {f.q}
            <ChevronDown className="h-4 w-4 shrink-0 text-ink-500 transition group-open:rotate-180" aria-hidden />
          </summary>
          <p className="mt-3 text-[15px] leading-relaxed text-ink-600">{f.a}</p>
        </details>
      ))}
    </div>
  );
}
