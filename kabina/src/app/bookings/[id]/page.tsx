import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, MapPin, CheckCircle2, Hourglass, MessageSquare, Star, XCircle, FileText } from "lucide-react";
import { getT } from "@/lib/i18n";
import { requireUser } from "@/lib/auth";
import { getBookingById, sweepCompletedBookings } from "@/lib/queries/bookings";
import { StatusBadge } from "@/components/booking/status-badge";
import { Avatar } from "@/components/ui/avatar";
import { Button, ButtonLink } from "@/components/ui/button";
import { cancelBooking, messageAboutBooking, respondBooking } from "@/app/actions/bookings";
import { hoursUntil, refundFraction } from "@/lib/pricing";
import { formatDate, formatDateTime, formatHourRange, formatMoney, todayISO, tpl } from "@/lib/utils";
import { CancelButton } from "@/components/booking/cancel-button";

export default async function BookingPage(props: PageProps<"/bookings/[id]">) {
  const [{ id }, sp] = await Promise.all([props.params, props.searchParams]);
  const user = await requireUser(`/bookings/${id}`);
  await sweepCompletedBookings();
  const [{ t, locale }, booking] = await Promise.all([getT(), getBookingById(id)]);
  if (!booking || (booking.guestId !== user.id && booking.hostId !== user.id)) notFound();
  const isHost = booking.hostId === user.id;
  const isNew = sp.new === "1" || sp.paid === "1";
  const upcoming = booking.date >= todayISO() && (booking.status === "pending" || booking.status === "confirmed");
  const canReview = !isHost && !booking.review && (booking.status === "completed" || (booking.status === "confirmed" && booking.date < todayISO()));
  const refund = !isHost && upcoming ? Math.round(booking.totalCents * (booking.status === "confirmed" ? refundFraction(booking.cancellationPolicy, hoursUntil(booking.date, booking.startHour)) : 1)) : booking.totalCents;
  const counterpart = isHost ? booking.guest : booking.host;
  const showAddress = isHost || booking.status === "confirmed" || booking.status === "completed";

  return (
    <div className="container-x max-w-4xl py-8 md:py-12">
      {isNew ? (
        <div className="mb-8 rounded-3xl bg-ink-950 p-6 text-white md:p-8">
          <div className="flex items-start gap-4">
            {booking.status === "confirmed" ? <CheckCircle2 className="h-9 w-9 shrink-0 text-brand-400" aria-hidden /> : <Hourglass className="h-9 w-9 shrink-0 text-brand-400" aria-hidden />}
            <div>
              <h1 className="text-2xl font-bold md:text-3xl">{booking.status === "confirmed" ? t.booking.confirmedTitle : t.booking.pendingTitle}</h1>
              <p className="mt-2 text-ink-300">{booking.status === "confirmed" ? t.booking.confirmedText : t.booking.pendingText}</p>
              <p className="mt-3 text-sm text-ink-400">
                {t.booking.code}: <span className="font-mono font-semibold text-white">{booking.code}</span>
              </p>
            </div>
          </div>
        </div>
      ) : null}
      {sp.reviewed === "1" ? <p className="mb-6 rounded-2xl bg-emerald-50 p-4 text-sm font-medium text-emerald-800">{t.booking.reviewThanks}</p> : null}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          {!isNew ? <h1 className="text-2xl font-bold md:text-3xl">{t.booking.detailsTitle}</h1> : <h2 className="text-2xl font-bold">{t.booking.detailsTitle}</h2>}
          <p className="mt-1 text-sm text-ink-500">
            {t.booking.code}: <span className="font-mono">{booking.code}</span> · {tpl(t.booking.createdAt, { date: formatDateTime(booking.createdAt, locale) })}
          </p>
        </div>
        <StatusBadge status={booking.status} t={t} />
      </div>
      <p className="mt-3 text-sm text-ink-600">{t.booking.statusHelp[booking.status]}</p>
      {booking.status === "cancelled" ? (
        <p className="mt-1 text-sm text-ink-600">
          {booking.cancelledBy === "host" ? t.booking.cancelledByHost : t.booking.cancelledByGuest}
          {booking.refundCents ? ` · ${t.booking.refundEstimate}: ${formatMoney(booking.refundCents, booking.currency, locale)}` : ""}
        </p>
      ) : null}

      <div className="mt-8 grid gap-6 md:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <section className="rounded-3xl border border-ink-100 bg-white p-5">
            <div className="flex gap-4">
              {booking.listing.photos[0] ? <img src={booking.listing.photos[0].url} alt="" className="h-20 w-28 shrink-0 rounded-xl object-cover" /> : null}
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">{t.types[booking.listing.type].label}</p>
                <Link href={`/studios/${booking.listing.slug}`} className="font-bold leading-snug hover:underline">
                  {booking.listing.title}
                </Link>
                <p className="text-sm text-ink-500">
                  {booking.listing.neighborhood ? `${booking.listing.neighborhood}, ` : ""}
                  {booking.listing.city}
                </p>
              </div>
            </div>
            <dl className="mt-5 grid gap-3 border-t border-ink-100 pt-4 text-sm sm:grid-cols-2">
              <div className="flex items-start gap-2">
                <CalendarDays className="mt-0.5 h-4 w-4 text-ink-500" aria-hidden />
                <div>
                  <dt className="text-xs text-ink-500">{t.booking.dateAndTime}</dt>
                  <dd className="font-medium capitalize">{formatDate(booking.date, locale, "weekday")}</dd>
                  <dd className="font-medium">
                    {formatHourRange(booking.startHour, booking.endHour)} · {booking.hours} {t.common.hours}
                  </dd>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 text-ink-500" aria-hidden />
                <div>
                  <dt className="text-xs text-ink-500">{t.booking.address}</dt>
                  <dd className="font-medium">{showAddress && booking.listing.address ? booking.listing.address : t.listing.locationNote}</dd>
                </div>
              </div>
            </dl>
            <div className="mt-4 flex items-start gap-2 border-t border-ink-100 pt-4 text-sm">
              <FileText className="mt-0.5 h-4 w-4 text-ink-500" aria-hidden />
              <div>
                <p className="text-xs text-ink-500">{t.booking.sessionBrief}</p>
                <p className="mt-0.5 whitespace-pre-line text-ink-800">{booking.notes ?? t.booking.noNotes}</p>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-ink-100 bg-white p-5">
            <h2 className="font-bold">{isHost ? t.booking.guest : t.booking.studio}</h2>
            <div className="mt-3 flex items-center gap-3">
              <Avatar name={counterpart.name} src={counterpart.avatarUrl} size="lg" />
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{counterpart.name}</p>
                {isHost && booking.guest.bio ? <p className="text-sm text-ink-600">{booking.guest.bio}</p> : null}
              </div>
              <form action={messageAboutBooking}>
                <input type="hidden" name="bookingId" value={booking.id} />
                <Button type="submit" variant="outline" size="sm">
                  <MessageSquare className="h-4 w-4" aria-hidden /> {isHost ? t.booking.messageGuest : t.booking.messageHost}
                </Button>
              </form>
            </div>
          </section>
        </div>

        <aside className="space-y-4">
          <section className="rounded-3xl border border-ink-100 bg-white p-5">
            <h2 className="font-bold">{t.booking.priceDetails}</h2>
            <dl className="mt-3 space-y-1.5 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink-600">{tpl(t.listing.priceBase, { rate: formatMoney(booking.hourlyRate, booking.currency, locale, { compact: true }), hours: booking.hours })}</dt>
                <dd>{formatMoney(booking.subtotalCents, booking.currency, locale)}</dd>
              </div>
              {booking.discountCents ? (
                <div className="flex justify-between text-ok">
                  <dt>{t.listing.offPeak}</dt>
                  <dd>-{formatMoney(booking.discountCents, booking.currency, locale)}</dd>
                </div>
              ) : null}
              {booking.addons.map((a) => (
                <div key={a.name} className="flex justify-between">
                  <dt className="text-ink-600">{a.name}</dt>
                  <dd>{formatMoney(a.totalCents, booking.currency, locale)}</dd>
                </div>
              ))}
              {!isHost ? (
                <div className="flex justify-between text-ink-500">
                  <dt>{t.listing.serviceFee}</dt>
                  <dd>{booking.guestFeeCents ? formatMoney(booking.guestFeeCents, booking.currency, locale) : t.listing.noServiceFee}</dd>
                </div>
              ) : null}
              <div className="flex justify-between border-t border-ink-100 pt-2 font-bold">
                <dt>{t.common.total}</dt>
                <dd>{formatMoney(booking.totalCents, booking.currency, locale)}</dd>
              </div>
              {isHost ? (
                <>
                  <div className="flex justify-between text-ink-500">
                    <dt>{t.booking.hostFee}</dt>
                    <dd>-{formatMoney(booking.hostFeeCents, booking.currency, locale)}</dd>
                  </div>
                  <div className="flex justify-between font-bold text-ok">
                    <dt>{t.booking.payout}</dt>
                    <dd>{formatMoney(booking.hostPayoutCents, booking.currency, locale)}</dd>
                  </div>
                </>
              ) : null}
              <div className="flex justify-between pt-1 text-xs text-ink-500">
                <dt>{t.booking.paymentLabel}</dt>
                <dd>{t.paymentStatuses[booking.paymentStatus]}</dd>
              </div>
            </dl>
            <p className="mt-3 text-xs text-ink-500">
              {t.listing.policyTitle}: {t.policies[booking.cancellationPolicy].label}
            </p>
          </section>

          <section className="space-y-2">
            {isHost && booking.status === "pending" && upcoming ? (
              <form action={respondBooking} className="grid grid-cols-2 gap-2">
                <input type="hidden" name="bookingId" value={booking.id} />
                <Button type="submit" name="decision" value="accept">
                  <CheckCircle2 className="h-4 w-4" aria-hidden /> {t.booking.accept}
                </Button>
                <Button type="submit" name="decision" value="decline" variant="outline">
                  <XCircle className="h-4 w-4" aria-hidden /> {t.booking.decline}
                </Button>
                <p className="col-span-2 text-xs text-ink-500">{t.booking.hostConfirmNote}</p>
              </form>
            ) : null}
            {canReview ? (
              <ButtonLink href={`/bookings/${booking.id}/review`} className="w-full">
                <Star className="h-4 w-4" aria-hidden /> {t.booking.leaveReview}
              </ButtonLink>
            ) : null}
            {booking.review ? <p className="rounded-xl bg-ink-50 p-3 text-center text-sm text-ink-600">{t.booking.reviewDone} · ★ {booking.review.rating}</p> : null}
            {upcoming ? (
              <form action={cancelBooking}>
                <input type="hidden" name="bookingId" value={booking.id} />
                <CancelButton label={t.booking.cancelBooking} confirmText={tpl(t.booking.cancelConfirm, { refund: formatMoney(isHost ? booking.totalCents : refund, booking.currency, locale) })} />
                {!isHost ? (
                  <p className="mt-2 text-center text-xs text-ink-500">
                    {t.booking.refundEstimate}: {formatMoney(refund, booking.currency, locale)}
                  </p>
                ) : null}
              </form>
            ) : null}
            <ButtonLink href={isHost ? "/host/bookings" : "/account/bookings"} variant="ghost" className="w-full">
              {isHost ? t.host.requestsTitle : t.account.bookingsTitle}
            </ButtonLink>
          </section>
        </aside>
      </div>
    </div>
  );
}
