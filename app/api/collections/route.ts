// GET /api/collections
// Returns all Webflow collections for the configured site.
import { NextResponse } from "next/server";
import { getCollections } from "@/lib/webflow";
import { clientConfig } from "@/config/collections";

export async function GET() {
  try {
    const collections = await getCollections();

    const shaped = collections.map((c) => ({
      id: c.id,
      displayName: clientConfig[c.id]?.label ?? c.displayName,
      slug: c.slug,
      lastUpdated: c.lastUpdated,
    }));

    return NextResponse.json({ collections: shaped });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    const status = message.includes("not set") ? 500 : 502;
    return NextResponse.json({ error: message }, { status });
  }
}
