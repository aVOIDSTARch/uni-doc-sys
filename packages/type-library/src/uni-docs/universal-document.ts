/**
 * universal-document — the pivot IR (Tier 2 core)
 * Created: 2026-06-15  |  Schema version: 1.0.0
 *
 * The single intermediate representation every adapter converts to and from.
 * N adapters give N-to-N translation through this hub, never an O(N^2) mesh.
 *
 * SEPARATION OF PARTS (P2): four independent concerns as distinct top-level
 * fields, so an adapter can extract/emit each cleanly:
 *   1. meta       — descriptive metadata
 *   2. resources  — binary/external assets, addressed by id (never inlined)
 *   3. body       — content + structure (block/inline tree, incl. Section)
 *   4. original   — per-format residue sidecar for near-lossless same-format trips
 *
 * Spec: uni-doc-hub-design.md §4.5
 */

import type { SchemaVersionData } from "../version/schema-version.js";

/** Bespoke schema version for the atom document model. Bump when THIS model changes. */
export const uniDocSchemaVersion: SchemaVersionData = { major: 1, minor: 0, patch: 0 };

export interface UniversalDocument {
  /** Which UniDoc IR schema this instance was built against. */
  schemaVersion: SchemaVersionData;
  meta: DocMeta;
  resources: Resource[];
  body: Block[];
  /** Per-format residue keyed by format id, e.g. original["docx"]. */
  original?: Record<string, unknown>;
}

/* =============================== 1. META =============================== */
export interface DocMeta {
  title?: string;
  subtitle?: string;
  authors?: Person[];
  contributors?: Person[];
  language?: string; // BCP-47
  description?: string;
  keywords?: string[];
  publisher?: string;
  rights?: string;
  identifiers?: Array<{ scheme?: string; value: string }>;
  dates?: { created?: string; modified?: string; published?: string };
  custom?: Record<string, string>;
}
export interface Person {
  name: string;
  sortAs?: string;
  role?: string;
  email?: string;
  uri?: string;
}

/* ============================= 2. RESOURCES =========================== */
export interface Resource {
  id: string;
  mediaType: string; // "image/png", "font/woff2", ...
  role?: "image" | "font" | "audio" | "video" | "stylesheet" | "other";
  /** Provide exactly one: embedded base64 OR an external/relative href. */
  data?: string;
  href?: string;
  name?: string;
  width?: number;
  height?: number;
  source?: Record<string, unknown>;
}

/* ===================== 3. BODY: structure + content ================== */
export interface Attr {
  id?: string;
  classes?: string[];
  attributes?: Record<string, string>;
  /** Per-node format-specific residue for same-format fidelity. */
  source?: Record<string, unknown>;
}

export type Block =
  | Section
  | Heading
  | Paragraph
  | BlockList
  | DefinitionList
  | Table
  | CodeBlock
  | BlockQuote
  | Figure
  | ThematicBreak
  | MathBlock
  | RawBlock;

/** Chapter/section container; carries structural nesting independent of level. */
export interface Section {
  type: "section";
  level: number;
  heading?: Inline[];
  content: Block[];
  attr?: Attr;
}
export interface Heading {
  type: "heading";
  level: 1 | 2 | 3 | 4 | 5 | 6;
  content: Inline[];
  attr?: Attr;
}
export interface Paragraph {
  type: "paragraph";
  content: Inline[];
  attr?: Attr;
}
export interface BlockList {
  type: "list";
  ordered: boolean;
  start?: number;
  tight?: boolean;
  items: ListItem[];
  attr?: Attr;
}
export interface ListItem {
  checked?: boolean;
  content: Block[];
}
export interface DefinitionList {
  type: "definitionList";
  items: Array<{ term: Inline[]; definitions: Block[][] }>;
  attr?: Attr;
}
export interface Table {
  type: "table";
  caption?: Inline[];
  align?: Array<"left" | "center" | "right" | "default">;
  head?: TableRow[];
  body: TableRow[];
  foot?: TableRow[];
  attr?: Attr;
}
export interface TableRow {
  cells: TableCell[];
}
export interface TableCell {
  content: Block[];
  colspan?: number;
  rowspan?: number;
  align?: "left" | "center" | "right" | "default";
}
export interface CodeBlock {
  type: "codeBlock";
  language?: string;
  code: string;
  attr?: Attr;
}
export interface BlockQuote {
  type: "blockQuote";
  content: Block[];
  attr?: Attr;
}
export interface Figure {
  type: "figure";
  resourceRef: string;
  caption?: Inline[];
  alt?: string;
  attr?: Attr;
}
export interface ThematicBreak {
  type: "thematicBreak";
}
export interface MathBlock {
  type: "mathBlock";
  value: string;
  notation?: "tex" | "mathml" | string;
}
export interface RawBlock {
  type: "rawBlock";
  format: string;
  value: string;
}

/* ----------------------------- inline ------------------------------- */
export type Inline =
  | TextRun
  | Styled
  | CodeSpan
  | LinkSpan
  | ImageSpan
  | LineBreak
  | MathInline
  | FootnoteRef
  | RawInline
  | GenericSpan;

export interface TextRun {
  type: "text";
  value: string;
}
export interface Styled {
  type:
    | "emphasis"
    | "strong"
    | "strikethrough"
    | "underline"
    | "subscript"
    | "superscript"
    | "smallcaps";
  content: Inline[];
}
export interface CodeSpan {
  type: "code";
  value: string;
  attr?: Attr;
}
export interface LinkSpan {
  type: "link";
  href: string;
  title?: string;
  content: Inline[];
  attr?: Attr;
}
export interface ImageSpan {
  type: "image";
  resourceRef: string;
  alt?: string;
  title?: string;
  attr?: Attr;
}
export interface LineBreak {
  type: "lineBreak";
  hard?: boolean;
}
export interface MathInline {
  type: "mathInline";
  value: string;
  notation?: "tex" | "mathml" | string;
}
export interface FootnoteRef {
  type: "footnote";
  content: Block[];
  identifier?: string;
}
export interface RawInline {
  type: "rawInline";
  format: string;
  value: string;
}
export interface GenericSpan {
  type: "span";
  content: Inline[];
  attr?: Attr;
}
