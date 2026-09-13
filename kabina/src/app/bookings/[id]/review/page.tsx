import { notFound, redirect } from "next/navigation";
import { getT } from "@/lib/i18n";
import { requireUser } from "@/lib/auth";
import { getBookingById } from "@/lib/queries/bookings";
import { ReviewForm } from "@/components/booking/review-form";
import { formatDate, todayISO } from "@/lib/utils";

export default async function ReviewPage(props: PageProps<"/bookings/[id]/review">) {
  const { id } = await props.params;
  const user = await requireUser(`/bookings/${id}/review`);
  const [{ t, locale }, booking] = await Promise.all([getT(), getBookingById(id)]);
  if (!booking || booking.guestId !== user.id) notFound();
  const canReview = !booking.review && (booking.status === "completed" || (booking.status === "confirmed" && booking.date < todayISO()));
  if (!canReview) redirect(`/bookings/${id}`);
  return (
    <div className="container-x max-w-2xl py-8 md:py-12">
      <h1 className="text-3xl font-bold">{t.booking.reviewTitle}</h1>
      <p className="mt-2 text-ink-600">
        {booking.listing.title} · {formatDate(booking.date, locale)}
      </p>
      <div className="mt-8">
        <ReviewForm bookingId={booking.id} />
      </div>
    </div>
  );
}
