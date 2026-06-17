/**
 * RTF (Rich Text Format) — structural document model (types only)
 * Created: 2026-06-15  |  Schema version: 1.0.0
 *
 * A reconstructable model of RTF's group/control-word/text tree, which captures
 * any RTF document, plus convenience pointers to the common header tables. No functions.
 *
 * Spec: Microsoft RTF Specification 1.9.1
 */
import type { SchemaVersionData } from "../version/schema-version.js";

/** Bespoke schema version for the rtf document model. Bump when THIS model changes. */
export const rtfSchemaVersion: SchemaVersionData = { major: 1, minor: 0, patch: 0 };

export interface RtfDocument {
  meta: RtfMeta;
  /** The outermost group: { \rtf1 ... }. */
  root: RtfGroup;
}
export interface RtfMeta {
  schemaVersion: SchemaVersionData;
  rtfVersion?: number; // \rtfN
  charset?: string; // \ansi, \mac, \pc, \pca
  defaultFont?: number; // \deffN
  codepage?: number; // \ansicpgN
}

export type RtfNode = RtfGroup | RtfControlWord | RtfControlSymbol | RtfText;

export interface RtfGroup {
  type: "group";
  children: RtfNode[];
  /** Hint for known header groups: fonttbl, colortbl, stylesheet, info, ... */
  role?: string;
  raw?: string;
}
export interface RtfControlWord {
  type: "controlWord";
  word: string; // e.g. "b", "par", "fs", "cf"
  param?: number; // optional numeric parameter
  /** Whether a space delimiter followed the control word. */
  spaceDelimited?: boolean;
}
export interface RtfControlSymbol {
  type: "controlSymbol";
  symbol: string; // e.g. "\\'", "\\~", "\\-", escaped chars
  hex?: string; // for \'hh hex-encoded byte
}
export interface RtfText {
  type: "text";
  value: string;
}
