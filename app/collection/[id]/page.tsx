import Link from "next/link";
import { notFound } from "next/navigation";
import { getCollection, getCollectionItems } from "@/lib/webflow";
import { clientConfig } from "@/config/collections";
import ItemCard from "@/components/ItemCard";

interface CollectionPageProps {
  params: { id: string };
  searchParams: { offset?: string };
}

export default async function CollectionPage({ params, searchParams }: CollectionPageProps) {
  const offset = Number(searchParams.offset ?? 0);
  const limit = 100;

  let collection;
  let items;
  let total = 0;

  try {
    [collection, { items, total }] = await Promise.all([
      getCollection(params.id),
      getCollectionItems(params.id, limit, offset),
    ]);
  } catch {
    notFound();
  }

  const config = clientConfig[params.id];
  const displayName = config?.label ?? collection.displayName;

  const hasPrev = offset > 0;
  const hasNext = offset + limit < total;

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-indigo-600 transition-colors mb-4"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          All Collections
        </Link>
        <div className="flex items-baseline gap-3">
          <h1 className="text-2xl font-semibold text-gray-900">{displayName}</h1>
          <span className="text-sm text-gray-400">{total} items</span>
        </div>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-gray-500 py-10 text-center">No items found in this collection.</p>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <ItemCard key={item.id} item={item} collectionId={params.id} />
          ))}
        </div>
      )}

      {(hasPrev || hasNext) && (
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
          <div className="text-sm text-gray-400">
            Showing {offset + 1}–{Math.min(offset + limit, total)} of {total}
          </div>
          <div className="flex gap-2">
            {hasPrev && (
              <Link
                href={`/collection/${params.id}?offset=${offset - limit}`}
                className="btn-secondary text-sm"
              >
                ← Previous
              </Link>
            )}
            {hasNext && (
              <Link
                href={`/collection/${params.id}?offset=${offset + limit}`}
                className="btn-primary text-sm"
              >
                Next →
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
