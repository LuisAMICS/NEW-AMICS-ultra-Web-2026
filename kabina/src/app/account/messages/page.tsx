import Link from "next/link";
import { getT } from "@/lib/i18n";
import { requireUser } from "@/lib/auth";
import { getConversationsForUser } from "@/lib/queries/bookings";
import { Avatar } from "@/components/ui/avatar";
import { formatDateTime, tpl, truncate } from "@/lib/utils";

export default async function MessagesPage() {
  const user = await requireUser("/account/messages");
  const [{ t, locale }, conversations] = await Promise.all([getT(), getConversationsForUser(user.id)]);
  if (!conversations.length) {
    return <p className="rounded-3xl border border-dashed border-ink-200 bg-white p-10 text-center text-ink-600">{t.account.noMessages}</p>;
  }
  return (
    <ul className="divide-y divide-ink-100 overflow-hidden rounded-3xl border border-ink-100 bg-white">
      {conversations.map((c) => {
        const other = c.guestId === user.id ? c.host : c.guest;
        const last = c.messages[0];
        return (
          <li key={c.id}>
            <Link href={`/account/messages/${c.id}`} className="flex items-center gap-4 p-4 hover:bg-ink-50">
              <Avatar name={other.name} src={other.avatarUrl} size="lg" />
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-3">
                  <p className="truncate font-semibold">{other.name}</p>
                  {last ? <span className="shrink-0 text-xs text-ink-500">{formatDateTime(last.createdAt, locale)}</span> : null}
                </div>
                <p className="truncate text-xs text-ink-500">{tpl(t.account.conversationAbout, { listing: c.listing.title })}</p>
                {last ? <p className="mt-1 truncate text-sm text-ink-700">{truncate(last.body, 90)}</p> : null}
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
