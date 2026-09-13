"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function SubNav({ items }: { items: { href: string; label: string; exact?: boolean }[] }) {
  const pathname = usePathname();
  return (
    <nav className="scrollbar-none -mx-4 flex gap-1 overflow-x-auto border-b border-ink-100 px-4 sm:mx-0 sm:px-0" aria-label="Section">
      {items.map((item) => {
        const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
        return (
          <Link key={item.href} href={item.href} className={cn("-mb-px shrink-0 border-b-2 px-3 py-3 text-sm font-medium transition", active ? "border-ink-950 text-ink-950" : "border-transparent text-ink-500 hover:text-ink-900")}>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
