import { getT } from "@/lib/i18n";
import { requireHost } from "@/lib/auth";
import { ListingEditor } from "@/components/host/listing-editor";

export default async function NewListingPage() {
  await requireHost("/host/listings/new");
  const { t } = await getT();
  return (
    <div>
      <h1 className="text-2xl font-bold">{t.host.wizard.title}</h1>
      <div className="mt-6">
        <ListingEditor listing={null} />
      </div>
    </div>
  );
}
