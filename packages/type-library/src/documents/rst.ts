/**
 * reStructuredText (.rst) — structural document model (types only)
 * Created: 2026-06-15  |  Schema version: 1.0.0
 *
 * A reconstructable model of an reStructuredText document: sections (by
 * adornment), paragraphs, lists, literal/code blocks, directives, roles,
 * comments, tables, and field lists. Inline kept as raw text. No functions.
 *
 * Spec: docutils reStructuredText
 */
import type { SchemaVersionData } from "../version/schema-version.js";

/** Bespoke schema version for the rst document model. Bump when THIS model changes. */
export const rstSchemaVersion: SchemaVersionData = { major: 1, minor: 0, patch: 0 };

export interface RstDocument {
  meta: RstMeta;
  blocks: RstBlock[];
}
export interface RstMeta {
  schemaVersion: SchemaVersionData;
  lineEnding?: "\n" | "\r\n";
}

export type RstBlock =
  | RstSection
  | { type: "paragraph"; text: string }
  | { type: "bulletList"; bullet: string; items: RstBlock[][] }
  | { type: "enumeratedList"; style?: string; items: RstBlock[][] }
  | { type: "literalBlock"; value: string }
  | { type: "lineBlock"; lines: string[] }
  | { type: "blockQuote"; blocks: RstBlock[] }
  | {
      type: "directive";
      name: string;
      arguments?: string;
      options?: Record<string, string>;
      body?: string;
    }
  | { type: "comment"; value: string }
  | { type: "fieldList"; fields: Array<{ name: string; value: string }> }
  | { type: "table"; style: "grid" | "simple"; rows: string[][]; raw?: string }
  | { type: "transition" }
  | { type: "raw"; value: string };
export interface RstSection {
  type: "section";
  /** Section depth inferred from adornment ordering. */
  level: number;
  title: string;
  /** The under/over-line characters used (=, -, ~, ...), preserved for fidelity. */
  adornment?: { underline: string; overline?: boolean };
  blocks: RstBlock[];
}
