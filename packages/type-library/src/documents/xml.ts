/**
 * XML — structural document model (types only)
 * Created: 2026-06-15  |  Schema version: 1.0.0
 *
 * A round-trippable XML representation: declaration, doctype, namespaced
 * elements with ordered attributes, text, CDATA, comments, processing
 * instructions and entity references. No functions.
 *
 * Spec: XML 1.0 / Namespaces in XML
 */
import type { SchemaVersionData } from "../version/schema-version.js";

/** Bespoke schema version for the xml document model. Bump when THIS model changes. */
export const xmlSchemaVersion: SchemaVersionData = { major: 1, minor: 0, patch: 0 };

export interface XmlDocument {
  meta: XmlMeta;
  declaration?: XmlDeclaration;
  doctype?: XmlDoctype;
  /** Comments / PIs / whitespace allowed in the prolog, in order. */
  prolog?: XmlMisc[];
  root: XmlElement;
  epilog?: XmlMisc[];
}

export interface XmlMeta {
  schemaVersion: SchemaVersionData;
  lineEnding?: "\n" | "\r\n";
  trailingNewline?: boolean;
}

export interface XmlDeclaration {
  version: string; // "1.0"
  encoding?: string; // "UTF-8"
  standalone?: "yes" | "no";
}
export interface XmlDoctype {
  type: "doctype";
  name: string;
  publicId?: string;
  systemId?: string;
  internalSubset?: string;
  raw?: string;
}

export type XmlNode =
  | XmlElement
  | XmlText
  | XmlCData
  | XmlComment
  | XmlProcessingInstruction
  | XmlEntityRef;
export type XmlMisc = XmlComment | XmlProcessingInstruction | XmlText;

export interface XmlElement {
  type: "element";
  name: string; // qualified name as written, e.g. "ns:tag"
  prefix?: string;
  localName?: string;
  namespace?: string; // resolved URI, if known
  attributes: XmlAttribute[]; // ordered
  children: XmlNode[];
  /** True for self-closing form <tag/>. */
  selfClosing?: boolean;
  raw?: string;
}
export interface XmlAttribute {
  name: string;
  value: string;
  prefix?: string;
  localName?: string;
  quote?: "double" | "single";
}
export interface XmlText {
  type: "text";
  value: string; // decoded
  /** Whitespace-only text worth preserving for fidelity. */
  whitespace?: boolean;
  raw?: string;
}
export interface XmlCData {
  type: "cdata";
  value: string;
}
export interface XmlComment {
  type: "comment";
  value: string;
}
export interface XmlProcessingInstruction {
  type: "pi";
  target: string;
  value?: string;
}
export interface XmlEntityRef {
  type: "entity";
  name: string;
}
