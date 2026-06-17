/**
 * CSV / TSV / DSV — structural document model (types only)
 * Created: 2026-06-15  |  Schema version: 1.0.0
 *
 * A round-trippable representation of delimiter-separated data: the dialect
 * (delimiter, quoting, line terminator, escaping) plus ordered rows and fields
 * with per-field quoting info, so the exact file can be rebuilt. No functions.
 *
 * Spec: RFC 4180 (+ common dialect extensions)
 */
import type { SchemaVersionData } from "../version/schema-version.js";

/** Bespoke schema version for the csv document model. Bump when THIS model changes. */
export const csvSchemaVersion: SchemaVersionData = { major: 1, minor: 0, patch: 0 };

export interface CsvDocument {
  meta: CsvMeta;
  dialect: CsvDialect;
  /** Optional header row, kept separate from data rows. */
  header?: CsvRow;
  rows: CsvRow[];
}

export interface CsvMeta {
  schemaVersion: SchemaVersionData;
  encoding?: string; // e.g. "utf-8"
  bom?: boolean;
  hasHeader?: boolean;
}

export interface CsvDialect {
  delimiter: string; // "," | "\t" | ";" | "|" | ...
  quoteChar: string; // usually '"'
  /** Escaping style: RFC 4180 doubles the quote; some dialects use a backslash. */
  escape: "double-quote" | "backslash" | "none";
  escapeChar?: string; // when escape === "backslash"
  lineTerminator: "\n" | "\r\n" | "\r";
  /** Whether to skip whitespace immediately after a delimiter. */
  skipInitialSpace?: boolean;
  trailingNewline?: boolean;
  /** A leading comment-line marker some dialects allow (e.g. "#"). */
  commentPrefix?: string;
}

export interface CsvRow {
  type: "row";
  fields: CsvField[];
  /** True for a comment line (when dialect.commentPrefix is set). */
  comment?: string;
  raw?: string;
}
export interface CsvField {
  value: string; // decoded value
  /** Whether this field was/should be quoted on serialization. */
  quoted?: boolean;
  raw?: string; // original text incl. quotes/escapes
}
