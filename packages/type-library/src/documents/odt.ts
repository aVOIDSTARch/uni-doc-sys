/**
 * ODT (OpenDocument Text) — structural model (types only)
 * Created: 2026-06-15  |  Schema version: 1.0.0
 *
 * ODF container (see ./odf) + a high-level text body (headings, paragraphs,
 * lists, tables, frames/images). content.xml stays authoritative via raw. No functions.
 *
 * Spec: OpenDocument 1.3 — Text
 */
import type { SchemaVersionData } from "../version/schema-version.js";

/** Bespoke schema version for the odt document model. Bump when THIS model changes. */
export const odtSchemaVersion: SchemaVersionData = { major: 1, minor: 0, patch: 0 };

import type { OdfContainer } from "./odf.js";
export interface OdtDocument {
  meta: { schemaVersion: SchemaVersionData };
  container: OdfContainer;
  body?: OdtBody;
}
export interface OdtBody {
  blocks: OdtBlock[];
}
export type OdtBlock = OdtHeading | OdtParagraph | OdtList | OdtTable | OdtFrame;
export interface OdtHeading {
  type: "heading";
  level: number;
  styleName?: string;
  spans: OdtSpan[];
}
export interface OdtParagraph {
  type: "paragraph";
  styleName?: string;
  spans: OdtSpan[];
}
export interface OdtSpan {
  text: string;
  styleName?: string;
} // text:span
export interface OdtList {
  type: "list";
  styleName?: string;
  items: OdtListItem[];
  ordered?: boolean;
}
export interface OdtListItem {
  blocks: OdtBlock[];
}
export interface OdtTable {
  type: "table";
  name?: string;
  rows: OdtTableRow[];
  styleName?: string;
}
export interface OdtTableRow {
  cells: OdtTableCell[];
}
export interface OdtTableCell {
  blocks: OdtBlock[];
}
export interface OdtFrame {
  // draw:frame (images, text boxes)
  type: "frame";
  name?: string;
  width?: string;
  height?: string;
  /** Embedded image href into the package (Pictures/...) or external. */
  imageHref?: string;
  raw?: string;
}
