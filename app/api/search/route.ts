// GET /api/search?q=<query>
// Searches across all collections by item name/slug. 300ms debounce enforced on client.
// Fetches up to 100 items per collection in parallel.
import { NextResponse } from "next/server";
import { getCollections, getCollectionItems } from "@/lib/webflow";
import { clientConfig } from "@/config/collections";
import type { WebflowItem } from "@/lib/types";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = url.searchParams.get("q")?.trim().toLowerCase() ?? "";

  if (!q) {
    return NextResponse.json({ results: [] });
  }

  try {
    const collections = await getCollections();

    // Fetch first page of each collection in parallel
    const collectionResults = await Promise.allSettled(
      collections.map(async (col) => {
        const { items } = await getCollectionItems(col.id, 100, 0);
        const label = clientConfig[col.id]?.label ?? col.displayName;
        return { collection: { id: col.id, displayName: label }, items };
      })
    );

    const results: Array<{ item: WebflowItem; collection: { id: string; displayName: string } }> = [];

    for (const r of collectionResults) {
      if (r.status === "rejected") continue;
      const { collection, items } = r.value;

      for (const item of items) {
        const name = ((item.fieldData?.name as string) ?? "").toLowerCase();
        const slug = ((item.fieldData?.slug as string) ?? "").toLowerCase();

        if (name.includes(q) || slug.includes(q)) {
          results.push({ item, collection });
        }
      }
    }

    return NextResponse.json({ results });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    const status = message.includes("not set") ? 500 : 502;
    return NextResponse.json({ error: message }, { status });
  }
}
