import { Radio } from "lucide-react";
import type { Dictionary } from "@/lib/i18n";

export function DemoBanner({ t }: { t: Dictionary }) {
  return (
    <div className="bg-ink-950 text-center text-[13px] text-ink-200">
      <div className="container-x flex items-center justify-center gap-2 py-2">
        <Radio className="h-3.5 w-3.5 text-rec animate-pulse-soft" aria-hidden />
        <span>{t.common.demoBanner}</span>
      </div>
    </div>
  );
}
