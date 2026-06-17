/**
 * EPUB (2 & 3) — structural package model (types only)
 * Created: 2026-06-15  |  Schema version: 1.0.0
 *
 * ZIP entries (see ./zip-container) + META-INF/container.xml + the OPF package
 * (metadata/manifest/spine/guide) + EPUB3 nav / EPUB2 NCX. No functions.
 *
 * Spec: EPUB 3.3 / 2.0.1 (OCF + OPF)
 */
import type { SchemaVersionData } from "../version/schema-version.js";

/** Bespoke schema version for the epub document model. Bump when THIS model changes. */
export const epubSchemaVersion: SchemaVersionData = { major: 1, minor: 0, patch: 0 };

import type { ZipEntry } from "./zip-container.js";
export interface EpubPackage {
  meta: EpubMeta;
  entries: ZipEntry[]; // raw OCF archive entries (mimetype first & stored)
  container: OcfContainer;
  opf: OpfPackage[];
  nav?: EpubNav; // EPUB3 navigation document
  ncx?: EpubNcx; // EPUB2 table of contents
}
export interface EpubMeta {
  schemaVersion: SchemaVersionData;
  epubVersion: "2.0" | "3.0" | "3.2" | "3.3" | string;
}
export interface OcfContainer {
  rootfiles: Array<{ fullPath: string; mediaType: string }>;
  raw?: string; // META-INF/container.xml
}
export interface OpfPackage {
  path: string;
  version: string;
  uniqueIdentifier: string;
  metadata: OpfMetadata;
  manifest: OpfItem[];
  spine: OpfSpine;
  guide?: OpfGuideRef[]; // EPUB2 only
  collections?: unknown[];
  raw?: string;
}
export interface OpfMetadata {
  titles: string[];
  creators: Array<{ name: string; role?: string; fileAs?: string }>;
  identifiers: Array<{ value: string; id?: string; scheme?: string }>;
  languages: string[];
  other: Array<{ name: string; value?: string; attrs?: Record<string, string> }>;
}
export interface OpfItem {
  id: string;
  href: string;
  mediaType: string;
  properties?: string[];
  fallback?: string;
  mediaOverlay?: string;
}
export interface OpfSpine {
  toc?: string;
  pageProgressionDirection?: "ltr" | "rtl" | "default";
  itemrefs: Array<{ idref: string; linear?: boolean; properties?: string[] }>;
}
export interface OpfGuideRef {
  type: string;
  title?: string;
  href: string;
}
export interface EpubNav {
  href: string;
  raw?: string;
}
export interface EpubNcx {
  href: string;
  raw?: string;
}
