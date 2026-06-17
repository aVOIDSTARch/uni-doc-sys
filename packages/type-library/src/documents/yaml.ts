/**
 * YAML — structural document model (types only)
 * Created: 2026-06-15  |  Schema version: 1.0.0
 *
 * A round-trippable YAML representation: multi-document streams, mappings,
 * sequences, scalars with style, anchors/aliases, tags and comments. No functions.
 *
 * Spec: YAML 1.2
 */
import type { SchemaVersionData } from "../version/schema-version.js";

/** Bespoke schema version for the yaml document model. Bump when THIS model changes. */
export const yamlSchemaVersion: SchemaVersionData = { major: 1, minor: 0, patch: 0 };

export interface YamlStream {
  meta: YamlMeta;
  documents: YamlDocument[]; // separated by --- ...
}

export interface YamlMeta {
  schemaVersion: SchemaVersionData;
  lineEnding?: "\n" | "\r\n";
  trailingNewline?: boolean;
}

export interface YamlDocument {
  type: "document";
  /** %YAML / %TAG directives preceding the document. */
  directives?: string[];
  /** Whether a leading `---` marker is present. */
  explicitStart?: boolean;
  explicitEnd?: boolean; // trailing `...`
  root?: YamlNode; // may be empty/null
  leadingComments?: string[];
}

export type YamlNode = YamlMapping | YamlSequence | YamlScalar | YamlAlias;

export interface YamlNodeBase {
  anchor?: string; // &name
  tag?: string; // !!str, !custom, etc.
  comment?: string; // trailing comment on the node's line
}
export interface YamlMapping extends YamlNodeBase {
  type: "mapping";
  /** Block vs flow ({a: 1}) presentation. */
  style: "block" | "flow";
  pairs: YamlPair[]; // ordered
  raw?: string;
}
export interface YamlPair {
  key: YamlNode;
  value: YamlNode;
  comment?: string;
}
export interface YamlSequence extends YamlNodeBase {
  type: "sequence";
  style: "block" | "flow"; // block (- item) vs flow ([a, b])
  items: YamlNode[];
  raw?: string;
}
export interface YamlScalar extends YamlNodeBase {
  type: "scalar";
  value: string | number | boolean | null;
  /** Presentation style of the scalar. */
  style: "plain" | "single" | "double" | "literal" | "folded";
  raw?: string;
}
export interface YamlAlias {
  type: "alias";
  alias: string; // *name
}
