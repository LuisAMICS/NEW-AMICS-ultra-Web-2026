import { Badge } from "@/components/ui/badge";
import type { BookingStatus } from "@/lib/constants";
import type { Dictionary } from "@/lib/i18n";

const tones = { pending: "brand", confirmed: "ok", declined: "neutral", cancelled: "rec", completed: "info" } as const;

export function StatusBadge({ status, t }: { status: BookingStatus; t: Dictionary }) {
  return <Badge tone={tones[status]}>{t.statuses[status]}</Badge>;
}
