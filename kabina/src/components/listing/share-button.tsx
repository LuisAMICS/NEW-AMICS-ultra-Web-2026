"use client";

import { Share2, Check } from "lucide-react";
import { useState } from "react";
import { useT } from "@/lib/i18n/client";

export function ShareButton({ title }: { title: string }) {
  const { t } = useT();
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        const url = window.location.href;
        try {
          if (navigator.share) await navigator.share({ title, url });
          else {
            await navigator.clipboard.writeText(url);
            setDone(true);
            setTimeout(() => setDone(false), 1500);
          }
        } catch {
          /* user cancelled */
        }
      }}
      className="inline-flex h-10 items-center gap-2 rounded-xl border border-ink-200 bg-white px-3.5 text-sm font-semibold hover:bg-ink-50"
    >
      {done ? <Check className="h-4 w-4 text-ok" aria-hidden /> : <Share2 className="h-4 w-4" aria-hidden />}
      {done ? t.common.copied : t.listing.share}
    </button>
  );
}
