/**
 * Org-mode (.org) — structural document model (types only)
 * Created: 2026-06-15  |  Schema version: 1.0.0
 *
 * A reconstructable model of an Org document: the headline outline (with TODO
 * keywords, tags, priorities, properties, planning), plus section content
 * (paragraphs, lists, tables, blocks, keywords). No functions.
 *
 * Spec: Org mode (Emacs) syntax
 */
import type { SchemaVersionData } from "../version/schema-version.js";

/** Bespoke schema version for the org document model. Bump when THIS model changes. */
export const orgSchemaVersion: SchemaVersionData = { major: 1, minor: 0, patch: 0 };

export interface OrgDocument {
  meta: OrgMeta;
  /** In-buffer settings like #+TITLE:, #+AUTHOR:, #+OPTIONS: */
  keywords: OrgKeyword[];
  /** Content before the first headline. */
  preamble: OrgBlockNode[];
  headlines: OrgHeadline[];
}
export interface OrgMeta {
  schemaVersion: SchemaVersionData;
  lineEnding?: "\n" | "\r\n";
}
export interface OrgKeyword {
  key: string;
  value: string;
} // #+KEY: value

export interface OrgHeadline {
  type: "headline";
  level: number; // number of leading stars
  todo?: string; // TODO / DONE / custom keyword
  priority?: string; // [#A]
  title: string;
  tags?: string[];
  commented?: boolean; // COMMENT keyword
  planning?: { scheduled?: string; deadline?: string; closed?: string };
  properties?: Record<string, string>; // :PROPERTIES: drawer
  content: OrgBlockNode[];
  children: OrgHeadline[];
}

export type OrgBlockNode =
  | { type: "paragraph"; text: string }
  | { type: "list"; ordered: boolean; items: OrgListItem[] }
  | { type: "table"; rows: string[][]; raw?: string }
  | { type: "block"; name: string; params?: string; value: string } // #+BEGIN_xxx
  | { type: "drawer"; name: string; value: string }
  | { type: "comment"; value: string }
  | { type: "raw"; value: string };
export interface OrgListItem {
  checkbox?: "todo" | "done" | "partial";
  text: string;
  children?: OrgBlockNode[];
}
