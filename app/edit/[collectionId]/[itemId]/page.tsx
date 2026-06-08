import Link from "next/link";
import { notFound } from "next/navigation";
import { getCollection, getAllCollectionItems } from "@/lib/webflow";
import { clientConfig } from "@/config/collections";
import EditForm from "@/components/EditForm";

interface EditPageProps {
  params: { collectionId: string; itemId: string };
}

function StatusBadge({ isDraft, isArchived }: { isDraft: boolean; isArchived: boolean }) {
  if (isArchived) return <span className="badge-archived">Archived</span>;
  if (isDraft) return <span className="badge-draft">Draft</span>;
  return <span className="badge-published">Published</span>;
}

export default async function EditPage({ params }: EditPageProps) {
  const { collectionId, itemId } = params;

  let collection;
  let item;

  try {
    collection = await getCollection(collectionId);
    const allItems = await getAllCollectionItems(collectionId);
    item = allItems.find((i) => i.id === itemId);
  } catch {
    notFound();
  }

  if (!item) notFound();

  const config = clientConfig[collectionId];
  const collectionLabel = config?.label ?? collection.displayName;
  const itemName = (item.fieldData?.name as string) || itemId;

  return (
    <div>
      <div className="mb-8">
        <Link
          href={`/collection/${collectionId}`}
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-indigo-600 transition-colors mb-4"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {collectionLabel}
        </Link>

        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-semibold text-gray-900 break-words">{itemName}</h1>
          <StatusBadge isDraft={item.isDraft} isArchived={item.isArchived} />
        </div>

        {item.lastUpdated && (
          <p className="text-sm text-gray-400 mt-1">
            Last updated{" "}
            {new Date(item.lastUpdated).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        )}
      </div>

      <div className="max-w-2xl">
        <EditForm
          item={item}
          fields={collection.fields ?? []}
          collectionId={collectionId}
          collectionConfig={config}
        />
      </div>
    </div>
  );
}
