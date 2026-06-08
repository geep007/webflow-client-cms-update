// POST /api/items/:id/publish
// Publishes a single CMS item live. Requires collectionId in the request body.
import { NextResponse } from "next/server";
import { publishCollectionItems } from "@/lib/webflow";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  let body: { collectionId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { collectionId } = body;

  if (!collectionId) {
    return NextResponse.json({ error: "collectionId is required" }, { status: 400 });
  }

  try {
    const result = await publishCollectionItems(collectionId, [id]);
    return NextResponse.json({ ok: true, result });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    const status = message.includes("not set") ? 500 : 502;
    return NextResponse.json({ error: message }, { status });
  }
}
