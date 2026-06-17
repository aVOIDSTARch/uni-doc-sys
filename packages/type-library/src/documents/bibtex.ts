/**
 * BibTeX (.bib) — structural model (types only)
 * Created: 2026-06-15  |  Schema version: 1.0.0
 *
 * A reconstructable model of a BibTeX database: entries with typed fields,
 * @string macros, @preamble, and comments. Field values keep their delimiter
 * style and concatenation parts for fidelity. No functions.
 *
 * Spec: BibTeX format (+ common biber/biblatex usage)
 */
import type { SchemaVersionData } from "../version/schema-version.js";

/** Bespoke schema version for the bibtex document model. Bump when THIS model changes. */
export const bibtexSchemaVersion: SchemaVersionData = { major: 1, minor: 0, patch: 0 };

export interface BibtexDatabase {
  meta: BibtexMeta;
  nodes: BibtexNode[]; // ordered: entries, strings, preambles, comments
}
export interface BibtexMeta {
  schemaVersion: SchemaVersionData;
  lineEnding?: "\n" | "\r\n";
}

export type BibtexNode = BibtexEntry | BibtexString | BibtexPreamble | BibtexComment;

export interface BibtexEntry {
  type: "entry";
  entryType: string; // "article", "book", "inproceedings", ... (case as written)
  key: string; // citation key
  fields: BibtexField[]; // ordered
  /** Delimiter wrapping the entry body: braces {..} or parens (..). */
  delimiter?: "brace" | "paren";
  raw?: string;
}
export interface BibtexField {
  name: string; // "author", "title", "year", ...
  value: BibtexValue;
}
/** A value may be a single token or a # concatenation of parts. */
export interface BibtexValue {
  parts: BibtexValuePart[];
  /** Decoded/joined string for convenience. */
  text?: string;
}
export interface BibtexValuePart {
  /** "braced" {..}, "quoted" "..", "bare" number, or "macro" reference. */
  kind: "braced" | "quoted" | "bare" | "macro";
  value: string;
}
export interface BibtexString {
  type: "string"; // @string{ name = value }
  name: string;
  value: BibtexValue;
}
export interface BibtexPreamble {
  type: "preamble";
  value: BibtexValue;
}
export interface BibtexComment {
  type: "comment";
  /** @comment{..} vs free text between entries. */
  style: "at" | "implicit";
  value: string;
}
