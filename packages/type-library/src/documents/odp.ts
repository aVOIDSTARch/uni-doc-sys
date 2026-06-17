/**
 * ODP (OpenDocument Presentation) — structural model (types only)
 * Created: 2026-06-15  |  Schema version: 1.0.0
 *
 * ODF container (see ./odf) + a high-level deck (pages -> frames -> text/images).
 * content.xml authoritative via raw. No functions.
 *
 * Spec: OpenDocument 1.3 — Presentation
 */
import type { SchemaVersionData } from "../version/schema-version.js";

/** Bespoke schema version for the odp document model. Bump when THIS model changes. */
export const odpSchemaVersion: SchemaVersionData = { major: 1, minor: 0, patch: 0 };

import type { OdfContainer } from "./odf.js";
export interface OdpDocument {
  meta: { schemaVersion: SchemaVersionData };
  container: OdfContainer;
  pages?: OdpPage[];
}
export interface OdpPage {
  name?: string;
  masterPageName?: string;
  frames: OdpFrame[];
  raw?: string;
}
export interface OdpFrame {
  type: "text" | "image" | "other";
  width?: string;
  height?: string;
  x?: string;
  y?: string;
  /** For text frames: paragraphs of spans. */
  paragraphs?: Array<{ spans: Array<{ text: string; styleName?: string }> }>;
  imageHref?: string; // for image frames
  raw?: string;
}
