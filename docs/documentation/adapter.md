# `adapter` — Reference

**Slug:** `adapter` · **File:** `adapter.ts` · **Tier:** 2 · **Created:** 2026-06-15

## Purpose

`Adapter<TModel, TRaw>` is the abstract **hub spoke**, one per format. It composes the two Tier-1 surfaces with the universal bridge so a single object spans the whole pipeline. N adapters give N-to-N translation through the hub, never an O(N²) mesh.

```
raw ──parser.parse──▶ TModel ──toUniversal──▶ UniversalDocument
raw ◀──writer.write── TModel ◀──fromUniversal── UniversalDocument
```

## Composition, not inheritance

The Parser and Writer are **abstract members** (`parser`, `writer`), supplied by the concrete subclass — the adapter _has_ a parser and a writer rather than _being_ one. The hub bridge (`toUniversal`/`fromUniversal`) is the only logic the adapter itself adds; `decode`/`encode` are derived once for all subclasses.

## Contract (spec §4.4)

- **MUST** implement `toUniversal(doc)` and `fromUniversal(doc)`.
- **MUST** provide `format`, `extensions`, `kind`, `parser`, `writer`, `capabilities`.
- **MUST** route unmappable data into `UniversalDocument.original[this.format]`.
- **MUST** declare `capabilities.features` as the exact set it can carry — no over/under-claiming.
- **MUST NOT** read or write bytes (the parser/writer do that).
- **MUST NOT** import a concrete parser/writer — only the `<format>.ts` **type**; the members are injected by the subclass.

## Exports

| Name                                                | Kind                                                                            |
| --------------------------------------------------- | ------------------------------------------------------------------------------- |
| `Adapter<TModel, TRaw extends Serialized = string>` | abstract class                                                                  |
| `AdapterCapabilities`                               | interface (`features: ReadonlySet<UniversalFeature>`, `losslessSerialization?`) |
| `Serialized`                                        | type (`string \| Uint8Array`)                                                   |
| `MaybePromise<T>`                                   | type alias                                                                      |

## Derived members (free to subclasses)

- `decode(raw, opts?) → Promise<UniversalDocument>` = `toUniversal ∘ parser.parse`
- `encode(doc, opts?) → Promise<TRaw>` = `writer.write ∘ fromUniversal`
- `parse` / `write` — pass-throughs to the members.

## Dependencies

Type-only imports of `UniversalDocument`, `Parser`/`ParseOptions`, `Writer`/`WriteOptions`, `UniversalFeature`. The only runtime artifact is the class.
