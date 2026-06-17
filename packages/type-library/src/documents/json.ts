/**
 * JSON / JSONC — structural document model (types only)
 * Created: 2026-06-15  |  Schema version: 1.0.0
 *
 * A round-trippable representation of a JSON (or JSONC) file as data: ordered
 * members, original number text, quote/whitespace trivia and comments — enough
 * to reconstruct the exact file. No functions.
 *
 * Spec: ECMA-404 / RFC 8259 (+ JSONC comments & trailing commas)
 */
import type { SchemaVersionData } from "../version/schema-version.js";

/** Bespoke schema version for the json document model. Bump when THIS model changes. */
export const jsonSchemaVersion: SchemaVersionData = { major: 1, minor: 0, patch: 0 };

export interface JsonDocument {
  meta: JsonMeta;
  /** The single root value (RFC 8259 allows any value at the top level). */
  root: JsonValue;
  /** Comments/whitespace before the root and after it (JSONC). */
  leading?: Trivia[];
  trailing?: Trivia[];
}

export interface JsonMeta {
  schemaVersion: SchemaVersionData;
  encoding?: "utf-8" | "utf-16le" | "utf-16be";
  bom?: boolean;
  /** Indentation unit used when serializing (e.g. "  ", "\t"). */
  indent?: string;
  lineEnding?: "\n" | "\r\n";
  trailingNewline?: boolean;
  /** True if the document uses JSONC features (comments / trailing commas). */
  jsonc?: boolean;
}

export type JsonValue = JsonObject | JsonArray | JsonString | JsonNumber | JsonBoolean | JsonNull;

export interface JsonObject {
  type: "object";
  members: JsonMember[]; // ordered; duplicates allowed (last wins at parse)
  trailingComma?: boolean;
  raw?: string;
}
export interface JsonMember {
  key: JsonString;
  value: JsonValue;
  comments?: Trivia[];
}
export interface JsonArray {
  type: "array";
  elements: JsonValue[];
  trailingComma?: boolean;
  raw?: string;
}
export interface JsonString {
  type: "string";
  value: string; // decoded value
  raw?: string; // original text incl. escapes & quotes
}
export interface JsonNumber {
  type: "number";
  value: number;
  raw?: string; // preserves "1e3", "1.0", leading zeros, bigints
}
export interface JsonBoolean {
  type: "boolean";
  value: boolean;
}
export interface JsonNull {
  type: "null";
}

export interface Trivia {
  type: "comment" | "whitespace";
  /** For comments: "line" (//) or "block" (/* *\/). */
  kind?: "line" | "block";
  value: string;
}
