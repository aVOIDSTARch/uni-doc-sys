/**
 * Markdown (CommonMark + GFM) — structural document model (types only)
 * Created: 2026-06-15  |  Schema version: 1.0.0
 *
 * A round-trippable Markdown representation (mdast-inspired): block and inline
 * nodes, frontmatter, GFM tables/task-lists/strikethrough/footnotes, and a raw
 * escape hatch for embedded HTML or exotic constructs. No functions.
 *
 * Spec: CommonMark 0.31 + GitHub Flavored Markdown
 */
import type { SchemaVersionData } from "../version/schema-version.js";

/** Bespoke schema version for the markdown document model. Bump when THIS model changes. */
export const markdownSchemaVersion: SchemaVersionData = { major: 1, minor: 0, patch: 0 };

export interface MarkdownDocument {
  meta: MarkdownMeta;
  frontmatter?: Frontmatter;
  children: BlockNode[]; // ordered block content
}

export interface MarkdownMeta {
  schemaVersion: SchemaVersionData;
  lineEnding?: "\n" | "\r\n";
  trailingNewline?: boolean;
  flavor?: "commonmark" | "gfm";
}

export interface Frontmatter {
  type: "frontmatter";
  format: "yaml" | "toml" | "json";
  /** Raw frontmatter text (parse with the matching format model if needed). */
  value: string;
}

export type BlockNode =
  | Heading
  | Paragraph
  | Blockquote
  | List
  | ListItem
  | CodeBlock
  | ThematicBreak
  | Table
  | HtmlBlock
  | Definition
  | FootnoteDefinition;

export interface Heading {
  type: "heading";
  depth: 1 | 2 | 3 | 4 | 5 | 6;
  /** "atx" (#) vs "setext" (underline) form. */
  style?: "atx" | "setext";
  children: InlineNode[];
}
export interface Paragraph {
  type: "paragraph";
  children: InlineNode[];
}
export interface Blockquote {
  type: "blockquote";
  children: BlockNode[];
}
export interface List {
  type: "list";
  ordered: boolean;
  start?: number; // first number for ordered lists
  tight?: boolean; // loose vs tight spacing
  marker?: "-" | "*" | "+" | "." | ")";
  children: ListItem[];
}
export interface ListItem {
  type: "listItem";
  /** GFM task list: undefined = not a task, else checked state. */
  checked?: boolean;
  children: BlockNode[];
}
export interface CodeBlock {
  type: "code";
  /** "fenced" (```), or "indented". */
  style?: "fenced" | "indented";
  fence?: "```" | "~~~" | string;
  lang?: string;
  meta?: string; // info-string after the language
  value: string;
}
export interface ThematicBreak {
  type: "thematicBreak";
  marker?: string;
}
export interface HtmlBlock {
  type: "html";
  value: string;
}
export interface Definition {
  type: "definition";
  identifier: string;
  url: string;
  title?: string;
}
export interface FootnoteDefinition {
  type: "footnoteDefinition";
  identifier: string;
  children: BlockNode[];
}

export interface Table {
  type: "table";
  align: Array<"left" | "right" | "center" | null>;
  rows: TableRow[]; // first row is the header
}
export interface TableRow {
  type: "tableRow";
  cells: TableCell[];
}
export interface TableCell {
  type: "tableCell";
  children: InlineNode[];
}

export type InlineNode =
  | Text
  | Emphasis
  | Strong
  | Delete
  | InlineCode
  | Link
  | Image
  | LinkReference
  | ImageReference
  | FootnoteReference
  | HardBreak
  | InlineHtml;

export interface Text {
  type: "text";
  value: string;
}
export interface Emphasis {
  type: "emphasis";
  marker?: "*" | "_";
  children: InlineNode[];
}
export interface Strong {
  type: "strong";
  marker?: "**" | "__";
  children: InlineNode[];
}
export interface Delete {
  type: "delete";
  children: InlineNode[];
} // GFM ~~strike~~
export interface InlineCode {
  type: "inlineCode";
  value: string;
}
export interface Link {
  type: "link";
  url: string;
  title?: string;
  children: InlineNode[];
}
export interface Image {
  type: "image";
  url: string;
  title?: string;
  alt: string;
}
export interface LinkReference {
  type: "linkReference";
  identifier: string;
  referenceType: "full" | "collapsed" | "shortcut";
  children: InlineNode[];
}
export interface ImageReference {
  type: "imageReference";
  identifier: string;
  referenceType: "full" | "collapsed" | "shortcut";
  alt: string;
}
export interface FootnoteReference {
  type: "footnoteReference";
  identifier: string;
}
export interface HardBreak {
  type: "break";
  /* trailing \\ or two spaces */ style?: "backslash" | "spaces";
}
export interface InlineHtml {
  type: "html";
  value: string;
}
