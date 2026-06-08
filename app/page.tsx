import { getCollections } from "@/lib/webflow";
import { clientConfig } from "@/config/collections";
import HomeContent from "@/components/HomeContent";

export default async function HomePage() {
  // Check env vars first so we show a helpful setup screen instead of a crash
  if (!process.env.WEBFLOW_API_TOKEN || !process.env.WEBFLOW_SITE_ID) {
    return <SetupScreen />;
  }

  let collections: Array<{ id: string; displayName: string; slug: string; configLabel?: string }> = [];
  let fetchError: string | null = null;

  try {
    const raw = await getCollections();
    collections = raw.map((c) => ({
      id: c.id,
      displayName: c.displayName,
      slug: c.slug,
      configLabel: clientConfig[c.id]?.label,
    }));
  } catch (err) {
    fetchError = err instanceof Error ? err.message : "Failed to load collections";
  }

  if (fetchError) {
    return (
      <div className="py-20 text-center">
        <p className="text-sm font-medium text-red-600">API Error</p>
        <p className="text-sm text-gray-500 mt-1">{fetchError}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-10">
        <h1 className="text-2xl font-semibold text-gray-900">What do you want to update?</h1>
        <p className="text-sm text-gray-500 mt-1">Search across all content, or browse by collection below.</p>
      </div>
      <HomeContent collections={collections} />
    </div>
  );
}

function SetupScreen() {
  return (
    <div className="max-w-lg mx-auto py-20">
      <div className="p-8 border border-amber-200 bg-amber-50 rounded-xl">
        <h2 className="text-base font-semibold text-amber-900">Setup Required</h2>
        <p className="text-sm text-amber-800 mt-2">
          Create a <code className="bg-amber-100 px-1 rounded">.env.local</code> file in the project root with:
        </p>
        <pre className="mt-4 p-4 bg-white border border-amber-200 rounded-lg text-xs text-gray-700 overflow-auto">
{`WEBFLOW_API_TOKEN=your_token_here
WEBFLOW_SITE_ID=your_site_id_here`}
        </pre>
        <p className="text-sm text-amber-800 mt-4">
          Then restart the dev server with <code className="bg-amber-100 px-1 rounded">npm run dev</code>.
        </p>
        <p className="text-sm text-amber-700 mt-3">
          See <code className="bg-amber-100 px-1 rounded">README.md</code> for setup instructions.
        </p>
      </div>
    </div>
  );
}
