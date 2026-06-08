// All Webflow Data API v2 calls. Server-side only — token never reaches the client.
// Base URL: https://api.webflow.com/v2
// Docs: https://developers.webflow.com/data/reference

import type { WebflowCollection, WebflowField, WebflowItem } from "./types";

const BASE_URL = "https://api.webflow.com/v2";

function headers(): HeadersInit {
  const token = process.env.WEBFLOW_API_TOKEN;
  if (!token) throw new Error("WEBFLOW_API_TOKEN is not set");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    accept: "application/json",
  };
}

async function webflowFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: { ...headers(), ...(init?.headers ?? {}) },
    cache: "no-store",
  });

  if (!res.ok) {
    let msg = `Webflow API error ${res.status}`;
    try {
      const body = await res.json();
      if (body.message) msg = body.message;
      else if (body.msg) msg = body.msg;
    } catch {
      // ignore parse error
    }
    throw new Error(msg);
  }

  return res.json() as Promise<T>;
}

// GET /v2/sites/:site_id/collections
export async function getCollections(): Promise<WebflowCollection[]> {
  const siteId = process.env.WEBFLOW_SITE_ID;
  if (!siteId) throw new Error("WEBFLOW_SITE_ID is not set");

  const data = await webflowFetch<{ collections: WebflowCollection[] }>(
    `/sites/${siteId}/collections`
  );
  return data.collections ?? [];
}

// GET /v2/collections/:collection_id
export async function getCollection(collectionId: string): Promise<WebflowCollection & { fields: WebflowField[] }> {
  return webflowFetch(`/collections/${collectionId}`);
}

// GET /v2/collections/:collection_id/items?limit=100&offset=0
// Using /items (not /items/live) to include draft items for editing
export async function getCollectionItems(
  collectionId: string,
  limit = 100,
  offset = 0
): Promise<{ items: WebflowItem[]; total: number }> {
  const data = await webflowFetch<{
    items: WebflowItem[];
    pagination: { total: number; limit: number; offset: number };
  }>(`/collections/${collectionId}/items?limit=${limit}&offset=${offset}`);

  return {
    items: data.items ?? [],
    total: data.pagination?.total ?? 0,
  };
}

// Fetches all items across pages (handles pagination automatically)
export async function getAllCollectionItems(collectionId: string): Promise<WebflowItem[]> {
  const all: WebflowItem[] = [];
  const limit = 100;
  let offset = 0;

  let fetching = true;
  while (fetching) {
    const { items, total } = await getCollectionItems(collectionId, limit, offset);
    all.push(...items);
    if (all.length >= total || items.length < limit) {
      fetching = false;
    } else {
      offset += limit;
    }
  }

  return all;
}

// PATCH /v2/collections/:collection_id/items
export async function updateCollectionItems(
  collectionId: string,
  updates: Array<{ id: string; fieldData: Record<string, unknown> }>
): Promise<unknown> {
  return webflowFetch(`/collections/${collectionId}/items`, {
    method: "PATCH",
    body: JSON.stringify({ items: updates }),
  });
}

// POST /v2/collections/:collection_id/items/publish
export async function publishCollectionItems(
  collectionId: string,
  itemIds: string[]
): Promise<unknown> {
  return webflowFetch(`/collections/${collectionId}/items/publish`, {
    method: "POST",
    body: JSON.stringify({ itemIds }),
  });
}
