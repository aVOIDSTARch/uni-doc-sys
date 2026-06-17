/**
 * writer — abstract output surface (project-independent, Tier 1)
 * Created: 2026-06-15  |  Schema version: 1.0.0
 *
 * The pure idea of "serialize a structured model (TModel) back into a raw form
 * (TRaw)" — the mirror of Parser. ZERO IMPORTS BY DESIGN. A Lego brick.
 *
 * Spec: uni-doc-hub-design.md §4.3, §4.9
 */

/** Lets a concrete writer be sync OR async without changing its callers. */
import type { MaybePromise } from "../types.ts";
import type { SchemaVersionData } from "../version/schema-version.js";

/** Bespoke schema version for the atom document model. Bump when THIS model changes. */
export const baseWriterSchemaVersion: SchemaVersionData = { major: 1, minor: 0, patch: 0 };
/** Open-ended serialize knobs; widen per concrete writer. */
export interface WriteOptions {
  encoding?: string;
  lineEnding?: "\n" | "\r\n";
  [option: string]: unknown;
}

export abstract class Writer<TModel, TRaw = string> {
  /** Serialize the model into raw output. The one required member. */
  abstract write(model: TModel, options?: WriteOptions): MaybePromise<TRaw>;
}
