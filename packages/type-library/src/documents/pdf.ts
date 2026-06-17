/**
 * PDF — structural document model (types only)
 * Created: 2026-06-15  |  Schema version: 1.0.0
 *
 * A reconstructable model of a PDF's COS object system plus the high-level
 * document structure (catalog -> pages). Binary stream data is held as base64;
 * `raw` escape hatches preserve exact bytes/text where needed. No functions.
 *
 * Spec: ISO 32000-1 (PDF 1.7) / ISO 32000-2 (PDF 2.0)
 */
import type { SchemaVersionData } from "../version/schema-version.js";

/** Bespoke schema version for the pdf document model. Bump when THIS model changes. */
export const pdfSchemaVersion: SchemaVersionData = { major: 1, minor: 0, patch: 0 };
export interface PdfDocument {
  meta: PdfMeta;
  /** All indirect objects, keyed by "num gen" via the array order + ids. */
  objects: PdfIndirectObject[];
  trailer: PdfTrailer;
  xref?: PdfXref;
  /** Optional structured view resolved from the catalog. */
  structure?: PdfStructure;
}

export interface PdfMeta {
  schemaVersion: SchemaVersionData;
  version: string; // "1.7", "2.0"
  /** %PDF- header and trailing %%EOF preserved for fidelity. */
  header?: string;
  binaryMarker?: boolean; // the 2nd-line binary comment most PDFs include
  linearized?: boolean;
  encrypted?: boolean;
}

/** An object referenced as `num gen R`. */
export interface PdfIndirectObject {
  num: number;
  gen: number;
  value: PdfObject;
  offset?: number; // byte offset (for xref reconstruction)
}

/** The COS basic object types. */
export type PdfObject =
  | PdfNull
  | PdfBoolean
  | PdfNumber
  | PdfString
  | PdfName
  | PdfArray
  | PdfDictionary
  | PdfStream
  | PdfReference;

export interface PdfNull {
  type: "null";
}
export interface PdfBoolean {
  type: "boolean";
  value: boolean;
}
export interface PdfNumber {
  type: "number";
  value: number;
  subtype: "integer" | "real";
  raw?: string;
}
export interface PdfString {
  type: "string";
  value: string; // decoded
  encoding: "literal" | "hex";
  raw?: string; // exact bytes incl. (...) or <...>
}
export interface PdfName {
  type: "name";
  value: string;
} // e.g. /Type
export interface PdfArray {
  type: "array";
  items: PdfObject[];
}
export interface PdfDictionary {
  type: "dictionary";
  entries: PdfDictEntry[]; // ordered key/value pairs
}
export interface PdfDictEntry {
  key: string;
  value: PdfObject;
}
export interface PdfStream {
  type: "stream";
  dict: PdfDictionary; // includes /Length, /Filter, ...
  /** Stream bytes, base64-encoded (post or pre filter — see `decoded`). */
  data: string;
  decoded?: boolean; // true if `data` is already filter-decoded
  filters?: string[]; // e.g. ["FlateDecode"]
}
export interface PdfReference {
  type: "ref";
  num: number;
  gen: number;
}

export interface PdfTrailer {
  /** /Root (catalog), /Info, /Size, /ID, /Prev, /Encrypt, ... */
  dict: PdfDictionary;
}

export interface PdfXref {
  style: "table" | "stream";
  /** For "table": classic subsections; for "stream": the xref stream object. */
  raw?: string;
}

/** Optional resolved document structure for convenience. */
export interface PdfStructure {
  catalog: PdfReference;
  info?: PdfInfo;
  xmpMetadata?: string; // XMP packet (XML)
  pages: PdfPage[];
}
export interface PdfInfo {
  title?: string;
  author?: string;
  subject?: string;
  keywords?: string;
  creator?: string;
  producer?: string;
  creationDate?: string; // PDF date string D:YYYYMMDD...
  modDate?: string;
  trapped?: string;
  custom?: Record<string, string>;
}
export interface PdfPage {
  mediaBox?: [number, number, number, number];
  cropBox?: [number, number, number, number];
  rotate?: 0 | 90 | 180 | 270;
  resources?: PdfReference | PdfDictionary;
  contents?: PdfReference[]; // content stream object(s)
  annotations?: PdfReference[];
  raw?: string;
}
