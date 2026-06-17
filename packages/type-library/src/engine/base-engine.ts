/**
 * engine — central conversion engine; owns loss tracking (Tier 2)
 * Created: 2026-06-15  |  Schema version: 1.0.0
 *
 * The only component that sees a source and a target together, so the only one
 * that can compute an A->B loss. It holds INJECTED registries (parsers, writers,
 * adapters) — it imports no concrete implementations (P5); the CLI/composition
 * root wires those in. Conversion is pure composition:
 *
 *   write(to)( fromUniversal(to)( toUniversal(from)( parse(from)(input) ) ) )
 *
 * Spec: uni-doc-hub-design.md §4.7, §6
 *
 * This file provides the ABSTRACT shape (an abstract class + the report/registry
 * types). A concrete engine supplies featuresUsed (the probe) and the registry
 * population strategy.
 */
import type { Adapter, Serialized } from "../adapters/base-adapter.ts";
import type { UniversalDocument } from "../uni-docs/_uni_doc_sys_types.ts";
import type { UniversalFeature } from "../uni-docs/_uni_doc_sys_types.ts";
import type { SchemaVersionData } from "../version/schema-version.js";

/** Bespoke schema version for the atom document model. Bump when THIS model changes. */
export const baseEngineSchemaVersion: SchemaVersionData = { major: 1, minor: 0, patch: 0 };

/** Registry keyed by stable format id; the adapter set IS the capability library. */
export type AdapterRegistry = Map<string, Adapter<unknown, Serialized>>;

/** Structured result of a conversion, including honest loss accounting. */
export interface ConversionReport {
  from: string;
  to: string;
  /** Features present in the source doc that the target cannot carry. */
  lostFeatures: UniversalFeature[];
  /** Format-specific residue preserved in `original` but unavailable cross-format. */
  sidecarPreserved: string[];
  /** Free-form advisories (encoding fallbacks, approximations, ...). */
  warnings: string[];
}

export interface ConversionResult<TRaw extends Serialized = Serialized> {
  output: TRaw;
  report: ConversionReport;
}

export abstract class ConversionEngine {
  protected readonly adapters: AdapterRegistry;

  constructor(adapters?: AdapterRegistry) {
    this.adapters = adapters ?? new Map();
  }

  /** Register (or replace) an adapter under its `format` id. */
  register(adapter: Adapter<unknown, Serialized>): void {
    this.adapters.set(adapter.format, adapter);
  }

  /** Look up a registered adapter or throw a clear error. */
  protected require(format: string): Adapter<unknown, Serialized> {
    const a = this.adapters.get(format);
    if (!a) throw new Error(`No adapter registered for format "${format}"`);
    return a;
  }

  /**
   * The pure, format-independent probe: which features does this doc use?
   * Concrete engines implement the tree walk (see universal-feature.FeaturesUsed).
   */
  abstract featuresUsed(doc: UniversalDocument): Set<UniversalFeature>;

  /** Compute down-write loss: featuresUsed(doc) MINUS target.capabilities.features. */
  previewLoss(doc: UniversalDocument, targetFormat: string): UniversalFeature[] {
    const target = this.require(targetFormat);
    const supported = target.capabilities.features;
    const lost: UniversalFeature[] = [];
    for (const f of this.featuresUsed(doc)) {
      if (!supported.has(f)) lost.push(f);
    }
    return lost;
  }

  /**
   * Full pipeline: parse+universalize the source, then down-universalize+write to
   * the target, returning the output plus a loss report. Implementations compose
   * the registered adapters' decode/encode and assemble the ConversionReport.
   */
  abstract convert(input: Serialized, from: string, to: string): Promise<ConversionResult>;

  /** Optional: detect a format by polling each adapter's parser.canParse. */
  abstract detect(input: Serialized, filename?: string): string | undefined;
}
