/**
 * LaTeX / TeX — structural document model (types only)
 * Created: 2026-06-15  |  Schema version: 1.0.0
 *
 * A reconstructable node model of a LaTeX source: commands (with optional/required
 * args), environments, math, groups, comments and text. `raw` preserves verbatim
 * and exotic constructs. No functions.
 *
 * Spec: LaTeX2e / TeX
 */
import type { SchemaVersionData } from "../version/schema-version.js";

/** Bespoke schema version for the latex document model. Bump when THIS model changes. */
export const latexSchemaVersion: SchemaVersionData = { major: 1, minor: 0, patch: 0 };

export interface LatexDocument {
  meta: LatexMeta;
  /** Everything before \begin{document} (documentclass, usepackage, defs). */
  preamble: LatexNode[];
  /** The body inside the document environment (if present). */
  body: LatexNode[];
  documentClass?: { name: string; options?: string[] };
}
export interface LatexMeta {
  schemaVersion: SchemaVersionData;
  lineEnding?: "\n" | "\r\n";
}

export type LatexNode =
  | LatexCommand
  | LatexEnvironment
  | LatexGroup
  | LatexMath
  | LatexText
  | LatexComment
  | LatexVerbatim
  | LatexSpecial;

export interface LatexArg {
  /** "required" => {..}, "optional" => [..], "star" => the * after a command. */
  kind: "required" | "optional" | "star";
  content: LatexNode[];
}
export interface LatexCommand {
  type: "command";
  name: string; // without leading backslash, e.g. "textbf"
  star?: boolean; // \section* etc.
  args?: LatexArg[];
}
export interface LatexEnvironment {
  type: "environment";
  name: string; // \begin{name} ... \end{name}
  args?: LatexArg[];
  body: LatexNode[];
}
export interface LatexGroup {
  type: "group";
  content: LatexNode[];
} // { ... }
export interface LatexMath {
  type: "math";
  /** inline $...$ / \(..\)  vs display $$..$$ / \[..\] / equation env. */
  display: boolean;
  delimiter?: "dollar" | "paren-bracket" | "environment";
  content: LatexNode[];
  raw?: string;
}
export interface LatexText {
  type: "text";
  value: string;
}
export interface LatexComment {
  type: "comment";
  value: string;
} // after %
export interface LatexVerbatim {
  type: "verbatim";
  environment?: string; // "verbatim", "lstlisting", ...
  value: string; // unparsed contents
}
/** Control symbols / specials like \\, \&, \%, \~, ~, & alignment, etc. */
export interface LatexSpecial {
  type: "special";
  value: string;
}
