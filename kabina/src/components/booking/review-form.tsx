"use client";

import { useActionState, useState } from "react";
import { Star } from "lucide-react";
import { leaveReview, type ReviewState } from "@/app/actions/reviews";
import { Button } from "@/components/ui/button";
import { Field, Textarea } from "@/components/ui/field";
import { useT } from "@/lib/i18n/client";
import { cn } from "@/lib/utils";

function StarInput({ name, label, value, onChange }: { name: string; label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <span className="text-sm font-medium text-ink-800">{label}</span>
      <div className="flex gap-1" role="radiogroup" aria-label={label}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} type="button" role="radio" aria-checked={value === n} onClick={() => onChange(n)} className="rounded p-0.5 hover:scale-110">
            <Star className={cn("h-6 w-6", n <= value ? "fill-brand-400 text-brand-400" : "fill-ink-100 text-ink-200")} aria-hidden />
          </button>
        ))}
      </div>
      <input type="hidden" name={name} value={value} />
    </div>
  );
}

export function ReviewForm({ bookingId }: { bookingId: string }) {
  const { t } = useT();
  const [state, action, pending] = useActionState<ReviewState, FormData>(leaveReview, null);
  const [ratings, setRatings] = useState({ rating: 5, ratingSound: 5, ratingEquipment: 5, ratingHost: 5, ratingValue: 5 });
  const set = (k: keyof typeof ratings) => (v: number) => setRatings((r) => ({ ...r, [k]: v }));
  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="bookingId" value={bookingId} />
      <div className="divide-y divide-ink-100 rounded-2xl border border-ink-100 bg-white px-4">
        <StarInput name="rating" label={t.listing.ratingOverall} value={ratings.rating} onChange={set("rating")} />
        <StarInput name="ratingSound" label={t.listing.subratings.sound} value={ratings.ratingSound} onChange={set("ratingSound")} />
        <StarInput name="ratingEquipment" label={t.listing.subratings.equipment} value={ratings.ratingEquipment} onChange={set("ratingEquipment")} />
        <StarInput name="ratingHost" label={t.listing.subratings.host} value={ratings.ratingHost} onChange={set("ratingHost")} />
        <StarInput name="ratingValue" label={t.listing.subratings.value} value={ratings.ratingValue} onChange={set("ratingValue")} />
      </div>
      <Field label={t.booking.reviewComment} htmlFor="comment">
        <Textarea id="comment" name="comment" required minLength={10} maxLength={2000} placeholder={t.booking.reviewText} />
      </Field>
      {state?.error ? <p className="text-sm text-rec">{state.error}</p> : null}
      <Button type="submit" size="lg" loading={pending}>
        {t.booking.reviewSubmit}
      </Button>
    </form>
  );
}
