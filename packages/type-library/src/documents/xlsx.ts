/**
 * XLSX (OOXML SpreadsheetML) — structural model (types only)
 * Created: 2026-06-15  |  Schema version: 1.0.0
 *
 * OPC package (see ./opc) + a high-level workbook (sheets, rows, typed cells,
 * formulas, shared strings). Full styling lives in raw parts. No functions.
 *
 * Spec: ECMA-376 — SpreadsheetML
 */
import type { SchemaVersionData } from "../version/schema-version.js";

/** Bespoke schema version for the xlsx document model. Bump when THIS model changes. */
export const xlsxSchemaVersion: SchemaVersionData = { major: 1, minor: 0, patch: 0 };

import type { OpcPackage, OoxmlCoreProps } from "./opc.js";
export interface XlsxDocument {
  meta: XlsxMeta;
  package: OpcPackage;
  workbook?: XlsxWorkbook;
  worksheets?: XlsxWorksheet[];
  sharedStrings?: string[]; // xl/sharedStrings.xml (index-addressed)
  styles?: { raw: string }; // xl/styles.xml
  coreProperties?: OoxmlCoreProps;
}
export interface XlsxMeta {
  schemaVersion: SchemaVersionData;
}

export interface XlsxWorkbook {
  sheets: Array<{
    name: string;
    sheetId: number;
    relId: string;
    state?: "visible" | "hidden" | "veryHidden";
  }>;
  definedNames?: Array<{ name: string; value: string }>;
  raw?: string;
}
export interface XlsxWorksheet {
  name: string;
  partName: string; // "/xl/worksheets/sheet1.xml"
  dimension?: string; // "A1:D20"
  columns?: Array<{ min: number; max: number; width?: number; hidden?: boolean }>;
  rows: XlsxRow[];
  merges?: string[]; // ["A1:B1", ...]
  raw?: string;
}
export interface XlsxRow {
  index: number;
  height?: number;
  cells: XlsxCell[];
}
export interface XlsxCell {
  ref: string; // "A1"
  type: "n" | "s" | "str" | "b" | "e" | "inlineStr" | "d";
  value?: string | number | boolean;
  sharedIndex?: number; // index into sharedStrings (type "s")
  formula?: string;
  styleIndex?: number;
}
