/**
 * parser — abstract input surface (project-independent, Tier 1)
 * Created: 2026-06-15  |  Schema version: 1.0.0
 *
 * The pure idea of "deserialize a raw form (TRaw) into a structured model
 * (TModel)". ZERO IMPORTS BY DESIGN — knows nothing about documents, the
 * universal IR, or any host project. A Lego brick reusable anywhere.
 *
 * Spec: uni-doc-hub-design.md §4.2, §4.9
 */

import type { MaybePromise } from "../types.ts";

export type ParserSchemaVersion = "1.0.0";
/** Lets a concrete parser be sync OR async without changing its callers. */

/** Open-ended parse knobs; widen per concrete parser. */
export interface ParseOptions {
  encoding?: string;
  /** Preserve trivia / raw text for byte-fidelity, where the model supports it. */
  preserveRaw?: boolean;
  [option: string]: unknown;
}

export abstract class Parser<TModel, TRaw = string> {
  /** Deserialize raw input into the structured model. The one required member. */
  abstract parse(input: TRaw, options?: ParseOptions): MaybePromise<TModel>;

  /**
   * Cheap, side-effect-free guess at whether `input` is this parser's format
   * (e.g. sniff magic bytes). Override when detection is feasible; the safe
   * default claims nothing so a registry never auto-selects by accident.
   */
  canParse(input: TRaw): boolean {
    void input;
    return false;
  }
}
