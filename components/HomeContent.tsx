"use client";

import { useState, useCallback, useRef } from "react";
import SearchBar from "./SearchBar";
import CollectionCard from "./CollectionCard";
import ItemCard from "./ItemCard";
import type { WebflowCollection, WebflowItem } from "@/lib/types";

interface SearchResult {
  item: WebflowItem;
  collection: { id: string; displayName: string };
}

interface GroupedResult {
  collection: { id: string; displayName: string };
  items: WebflowItem[];
}

interface HomeContentProps {
  collections: Array<WebflowCollection & { configLabel?: string }>;
}

export default function HomeContent({ collections }: HomeContentProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const handleSearch = useCallback((value: string) => {
    setQuery(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!value.trim()) {
      setResults([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(value)}`);
        const data = await res.json();
        setResults(data.results ?? []);
      } catch {
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);
  }, []);

  const grouped = results.reduce<GroupedResult[]>((acc, r) => {
    const existing = acc.find((g) => g.collection.id === r.collection.id);
    if (existing) {
      existing.items.push(r.item);
    } else {
      acc.push({ collection: r.collection, items: [r.item] });
    }
    return acc;
  }, []);

  const searching = query.trim().length > 0;

  return (
    <div>
      <div className="mb-10">
        <SearchBar value={query} onChange={handleSearch} isLoading={isSearching} />
      </div>

      {searching ? (
        <div>
          {isSearching ? (
            <div className="py-16 text-center text-sm text-gray-400">Searching…</div>
          ) : grouped.length === 0 ? (
            <div className="py-16 text-center text-sm text-gray-400">
              No results for &ldquo;{query}&rdquo;
            </div>
          ) : (
            <div className="space-y-8">
              <p className="text-sm text-gray-400">
                {results.length} result{results.length !== 1 ? "s" : ""} for &ldquo;{query}&rdquo;
              </p>
              {grouped.map((group) => (
                <div key={group.collection.id}>
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
                    {group.collection.displayName}
                  </h3>
                  <div className="space-y-2">
                    {group.items.map((item) => (
                      <ItemCard key={item.id} item={item} collectionId={group.collection.id} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
            Collections
          </h2>
          {collections.length === 0 ? (
            <p className="text-sm text-gray-400">No collections found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {collections.map((c) => (
                <CollectionCard key={c.id} collection={c} configLabel={c.configLabel} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
