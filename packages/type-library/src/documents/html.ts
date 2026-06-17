/**
 * HTML — structural document model (types only)
 * Created: 2026-06-15  |  Schema version: 1.0.0
 *
 * A round-trippable HTML representation (DOM/hast-inspired): doctype, elements
 * with ordered attributes and quote styles, text, comments, raw-text elements
 * (script/style) and whitespace fidelity. No functions.
 *
 * Spec: WHATWG HTML
 */
import type { SchemaVersionData } from "../version/schema-version.js";

/** Bespoke schema version for the html document model. Bump when THIS model changes. */
export const htmlSchemaVersion: SchemaVersionData = { major: 1, minor: 0, patch: 0 };

export interface HtmlDocument {
  meta: HtmlMeta;
  doctype?: HtmlDoctype;
  /** Nodes before/around <html>, in order (comments, whitespace). */
  children: HtmlNode[]; // typically [doctype-handled-above, <html>]
}

export interface HtmlMeta {
  schemaVersion: SchemaVersionData;
  encoding?: string; // from <meta charset>
  lineEnding?: "\n" | "\r\n";
  trailingNewline?: boolean;
  /** "html" (HTML5) vs "xhtml" serialization rules. */
  mode?: "html" | "xhtml";
}

export interface HtmlDoctype {
  type: "doctype";
  name: string; // "html"
  publicId?: string;
  systemId?: string;
  raw?: string;
}

export type HtmlNode = HtmlElement | HtmlText | HtmlComment | HtmlRawText;

export interface HtmlElement {
  type: "element";
  tagName: string; // lowercased canonical name
  attributes: HtmlAttribute[]; // ordered; duplicates preserved
  children: HtmlNode[];
  /** Void elements (br, img, input, ...) have no children/closing tag. */
  void?: boolean;
  /** Whether the source used a self-closing slash (<br/>). */
  selfClosing?: boolean;
  /** Namespace for embedded foreign content. */
  namespace?: "html" | "svg" | "mathml";
  raw?: string;
}
export interface HtmlAttribute {
  name: string;
  /** Boolean attributes (e.g. `disabled`) have value === null. */
  value: string | null;
  quote?: "double" | "single" | "none";
}
export interface HtmlText {
  type: "text";
  value: string; // decoded (entities resolved)
  raw?: string; // original incl. entities
}
export interface HtmlComment {
  type: "comment";
  value: string;
  /** Conditional comments / bogus comments preserved via raw. */
  raw?: string;
}
/** Contents of <script> and <style> are not parsed as HTML. */
export interface HtmlRawText {
  type: "rawtext";
  tagName: "script" | "style" | "textarea" | "title" | string;
  value: string;
}
