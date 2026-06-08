import Link from "next/link";
import type { WebflowItem } from "@/lib/types";

interface ItemCardProps {
  item: WebflowItem;
  collectionId: string;
}

function StatusBadge({ item }: { item: WebflowItem }) {
  if (item.isArchived) return <span className="badge-archived">Archived</span>;
  if (item.isDraft) return <span className="badge-draft">Draft</span>;
  return <span className="badge-published">Published</span>;
}

function formatDate(iso?: string): string {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

export default function ItemCard({ item, collectionId }: ItemCardProps) {
  const name = (item.fieldData?.name as string) || item.id;
  const slug = item.fieldData?.slug as string | undefined;
  const updated = item.lastUpdated;

  return (
    <Link
      href={`/edit/${collectionId}/${item.id}`}
      className="group flex items-center justify-between p-4 bg-white border border-gray-200
                 rounded-lg hover:border-indigo-300 hover:shadow-sm transition-all"
    >
      <div className="min-w-0">
        <p className="text-sm font-medium text-gray-900 group-hover:text-indigo-600 transition-colors truncate">
          {name}
        </p>
        {slug && (
          <p className="text-xs text-gray-400 mt-0.5 truncate">/{slug}</p>
        )}
      </div>
      <div className="flex items-center gap-3 ml-4 flex-shrink-0">
        <StatusBadge item={item} />
        {updated && (
          <span className="text-xs text-gray-400 hidden sm:block">{formatDate(updated)}</span>
        )}
        <svg
          className="w-4 h-4 text-gray-300 group-hover:text-indigo-400 transition-colors"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}
