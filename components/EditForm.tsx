"use client";

import { useState } from "react";
import FieldRenderer from "./FieldRenderer";
import { useToast } from "./Toast";
import type { WebflowField, WebflowItem, ClientCollectionConfig } from "@/lib/types";

const SYSTEM_FIELD_SLUGS = new Set([
  "slug",
  "_id",
  "_cid",
  "created-on",
  "updated-on",
  "published-on",
]);

interface EditFormProps {
  item: WebflowItem;
  fields: WebflowField[];
  collectionId: string;
  collectionConfig?: ClientCollectionConfig;
}

export default function EditForm({ item, fields, collectionId, collectionConfig }: EditFormProps) {
  const { showToast } = useToast();
  const [formData, setFormData] = useState<Record<string, unknown>>({ ...item.fieldData });
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  // Webflow API v2 omits the `editable` property entirely — treat missing as true
  let editableFields = fields.filter((f) => f.editable !== false && !SYSTEM_FIELD_SLUGS.has(f.slug));

  // Apply config visibility filter
  if (collectionConfig?.visibleFields?.length) {
    editableFields = editableFields.filter((f) =>
      collectionConfig.visibleFields!.includes(f.slug)
    );
  }

  const requiredFields = editableFields.filter((f) => f.required);
  const optionalFields = editableFields.filter((f) => !f.required);

  function handleChange(slug: string, val: unknown) {
    setFormData((prev) => ({ ...prev, [slug]: val }));
  }

  async function patchItem(): Promise<void> {
    const res = await fetch(`/api/items/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ collectionId, fieldData: formData }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error ?? "Save failed");
    }
  }

  async function publishItem(): Promise<void> {
    const res = await fetch(`/api/items/${item.id}/publish`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ collectionId }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error ?? "Publish failed");
    }
  }

  async function handleSaveDraft() {
    setIsSaving(true);
    try {
      await patchItem();
      showToast("Saved as draft", "success");
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Save failed", "error");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleSaveAndPublish() {
    setIsPublishing(true);
    try {
      await patchItem();
      try {
        await publishItem();
        showToast("Saved and published", "success");
      } catch {
        showToast("Saved as draft — publish failed. Try again.", "error");
      }
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Save failed", "error");
    } finally {
      setIsPublishing(false);
    }
  }

  const busy = isSaving || isPublishing;

  return (
    <div className="space-y-10">
      {requiredFields.length > 0 && (
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-5">
            Required Fields
          </h2>
          <div className="space-y-5">
            {requiredFields.map((field) => (
              <FieldRenderer
                key={field.id}
                field={field}
                value={formData[field.slug]}
                onChange={(val) => handleChange(field.slug, val)}
                customLabel={collectionConfig?.fieldLabels?.[field.slug]}
              />
            ))}
          </div>
        </section>
      )}

      {optionalFields.length > 0 && (
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-5">
            Optional Fields
          </h2>
          <div className="space-y-5">
            {optionalFields.map((field) => (
              <FieldRenderer
                key={field.id}
                field={field}
                value={formData[field.slug]}
                onChange={(val) => handleChange(field.slug, val)}
                customLabel={collectionConfig?.fieldLabels?.[field.slug]}
              />
            ))}
          </div>
        </section>
      )}

      {editableFields.length === 0 && (
        <p className="text-sm text-gray-500">No editable fields found for this item.</p>
      )}

      <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-100">
        <button onClick={handleSaveDraft} disabled={busy} className="btn-secondary">
          {isSaving ? "Saving…" : "Save Draft"}
        </button>
        <button onClick={handleSaveAndPublish} disabled={busy} className="btn-primary">
          {isPublishing ? "Publishing…" : "Save & Publish"}
        </button>
      </div>
    </div>
  );
}
