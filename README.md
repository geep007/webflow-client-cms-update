# Webflow CMS Editor

A simplified, client-facing CMS editor built on Next.js 14 + Webflow Data API v2. Clients search and edit content without ever touching the Webflow dashboard.

---

## Quick Start

```bash
npm install
cp .env.local.example .env.local
# fill in your token and site ID (see below)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Getting Your Credentials

### Webflow API Token

1. Go to [Webflow Dashboard](https://webflow.com/dashboard)
2. Open the site you want to manage
3. Navigate to **Site Settings → Apps & Integrations → API Access**
4. Click **Generate API Token**
5. Required scopes: **`cms:read`** and **`cms:write`**
6. Copy the token into `.env.local` as `WEBFLOW_API_TOKEN`

### Webflow Site ID

1. In the Webflow Dashboard, open your site
2. Go to **Site Settings → General**
3. Copy the **Site ID** (long alphanumeric string)
4. Add it to `.env.local` as `WEBFLOW_SITE_ID`

Alternatively, find the Site ID in your dashboard URL:
`webflow.com/dashboard/sites/<SITE_ID>/...`

### Finding Collection IDs

Collection IDs appear in the Webflow Dashboard URL when viewing a collection:
`webflow.com/dashboard/sites/<site_id>/database/<COLLECTION_ID>`

You can also call the API directly:
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://api.webflow.com/v2/sites/YOUR_SITE_ID/collections
```

---

## Configuring Visible Fields

Edit `config/collections.ts` to control what clients see:

```ts
export const clientConfig: ClientConfig = {
  "your-collection-id-here": {
    label: "Blog Posts",                           // Override the display name
    visibleFields: ["name", "post-body", "cover-image"],  // Only show these fields
    fieldLabels: {
      "post-body": "Article Content",              // Rename fields for the client
      "cover-image": "Cover Photo",
    },
  },
};
```

- If a collection is **not in the config**, all editable fields are shown.
- If `visibleFields` is set, only those slugs are shown (in the order they appear in Webflow's schema).
- Field slugs match the Webflow field slug exactly (check in Webflow's Collection Settings → Fields).

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `WEBFLOW_API_TOKEN` | Yes | Webflow API token with `cms:read` + `cms:write` |
| `WEBFLOW_SITE_ID` | Yes | Webflow Site ID |

---

## Deployment (Vercel)

1. Push the repo to GitHub
2. Import in [Vercel](https://vercel.com)
3. Add environment variables in **Project Settings → Environment Variables**
4. Deploy

The app has no user authentication — share the URL privately with your client.

---

## Architecture Notes

- All Webflow API calls are **server-side only** (API routes + server components). The token never reaches the browser.
- Items endpoint uses `/items` (not `/items/live`) so draft items are visible and editable.
- Search fetches the first 100 items per collection in parallel — works well for typical sites. For sites with thousands of items per collection, consider adding a dedicated search endpoint or Webflow's native search.
- Rate limit: Webflow allows 120 req/min on CMS/Business plans. The search is debounced 300ms client-side.
- Pagination is implemented on the collection detail page (100 items per page).

---

## Project Structure

```
app/
  api/
    collections/          GET  — list all collections
    collections/[id]/     GET  — collection schema + items
    items/[id]/           PATCH — update item fields
    items/[id]/publish/   POST  — publish item live
    search/               GET  — full-text search across collections
  page.tsx                Home: search hero + collection grid
  collection/[id]/        All items in one collection
  edit/[collectionId]/[itemId]/  Edit form for a single item
components/
  HomeContent.tsx         Client component — search state + results
  SearchBar.tsx
  CollectionCard.tsx
  ItemCard.tsx
  EditForm.tsx
  FieldRenderer.tsx       Renders each field type correctly
  Toast.tsx               Success/error notifications
config/
  collections.ts          Developer-controlled field visibility
lib/
  webflow.ts              All Webflow API fetch functions
  types.ts                TypeScript interfaces
```
