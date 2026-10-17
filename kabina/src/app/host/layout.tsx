import { requireHost } from "@/lib/auth";
import { getT } from "@/lib/i18n";
import { SubNav } from "@/components/sub-nav";

export default async function HostLayout({ children }: LayoutProps<"/host">) {
  const [{ t }] = await Promise.all([getT(), requireHost("/host")]);
  return (
    <div className="container-x py-8 md:py-10">
      <SubNav
        items={[
          { href: "/host", label: t.host.dashboardTitle, exact: true },
          { href: "/host/listings", label: t.host.listingsTitle },
          { href: "/host/bookings", label: t.host.requestsTitle },
          { href: "/host/calendar", label: t.host.calendarTitle },
          { href: "/host/earnings", label: t.host.earningsTitle },
        ]}
      />
      <div className="mt-8">{children}</div>
    </div>
  );
}
