/**
 * universal-feature — capability vocabulary + document probe (Tier 2 core)
 * Created: 2026-06-15  |  Schema version: 1.0.0
 *
 * The shared, COARSE feature language both sides of a conversion speak, plus the
 * pure probe that reports which features a given universal document actually
 * uses. Loss = featuresUsed(sourceDoc) MINUS targetAdapter.capabilities.features.
 *
 * GOVERNANCE: adding a token here obliges every adapter to revisit its declared
 * feature set (§6). Keep this coarse — "math" is one token, not every construct.
 *
 * Spec: uni-doc-hub-design.md §4.6, §6
 */
import type { UniversalDocument } from "./universal-document.js";
import type { SchemaVersionData } from "../version/schema-version.js";

/** Bespoke schema version for the atom document model. Bump when THIS model changes. */
export const uniFeaturesSchemaVersion: SchemaVersionData = { major: 1, minor: 0, patch: 0 };
/** Coarse capability tokens owned solely by the unidoc core. */
export type UniversalFeature =
  | "images"
  | "tables"
  | "sections"
  | "nestedSections"
  | "lists"
  | "footnotes"
  | "math"
  | "codeBlocks"
  | "blockQuotes"
  | "inlineStyles"
  | "links"
  | "rawBlocks"
  | "metadata.authors"
  | "metadata.identifiers"
  | "metadata.dates";

/**
 * Pure, FORMAT-INDEPENDENT walk over a universal document reporting which
 * features actually appear. The single source of "what's in this doc".
 * Implementations MUST NOT depend on any format type or adapter.
 */
export type FeaturesUsed = (doc: UniversalDocument) => Set<UniversalFeature>;
