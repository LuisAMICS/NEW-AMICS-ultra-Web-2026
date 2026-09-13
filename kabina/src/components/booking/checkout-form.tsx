"use client";

import { useActionState } from "react";
import { Lock, Zap } from "lucide-react";
import { createBooking, type BookingActionState } from "@/app/actions/bookings";
import { Button } from "@/components/ui/button";
import { Field, Textarea } from "@/components/ui/field";
import { useT } from "@/lib/i18n/client";
import { formatMoney, tpl } from "@/lib/utils";

export function CheckoutForm({
  listingId,
  date,
  from,
  to,
  addons,
  engineer,
  totalCents,
  currency,
  instantBook,
  stripe,
}: {
  listingId: string;
  date: string;
  from: number;
  to: number;
  addons: string[];
  engineer: boolean;
  totalCents: number;
  currency: string;
  instantBook: boolean;
  stripe: boolean;
}) {
  const { t, locale } = useT();
  const [state, action, pending] = useActionState<BookingActionState, FormData>(createBooking, null);
  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="listingId" value={listingId} />
      <input type="hidden" name="date" value={date} />
      <input type="hidden" name="from" value={from} />
      <input type="hidden" name="to" value={to} />
      <input type="hidden" name="addons" value={addons.join(",")} />
      <input type="hidden" name="engineer" value={engineer ? "1" : ""} />
      <Field label={t.booking.notesLabel} htmlFor="notes" hint={`(${t.common.optional})`}>
        <Textarea id="notes" name="notes" placeholder={t.booking.notesPlaceholder} maxLength={1500} />
        <p className="mt-1.5 text-xs text-ink-500">{t.listing.sessionBriefHint}</p>
      </Field>
      <div className="rounded-2xl border border-ink-100 bg-white p-4">
        <h2 className="flex items-center gap-2 font-bold">
          <Lock className="h-4 w-4 text-ink-500" aria-hidden /> {t.booking.paymentTitle}
        </h2>
        <p className="mt-2 text-sm text-ink-600">{stripe ? t.booking.stripePayment : t.booking.demoPayment}</p>
      </div>
      {state?.error ? (
        <p className="rounded-xl bg-red-50 p-3 text-sm text-rec" role="alert">
          {state.error}
        </p>
      ) : null}
      <Button type="submit" size="lg" className="w-full" loading={pending}>
        {instantBook ? <Zap className="h-4 w-4" aria-hidden /> : null}
        {instantBook || stripe ? tpl(t.booking.payButton, { total: formatMoney(totalCents, currency, locale) }) : t.booking.requestButton}
      </Button>
      <p className="text-center text-xs text-ink-500">{t.booking.policyAgree}</p>
    </form>
  );
}
