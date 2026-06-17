/**
 * ODS (OpenDocument Spreadsheet) — structural model (types only)
 * Created: 2026-06-15  |  Schema version: 1.0.0
 *
 * ODF container (see ./odf) + a high-level spreadsheet (tables -> rows -> typed
 * cells with formulas). content.xml authoritative via raw. No functions.
 *
 * Spec: OpenDocument 1.3 — Spreadsheet
 */
import type { SchemaVersionData } from "../version/schema-version.js";

/** Bespoke schema version for the ods document model. Bump when THIS model changes. */
export const odsSchemaVersion: SchemaVersionData = { major: 1, minor: 0, patch: 0 };

import type { OdfContainer } from "./odf.js";
export interface OdsDocument {
  meta: { schemaVersion: SchemaVersionData };
  container: OdfContainer;
  tables?: OdsTable[];
}
export interface OdsTable {
  name: string;
  rows: OdsRow[];
  raw?: string;
}
export interface OdsRow {
  cells: OdsCell[];
  repeated?: number;
}
export interface OdsCell {
  /** office:value-type */
  valueType?: "float" | "percentage" | "currency" | "date" | "time" | "boolean" | "string";
  value?: string | number | boolean; // typed value
  text?: string; // displayed text
  formula?: string; // table:formula (e.g. "of:=SUM(...)")
  repeated?: number; // number-columns-repeated
  styleName?: string;
}
