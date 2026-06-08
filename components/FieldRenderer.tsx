"use client";

import { useState } from "react";
import type { WebflowField } from "@/lib/types";

interface FieldRendererProps {
  field: WebflowField;
  value: unknown;
  onChange: (value: unknown) => void;
  customLabel?: string;
}

const inputBase = "input-base";

function RichTextEditor({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [mode, setMode] = useState<"preview" | "source">("preview");
  const html = value ?? "";

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent">
      <div className="flex items-center gap-0 border-b border-gray-200 bg-gray-50">
        <button
          type="button"
          onClick={() => setMode("preview")}
          className={`px-3 py-1.5 text-xs font-medium transition-colors ${
            mode === "preview"
              ? "bg-white text-gray-900 border-b-2 border-indigo-500 -mb-px"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Preview
        </button>
        <button
          type="button"
          onClick={() => setMode("source")}
          className={`px-3 py-1.5 text-xs font-medium transition-colors ${
            mode === "source"
              ? "bg-white text-gray-900 border-b-2 border-indigo-500 -mb-px"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Edit HTML
        </button>
      </div>

      {mode === "preview" ? (
        <div
          className="richtext-preview px-4 py-3 min-h-[8rem] text-sm bg-white"
          dangerouslySetInnerHTML={{ __html: html || "<p class='text-gray-400 italic'>No content</p>" }}
        />
      ) : (
        <textarea
          value={html}
          onChange={(e) => onChange(e.target.value)}
          rows={10}
          className="w-full px-3 py-3 text-xs font-mono text-gray-700 bg-white resize-y focus:outline-none"
          spellCheck={false}
        />
      )}
    </div>
  );
}

export default function FieldRenderer({ field, value, onChange, customLabel }: FieldRendererProps) {
  const label = customLabel || field.displayName;

  function renderControl() {
    switch (field.type) {
      case "PlainText":
        return (
          <input
            type="text"
            value={(value as string) ?? ""}
            onChange={(e) => onChange(e.target.value)}
            className={inputBase}
          />
        );

      case "RichText":
        return (
          <RichTextEditor
            value={(value as string) ?? ""}
            onChange={onChange}
          />
        );

      case "Bool": {
        const checked = Boolean(value);
        return (
          <button
            type="button"
            role="switch"
            aria-checked={checked}
            onClick={() => onChange(!checked)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors
              focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
              ${checked ? "bg-indigo-600" : "bg-gray-200"}`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform
                ${checked ? "translate-x-6" : "translate-x-1"}`}
            />
          </button>
        );
      }

      case "Number":
        return (
          <input
            type="number"
            value={(value as number) ?? ""}
            onChange={(e) => onChange(e.target.value !== "" ? Number(e.target.value) : null)}
            className={inputBase}
          />
        );

      case "Date": {
        const iso = value as string | null;
        const dateVal = iso ? iso.split("T")[0] : "";
        return (
          <input
            type="date"
            value={dateVal}
            onChange={(e) =>
              onChange(e.target.value ? new Date(e.target.value).toISOString() : null)
            }
            className={inputBase}
          />
        );
      }

      case "DateTime": {
        const iso = value as string | null;
        const dtVal = iso ? iso.slice(0, 16) : "";
        return (
          <input
            type="datetime-local"
            value={dtVal}
            onChange={(e) =>
              onChange(e.target.value ? new Date(e.target.value).toISOString() : null)
            }
            className={inputBase}
          />
        );
      }

      case "ImageRef": {
        const imgObj = value as { url?: string; fileId?: string } | string | null;
        const currentUrl = typeof imgObj === "string" ? imgObj : imgObj?.url ?? "";
        return (
          <div className="space-y-2">
            {currentUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={currentUrl}
                alt="Current"
                className="w-24 h-24 object-cover rounded-lg border border-gray-200"
              />
            )}
            <input
              type="url"
              value={currentUrl}
              onChange={(e) => onChange(e.target.value ? { url: e.target.value } : null)}
              placeholder="https://..."
              className={inputBase}
            />
            <p className="text-xs text-gray-400">Paste an image URL to replace</p>
          </div>
        );
      }

      case "Option": {
        const options = field.validations?.options ?? [];
        return (
          <select
            value={(value as string) ?? ""}
            onChange={(e) => onChange(e.target.value || null)}
            className={inputBase}
          >
            <option value="">— Select —</option>
            {options.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.name}
              </option>
            ))}
          </select>
        );
      }

      case "Link":
        return (
          <input
            type="url"
            value={(value as string) ?? ""}
            onChange={(e) => onChange(e.target.value || null)}
            placeholder="https://..."
            className={inputBase}
          />
        );

      case "Color": {
        const colorVal = (value as string) ?? "#000000";
        return (
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={colorVal.startsWith("#") ? colorVal : "#000000"}
              onChange={(e) => onChange(e.target.value)}
              className="h-10 w-14 rounded-lg border border-gray-300 cursor-pointer p-0.5"
            />
            <input
              type="text"
              value={colorVal}
              onChange={(e) => onChange(e.target.value)}
              placeholder="#000000"
              className={`${inputBase} w-36`}
            />
          </div>
        );
      }

      case "Phone":
        return (
          <input
            type="tel"
            value={(value as string) ?? ""}
            onChange={(e) => onChange(e.target.value)}
            className={inputBase}
          />
        );

      case "Email":
        return (
          <input
            type="email"
            value={(value as string) ?? ""}
            onChange={(e) => onChange(e.target.value)}
            className={inputBase}
          />
        );

      case "Video":
        return (
          <input
            type="url"
            value={(value as string) ?? ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://youtube.com/watch?v=..."
            className={inputBase}
          />
        );

      case "FileRef":
      case "ExtFileRef": {
        const fileObj = value as { url?: string } | string | null;
        const fileUrl = typeof fileObj === "string" ? fileObj : fileObj?.url ?? "";
        return (
          <div className="space-y-2">
            {fileUrl && (
              <a href={fileUrl} target="_blank" rel="noopener noreferrer"
                className="text-sm text-indigo-600 hover:underline break-all">
                {fileUrl}
              </a>
            )}
            <input
              type="url"
              value={fileUrl}
              onChange={(e) => onChange(e.target.value ? { url: e.target.value } : null)}
              placeholder="https://..."
              className={inputBase}
            />
          </div>
        );
      }

      case "Reference":
      case "MultiReference":
      case "Set":
      case "User":
        return (
          <div className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-500">
            {field.type === "MultiReference" || field.type === "Set"
              ? `${Array.isArray(value) ? (value as unknown[]).length : 0} linked item(s) — edit in Webflow`
              : value
              ? "Linked item — edit in Webflow"
              : "No linked item"}
            <span className="ml-2 text-gray-400 text-xs">(read-only in this editor)</span>
          </div>
        );

      default:
        return (
          <input
            type="text"
            value={typeof value === "string" ? value : value != null ? JSON.stringify(value) : ""}
            onChange={(e) => onChange(e.target.value)}
            className={inputBase}
          />
        );
    }
  }

  return (
    <div className="space-y-1.5">
      <label className="flex items-baseline gap-1.5 text-sm font-medium text-gray-700">
        {label}
        {field.required && <span className="text-red-500 text-xs">*</span>}
        <span className="text-gray-400 text-xs font-normal">{field.slug}</span>
      </label>
      {renderControl()}
    </div>
  );
}
