export type WebflowFieldType =
  | "PlainText"
  | "RichText"
  | "Bool"
  | "Number"
  | "Date"
  | "DateTime"
  | "ImageRef"
  | "Option"
  | "Link"
  | "Color"
  | "Reference"
  | "MultiReference"
  | "FileRef"
  | "Set"
  | "User"
  | "Phone"
  | "Email"
  | "Video"
  | string;

export interface WebflowFieldValidations {
  options?: Array<{ id: string; name: string }>;
  collectionId?: string;
  maxLength?: number;
  min?: number;
  max?: number;
  allowedFileTypes?: string[];
}

export interface WebflowField {
  id: string;
  displayName: string;
  slug: string;
  type: WebflowFieldType;
  required: boolean;
  editable: boolean;
  validations?: WebflowFieldValidations;
}

export interface WebflowCollection {
  id: string;
  displayName: string;
  slug: string;
  fields?: WebflowField[];
  lastUpdated?: string;
  createdOn?: string;
  singularName?: string;
}

export interface WebflowItem {
  id: string;
  cmsLocaleId?: string;
  lastUpdated?: string;
  createdOn?: string;
  isArchived: boolean;
  isDraft: boolean;
  fieldData: Record<string, unknown>;
}

export interface CollectionWithItems {
  collection: WebflowCollection;
  fields: WebflowField[];
  items: WebflowItem[];
  total: number;
}

export interface SearchResultItem {
  item: WebflowItem;
  collection: { id: string; displayName: string };
}

export interface ClientCollectionConfig {
  label?: string;
  visibleFields?: string[];
  fieldLabels?: Record<string, string>;
}

export interface ClientConfig {
  [collectionId: string]: ClientCollectionConfig;
}
