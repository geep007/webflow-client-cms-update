// GET /api/collections/:id
// Returns collection schema (fields) + paginated items.
import { NextResponse } from "next/server";
import { getCollection, getCollectionItems } from "@/lib/webflow";
import { clientConfig } from "@/config/collections";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    const url = new URL(_req.url);
    const limit = Math.min(Number(url.searchParams.get("limit") ?? 100), 100);
    const offset = Number(url.searchParams.get("offset") ?? 0);

    const [collection, { items, total }] = await Promise.all([
      getCollection(id),
      getCollectionItems(id, limit, offset),
    ]);

    const config = clientConfig[id];

    return NextResponse.json({
      collection: {
        id: collection.id,
        displayName: config?.label ?? collection.displayName,
        slug: collection.slug,
        fields: collection.fields ?? [],
      },
      items,
      total,
      limit,
      offset,
      config: config ?? null,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    const status = message.includes("not set") ? 500 : 502;
    return NextResponse.json({ error: message }, { status });
  }
}
