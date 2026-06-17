/**
 * SVG — structural document model (types only)
 * Created: 2026-06-15  |  Schema version: 1.0.0
 *
 * A reconstructable model of an SVG: the structured element tree (shapes, paths,
 * groups, defs, gradients, text, use, filters) with an `attrs` bag and `raw`
 * fallback so any element/attribute is representable. No functions.
 *
 * Spec: SVG 1.1 / SVG 2 (an XML profile)
 */
import type { SchemaVersionData } from "../version/schema-version.js";

/** Bespoke schema version for the svg document model. Bump when THIS model changes. */
export const svgSchemaVersion: SchemaVersionData = { major: 1, minor: 0, patch: 0 };

export interface SvgDocument {
  meta: SvgMeta;
  root: SvgRoot;
}
export interface SvgMeta {
  schemaVersion: SchemaVersionData;
  lineEnding?: "\n" | "\r\n";
  xmlDeclaration?: string;
  doctype?: string;
}

/** Presentation + core attributes common to most SVG elements. */
export interface SvgCommonAttrs {
  id?: string;
  class?: string;
  style?: string;
  transform?: string;
  fill?: string;
  stroke?: string;
  "stroke-width"?: string | number;
  opacity?: string | number;
  /** Any other attribute, exact name -> value (the fidelity escape hatch). */
  attrs?: Record<string, string | number>;
}

export interface SvgRoot extends SvgCommonAttrs {
  type: "svg";
  width?: string | number;
  height?: string | number;
  viewBox?: string;
  xmlns?: string;
  children: SvgNode[];
}

export type SvgNode =
  | SvgGroup
  | SvgRect
  | SvgCircle
  | SvgEllipse
  | SvgLine
  | SvgPolyline
  | SvgPolygon
  | SvgPath
  | SvgText
  | SvgTSpan
  | SvgImage
  | SvgUse
  | SvgDefs
  | SvgSymbol
  | SvgLinearGradient
  | SvgRadialGradient
  | SvgStop
  | SvgClipPath
  | SvgMask
  | SvgMarker
  | SvgPattern
  | SvgStyle
  | SvgTitle
  | SvgDesc
  | SvgGeneric;

export interface SvgNodeBase extends SvgCommonAttrs {
  children?: SvgNode[];
}
export interface SvgGroup extends SvgNodeBase {
  type: "g";
}
export interface SvgRect extends SvgNodeBase {
  type: "rect";
  x?: number | string;
  y?: number | string;
  width?: number | string;
  height?: number | string;
  rx?: number | string;
  ry?: number | string;
}
export interface SvgCircle extends SvgNodeBase {
  type: "circle";
  cx?: number | string;
  cy?: number | string;
  r?: number | string;
}
export interface SvgEllipse extends SvgNodeBase {
  type: "ellipse";
  cx?: number | string;
  cy?: number | string;
  rx?: number | string;
  ry?: number | string;
}
export interface SvgLine extends SvgNodeBase {
  type: "line";
  x1?: number | string;
  y1?: number | string;
  x2?: number | string;
  y2?: number | string;
}
export interface SvgPolyline extends SvgNodeBase {
  type: "polyline";
  points?: string;
}
export interface SvgPolygon extends SvgNodeBase {
  type: "polygon";
  points?: string;
}
export interface SvgPath extends SvgNodeBase {
  type: "path";
  d?: string;
}
export interface SvgText extends SvgNodeBase {
  type: "text";
  x?: number | string;
  y?: number | string;
  content?: string;
}
export interface SvgTSpan extends SvgNodeBase {
  type: "tspan";
  content?: string;
}
export interface SvgImage extends SvgNodeBase {
  type: "image";
  href?: string;
  width?: number | string;
  height?: number | string;
}
export interface SvgUse extends SvgNodeBase {
  type: "use";
  href?: string;
}
export interface SvgDefs extends SvgNodeBase {
  type: "defs";
}
export interface SvgSymbol extends SvgNodeBase {
  type: "symbol";
}
export interface SvgLinearGradient extends SvgNodeBase {
  type: "linearGradient";
}
export interface SvgRadialGradient extends SvgNodeBase {
  type: "radialGradient";
}
export interface SvgStop extends SvgNodeBase {
  type: "stop";
  offset?: string | number;
  "stop-color"?: string;
}
export interface SvgClipPath extends SvgNodeBase {
  type: "clipPath";
}
export interface SvgMask extends SvgNodeBase {
  type: "mask";
}
export interface SvgMarker extends SvgNodeBase {
  type: "marker";
}
export interface SvgPattern extends SvgNodeBase {
  type: "pattern";
}
export interface SvgStyle {
  type: "style";
  content: string;
}
export interface SvgTitle {
  type: "title";
  content: string;
}
export interface SvgDesc {
  type: "desc";
  content: string;
}
/** Any element not modeled above, kept fully via name + attrs + raw. */
export interface SvgGeneric extends SvgNodeBase {
  type: "element";
  name: string;
  content?: string;
  raw?: string;
}
