import Link from "next/link";
import type { WebflowCollection } from "@/lib/types";

interface CollectionCardProps {
  collection: WebflowCollection & { itemCount?: number };
  configLabel?: string;
}

export default function CollectionCard({ collection, configLabel }: CollectionCardProps) {
  const label = configLabel || collection.displayName;

  return (
    <Link
      href={`/collection/${collection.id}`}
      className="group block p-5 bg-white border border-gray-200 rounded-xl
                 hover:border-indigo-300 hover:shadow-sm transition-all"
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
            {label}
          </h3>
          {collection.itemCount !== undefined && (
            <p className="text-xs text-gray-500 mt-1">
              {collection.itemCount} {collection.itemCount === 1 ? "item" : "items"}
            </p>
          )}
        </div>
        <svg
          className="w-4 h-4 text-gray-300 group-hover:text-indigo-400 transition-colors mt-0.5"
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
