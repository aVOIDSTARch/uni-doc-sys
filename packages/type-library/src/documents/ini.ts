/**
 * INI / TOML-ish config — structural document model (types only)
 * Created: 2026-06-15  |  Schema version: 1.0.0
 *
 * A round-trippable representation of an INI file: ordered sections and
 * properties, comments (; or #), blank lines, delimiter and quote styles.
 * Handles the common dialects (subsections, duplicate keys, array keys).
 * No functions.
 */
import type { SchemaVersionData } from "../version/schema-version.js";

/** Bespoke schema version for the ini document model. Bump when THIS model changes. */
export const iniSchemaVersion: SchemaVersionData = { major: 1, minor: 0, patch: 0 };

export interface IniDocument {
  meta: IniMeta;
  /** Items appearing before the first [section] (the "global" scope). */
  global: IniItem[];
  sections: IniSection[]; // ordered
}

export interface IniMeta {
  schemaVersion: SchemaVersionData;
  lineEnding?: "\n" | "\r\n";
  trailingNewline?: boolean;
  /** Character separating key and value, usually "=" or ":". */
  delimiter?: "=" | ":" | string;
  commentPrefixes?: Array<";" | "#" | string>;
}

export interface IniSection {
  type: "section";
  /** Section name; nested via `path` for [a.b] / [a "b"] dialects. */
  name: string;
  path?: string[];
  items: IniItem[];
  raw?: string;
}

export type IniItem = IniProperty | IniComment | IniBlank;

export interface IniProperty {
  type: "property";
  key: string;
  value: string;
  /** True when the key uses array syntax like `key[]`. */
  isArrayKey?: boolean;
  quote?: "none" | "single" | "double";
  inlineComment?: string;
  raw?: string;
}
export interface IniComment {
  type: "comment";
  prefix: ";" | "#" | string;
  value: string;
}
export interface IniBlank {
  type: "blank";
}
