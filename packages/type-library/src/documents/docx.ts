/**
 * DOCX (OOXML WordprocessingML) — structural model (types only)
 * Created: 2026-06-15  |  Schema version: 1.0.0
 *
 * OPC package (see ./opc) + a high-level WordprocessingML body. Structured nodes
 * cover the common cases; every part keeps raw XML for byte-fidelity. No functions.
 *
 * Spec: ECMA-376 Part 1 — WordprocessingML
 */
import type { SchemaVersionData } from "../version/schema-version.js";

/** Bespoke schema version for the docx document model. Bump when THIS model changes. */
export const docxSchemaVersion: SchemaVersionData = { major: 1, minor: 0, patch: 0 };

import type { OpcPackage, OoxmlCoreProps } from "./opc.js";
export interface DocxDocument {
  meta: DocxMeta;
  package: OpcPackage; // authoritative container
  body?: DocxBody; // parsed view of word/document.xml
  styles?: { raw: string }; // word/styles.xml
  numbering?: { raw: string }; // word/numbering.xml
  coreProperties?: OoxmlCoreProps;
}
export interface DocxMeta {
  schemaVersion: SchemaVersionData;
}

export interface DocxBody {
  blocks: DocxBlock[];
  sectionProperties?: { raw: string }; // final w:sectPr
}
export type DocxBlock = DocxParagraph | DocxTable;
export interface DocxParagraph {
  type: "paragraph";
  styleId?: string;
  properties?: { raw: string }; // w:pPr
  runs: DocxRun[];
}
export interface DocxRun {
  type: "run";
  text?: string;
  properties?: { raw: string }; // w:rPr
  break?: "line" | "page" | "column";
  tab?: boolean;
  drawingRef?: string; // r:embed id (image) into rels
}
export interface DocxTable {
  type: "table";
  properties?: { raw: string }; // w:tblPr
  rows: DocxTableRow[];
}
export interface DocxTableRow {
  cells: DocxTableCell[];
}
export interface DocxTableCell {
  blocks: DocxBlock[];
  properties?: { raw: string };
}
