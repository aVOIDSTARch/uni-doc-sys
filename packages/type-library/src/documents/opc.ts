/**
 * OPC (Open Packaging Conventions) — shared OOXML container (types only)
 * Created: 2026-06-15  |  Schema version: 1.0.0
 *
 * The ZIP-of-parts + content-types + relationships layer shared by docx, xlsx
 * and pptx. Sits on top of the generic ZIP container. No functions.
 *
 * Spec: ECMA-376 Part 2 — Open Packaging Conventions
 */
import type { ZipArchive } from "./zip-container.js";
export interface OpcPackage {
  /** The underlying archive (optional if only structured parts are kept). */
  archive?: ZipArchive;
  contentTypes: OpcContentTypes; // [Content_Types].xml
  parts: OpcPart[];
  relationships: OpcRelationships[]; // _rels/*.rels (root + per-part)
}
export interface OpcContentTypes {
  defaults: Array<{ extension: string; contentType: string }>;
  overrides: Array<{ partName: string; contentType: string }>;
}
export interface OpcPart {
  partName: string; // "/word/document.xml"
  contentType: string;
  text?: string; // XML parts
  base64?: string; // binary parts (images, fonts)
}
export interface OpcRelationships {
  source: string; // "/" for root rels, else the part name
  relationships: OpcRelationship[];
}
export interface OpcRelationship {
  id: string;
  type: string; // relationship type URI
  target: string;
  targetMode?: "Internal" | "External";
}
/** Dublin-core-ish core properties shared by OOXML docProps/core.xml. */
export interface OoxmlCoreProps {
  title?: string;
  creator?: string;
  lastModifiedBy?: string;
  created?: string;
  modified?: string;
  revision?: string;
  subject?: string;
  keywords?: string;
  description?: string;
  category?: string;
}
