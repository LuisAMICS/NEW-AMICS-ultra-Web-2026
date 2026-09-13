import { notFound } from "next/navigation";
import { getT } from "@/lib/i18n";
import { requireHost } from "@/lib/auth";
import { getHostListingForEdit } from "@/lib/queries/host";
import { ListingEditor } from "@/components/host/listing-editor";

export default async function EditListingPage(props: PageProps<"/host/listings/[id]">) {
  const { id } = await props.params;
  const user = await requireHost(`/host/listings/${id}`);
  const [{ t }, listing] = await Promise.all([getT(), getHostListingForEdit(id, user.id)]);
  if (!listing) notFound();
  return (
    <div>
      <h1 className="text-2xl font-bold">{t.host.wizard.editTitle}</h1>
      <div className="mt-6">
        <ListingEditor listing={listing} />
      </div>
    </div>
  );
}
