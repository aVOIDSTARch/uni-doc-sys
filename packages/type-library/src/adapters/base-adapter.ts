/**
 * adapter — abstract hub spoke; composes a Parser + a Writer (Tier 2)
 * Created: 2026-06-15  |  Schema version: 1.0.0
 *
 * One per format. Snaps together three independent pieces:
 *   - a Parser  (raw -> model)      the input Lego   (./parser)
 *   - a Writer  (model -> raw)      the output Lego  (./writer)
 *   - toUniversal / fromUniversal   the bridge to the IR (./universal-document)
 *
 * Imports are TYPE-ONLY, so the only runtime artifact is the class itself.
 * Spec: uni-doc-hub-design.md §4.4, §4.9, §6
 */
import type { UniversalDocument } from "../uni-docs/uni-doc-types.ts";
import type { Parser, ParseOptions } from "../parsers/base-parser.ts";
import type { Writer, WriteOptions } from "../writers/base-writer.ts";
import type { UniversalFeature } from "../uni-docs/uni-doc-types.ts";
import type { MaybePromise } from "../general/general-types.ts";

export type AdapterSchemaVersion = "1.0.0";

/** On-the-wire form: text for text formats, bytes for binary (pdf/docx/zip). */
export type Serialized = string | Uint8Array;

/** Honest declaration of what survives a round-trip through this format. */
export interface AdapterCapabilities {
  /** Universal features this format can faithfully carry. */
  readonly features: ReadonlySet<UniversalFeature>;
  /** Claims write(parse(x)) === x for its own format. */
  readonly losslessSerialization?: boolean;
}

export abstract class Adapter<TModel, TRaw extends Serialized = string> {
  /* ---- identity: concrete subclass fills these in ---- */
  abstract readonly format: string; // "markdown", "docx", ...
  abstract readonly extensions: readonly string[];
  abstract readonly kind: "text" | "binary";
  readonly mediaTypes?: readonly string[];
  abstract readonly capabilities: AdapterCapabilities;

  /* ---- the snapped-in Lego pieces: must be implemented ---- */
  protected abstract readonly parser: Parser<TModel, TRaw>;
  protected abstract readonly writer: Writer<TModel, TRaw>;

  /* ---- the universal bridge: must be implemented ---- */
  abstract toUniversal(doc: TModel): MaybePromise<UniversalDocument>;
  abstract fromUniversal(doc: UniversalDocument): MaybePromise<TModel>;

  /* ---- derived once, inherited free ---- */

  /** raw -> universal  (toUniversal . parse) */
  async decode(input: TRaw, options?: ParseOptions): Promise<UniversalDocument> {
    return this.toUniversal(await this.parser.parse(input, options));
  }
  /** universal -> raw  (write . fromUniversal) */
  async encode(doc: UniversalDocument, options?: WriteOptions): Promise<TRaw> {
    return this.writer.write(await this.fromUniversal(doc), options);
  }
  /** Expose the input surface directly (delegates to the parser member). */
  parse(input: TRaw, options?: ParseOptions): MaybePromise<TModel> {
    return this.parser.parse(input, options);
  }
  /** Expose the output surface directly (delegates to the writer member). */
  write(model: TModel, options?: WriteOptions): MaybePromise<TRaw> {
    return this.writer.write(model, options);
  }
}
