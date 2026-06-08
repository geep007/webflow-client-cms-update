// PATCH /api/items/:id
// Updates a single CMS item. Requires collectionId in the request body.
import { NextResponse } from "next/server";
import { updateCollectionItems } from "@/lib/webflow";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  let body: { collectionId?: string; fieldData?: Record<string, unknown> };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { collectionId, fieldData } = body;

  if (!collectionId) {
    return NextResponse.json({ error: "collectionId is required" }, { status: 400 });
  }
  if (!fieldData || typeof fieldData !== "object") {
    return NextResponse.json({ error: "fieldData is required" }, { status: 400 });
  }

  try {
    const result = await updateCollectionItems(collectionId, [{ id, fieldData }]);
    return NextResponse.json({ ok: true, result });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    const status = message.includes("not set") ? 500 : 502;
    return NextResponse.json({ error: message }, { status });
  }
}
