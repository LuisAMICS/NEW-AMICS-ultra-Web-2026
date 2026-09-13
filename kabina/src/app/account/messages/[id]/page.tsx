import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Send } from "lucide-react";
import { getT } from "@/lib/i18n";
import { requireUser } from "@/lib/auth";
import { getConversation } from "@/lib/queries/bookings";
import { sendMessage } from "@/app/actions/messages";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/field";
import { cn, formatDate, formatDateTime, formatHourRange } from "@/lib/utils";

export default async function ConversationPage(props: PageProps<"/account/messages/[id]">) {
  const { id } = await props.params;
  const user = await requireUser(`/account/messages/${id}`);
  const [{ t, locale }, conv] = await Promise.all([getT(), getConversation(id)]);
  if (!conv || (conv.guestId !== user.id && conv.hostId !== user.id)) notFound();
  const other = conv.guestId === user.id ? conv.host : conv.guest;
  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex items-center gap-3">
        <Link href="/account/messages" className="rounded-full p-2 hover:bg-ink-100" aria-label={t.common.back}>
          <ArrowLeft className="h-5 w-5" aria-hidden />
        </Link>
        <Avatar name={other.name} src={other.avatarUrl} />
        <div className="min-w-0">
          <p className="font-semibold">{other.name}</p>
          <Link href={`/studios/${conv.listing.slug}`} className="block truncate text-xs text-ink-500 hover:underline">
            {conv.listing.title}
          </Link>
        </div>
        {conv.booking ? (
          <Link href={`/bookings/${conv.booking.id}`} className="ml-auto rounded-full border border-ink-200 px-3 py-1.5 text-xs font-medium hover:bg-ink-50">
            {conv.booking.code} · {formatDate(conv.booking.date, locale, "short")} {formatHourRange(conv.booking.startHour, conv.booking.endHour)}
          </Link>
        ) : null}
      </div>
      <div className="mt-6 space-y-4 rounded-3xl border border-ink-100 bg-white p-4 md:p-6">
        {conv.messages.length === 0 ? <p className="text-center text-sm text-ink-500">{t.account.noMessages}</p> : null}
        {conv.messages.map((m) => {
          const mine = m.senderId === user.id;
          return (
            <div key={m.id} className={cn("flex gap-3", mine ? "flex-row-reverse" : "")}>
              <Avatar name={m.sender.name} src={m.sender.avatarUrl} size="sm" />
              <div className={cn("max-w-[75%] rounded-2xl px-4 py-2.5 text-sm", mine ? "bg-ink-950 text-white" : "bg-ink-100 text-ink-900")}>
                <p className="whitespace-pre-line">{m.body}</p>
                <p className={cn("mt-1 text-[11px]", mine ? "text-ink-400" : "text-ink-500")}>{formatDateTime(m.createdAt, locale)}</p>
              </div>
            </div>
          );
        })}
      </div>
      <form action={sendMessage} className="mt-4 flex gap-2">
        <input type="hidden" name="conversationId" value={conv.id} />
        <Input name="body" placeholder={t.account.messagePlaceholder} required maxLength={2000} autoComplete="off" />
        <Button type="submit" variant="dark">
          <Send className="h-4 w-4" aria-hidden /> {t.account.sendMessage}
        </Button>
      </form>
    </div>
  );
}
