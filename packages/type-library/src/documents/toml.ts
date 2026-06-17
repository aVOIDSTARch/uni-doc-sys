/**
 * TOML — structural document model (types only)
 * Created: 2026-06-15  |  Schema version: 1.0.0
 *
 * A round-trippable TOML representation: ordered tables, array-of-tables,
 * key/value pairs, every value type (typed strings, based integers, floats,
 * datetimes, arrays, inline tables) and comments. No functions.
 *
 * Spec: TOML 1.0.0
 */
import type { SchemaVersionData } from "../version/schema-version.js";

/** Bespoke schema version for the toml document model. Bump when THIS model changes. */
export const tomlSchemaVersion: SchemaVersionData = { major: 1, minor: 0, patch: 0 };

export interface TomlDocument {
  meta: TomlMeta;
  /** Key/value pairs and comments before the first [table]. */
  root: TomlItem[];
  tables: TomlTable[]; // ordered [table] and [[array-of-table]] blocks
}

export interface TomlMeta {
  schemaVersion: SchemaVersionData;
  lineEnding?: "\n" | "\r\n";
  trailingNewline?: boolean;
}

export interface TomlTable {
  type: "table" | "array-of-tables"; // [name] vs [[name]]
  /** Dotted key path, e.g. ["servers", "alpha"]. */
  path: string[];
  items: TomlItem[];
  comment?: string;
  raw?: string;
}

export type TomlItem = TomlKeyValue | TomlComment | TomlBlank;

export interface TomlKeyValue {
  type: "keyValue";
  key: string[]; // dotted keys: a.b.c -> ["a","b","c"]
  value: TomlValue;
  inlineComment?: string;
  raw?: string;
}
export interface TomlComment {
  type: "comment";
  value: string;
}
export interface TomlBlank {
  type: "blank";
}

export type TomlValue =
  | TomlString
  | TomlInteger
  | TomlFloat
  | TomlBoolean
  | TomlDateTime
  | TomlArray
  | TomlInlineTable;

export interface TomlString {
  type: "string";
  value: string;
  style: "basic" | "literal" | "multiline-basic" | "multiline-literal";
  raw?: string;
}
export interface TomlInteger {
  type: "integer";
  value: number; // use raw for values beyond JS safe range
  base: "dec" | "hex" | "oct" | "bin";
  raw?: string;
}
export interface TomlFloat {
  type: "float";
  value: number; // includes inf / nan via raw
  raw?: string;
}
export interface TomlBoolean {
  type: "boolean";
  value: boolean;
}
export interface TomlDateTime {
  type: "datetime";
  kind: "offset-datetime" | "local-datetime" | "local-date" | "local-time";
  value: string; // ISO-ish text exactly as written
}
export interface TomlArray {
  type: "array";
  elements: TomlValue[];
  multiline?: boolean;
  trailingComma?: boolean;
  raw?: string;
}
export interface TomlInlineTable {
  type: "inlineTable";
  pairs: Array<{ key: string[]; value: TomlValue }>;
  raw?: string;
}
