import type { ClientConfig } from "@/lib/types";

// Developer-controlled visibility config.
// Add a collection's ID as a key to restrict what the client can see/edit.
// If a collection ID is NOT listed here, all editable fields are shown.
//
// Find your collection IDs by calling GET /v2/sites/:site_id/collections,
// or check the Webflow dashboard URL when viewing a collection.
//
// Example:
// export const clientConfig: ClientConfig = {
//   "64f1a2b3c4d5e6f7a8b9c0d1": {
//     label: "Blog Posts",                        // Override display name
//     visibleFields: ["name", "post-body", "thumbnail-image", "published-date"],
//     fieldLabels: {
//       "post-body": "Article Content",
//       "thumbnail-image": "Cover Image",
//     },
//   },
//   "64f1a2b3c4d5e6f7a8b9c0d2": {
//     label: "Team Members",
//     visibleFields: ["name", "bio", "photo", "role"],
//     fieldLabels: {
//       "photo": "Profile Picture",
//     },
//   },
// };

export const clientConfig: ClientConfig = {};
