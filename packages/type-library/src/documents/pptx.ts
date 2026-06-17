/**
 * PPTX (OOXML PresentationML) — structural model (types only)
 * Created: 2026-06-15  |  Schema version: 1.0.0
 *
 * OPC package (see ./opc) + a high-level presentation (slides, shapes, text),
 * with masters/layouts referenced and detail preserved in raw parts. No functions.
 *
 * Spec: ECMA-376 — PresentationML
 */
import type { SchemaVersionData } from "../version/schema-version.js";

/** Bespoke schema version for the pptx document model. Bump when THIS model changes. */
export const pptxSchemaVersion: SchemaVersionData = { major: 1, minor: 0, patch: 0 };

import type { OpcPackage, OoxmlCoreProps } from "./opc.js";
export interface PptxDocument {
  meta: PptxMeta;
  package: OpcPackage;
  presentation?: PptxPresentation; // ppt/presentation.xml
  slides?: PptxSlide[];
  slideMasters?: Array<{ partName: string; raw: string }>;
  slideLayouts?: Array<{ partName: string; raw: string }>;
  coreProperties?: OoxmlCoreProps;
}
export interface PptxMeta {
  schemaVersion: SchemaVersionData;
}

export interface PptxPresentation {
  slideSize?: { cx: number; cy: number; type?: string };
  slideIds: Array<{ id: number; relId: string }>;
  raw?: string;
}
export interface PptxSlide {
  partName: string; // "/ppt/slides/slide1.xml"
  layoutRef?: string;
  shapes: PptxShape[];
  raw?: string;
}
export interface PptxShape {
  type: "shape" | "picture" | "graphicFrame" | "groupShape" | "connector";
  name?: string;
  transform?: { x: number; y: number; cx: number; cy: number; rot?: number }; // EMUs
  text?: PptxTextBody;
  pictureRef?: string; // r:embed id (image in rels)
  raw?: string;
}
export interface PptxTextBody {
  paragraphs: Array<{
    runs: Array<{ text: string; properties?: { raw: string } }>;
    properties?: { raw: string };
  }>;
}
