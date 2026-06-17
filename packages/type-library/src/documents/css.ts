/**
 * CSS — structural document model (types only)
 * Created: 2026-06-15  |  Schema version: 1.0.0
 *
 * A round-trippable CSS representation: ordered rules, at-rules (media, supports,
 * keyframes, font-face, import, ...), declarations with !important, selectors and
 * comments. Values are kept as structured-or-raw so any value is representable.
 * No functions.
 *
 * Spec: CSS Syntax Level 3 (+ Paged Media @page for your pipeline)
 */
import type { SchemaVersionData } from "../version/schema-version.js";

/** Bespoke schema version for the css document model. Bump when THIS model changes. */
export const cssSchemaVersion: SchemaVersionData = { major: 1, minor: 0, patch: 0 };

export interface CssStylesheet {
  meta: CssMeta;
  rules: CssNode[]; // ordered
}

export interface CssMeta {
  schemaVersion: SchemaVersionData;
  lineEnding?: "\n" | "\r\n";
  trailingNewline?: boolean;
  charset?: string; // from @charset
}

export type CssNode = CssStyleRule | CssAtRule | CssComment;

export interface CssStyleRule {
  type: "rule";
  selectors: CssSelector[]; // comma-separated selector list
  declarations: CssDeclarationItem[];
  raw?: string;
}
export interface CssSelector {
  text: string; // full selector text, e.g. "a.btn:hover > span"
  raw?: string;
}

export type CssDeclarationItem = CssDeclaration | CssComment;
export interface CssDeclaration {
  type: "declaration";
  property: string; // e.g. "color", "--custom-prop"
  value: CssValue;
  important?: boolean;
  raw?: string;
}

/** Structured tokens when known; `raw` always carries the exact text. */
export interface CssValue {
  raw: string; // authoritative text, e.g. "1px solid #000"
  tokens?: CssToken[]; // optional structured breakdown
}
export type CssToken =
  | { type: "keyword"; value: string }
  | { type: "dimension"; value: number; unit: string }
  | { type: "number"; value: number }
  | { type: "percentage"; value: number }
  | { type: "string"; value: string }
  | { type: "color"; value: string }
  | { type: "function"; name: string; args: CssToken[] }
  | { type: "url"; value: string }
  | { type: "var"; name: string; fallback?: CssToken[] }
  | { type: "operator"; value: "," | "/" | "+" | "-" | "*" | string }
  | { type: "raw"; value: string };

/**
 * At-rules cover both block forms (@media { ... }) and statement forms
 * (@import "x";). `block` is present for block forms.
 */
export interface CssAtRule {
  type: "atrule";
  name: string; // "media", "supports", "keyframes", "page", "import", ...
  prelude: string; // text between the name and the block/semicolon
  block?: CssNode[]; // nested rules/declarations for block at-rules
  /** For declaration-bearing at-rules like @font-face / @page. */
  declarations?: CssDeclarationItem[];
  raw?: string;
}

export interface CssComment {
  type: "comment";
  value: string;
}
