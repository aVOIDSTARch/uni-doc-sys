# `writer` — Reference

**Slug:** `writer` · **File:** `writer.ts` · **Tier:** 1 · **Created:** 2026-06-15

## Purpose

`Writer<TModel, TRaw>` is the abstract **output surface**: the mirror of `Parser`, serializing a structured model back into a raw form. A **zero-import** Lego brick.

## Contract (spec §4.3, §4.9)

- **MUST** implement `write(model: TModel, options?: WriteOptions): MaybePromise<TRaw>`.
- **MUST** be the inverse of the matching Parser; prefer residue fields over re-deriving, to maximize byte-fidelity.
- **MUST NOT** import `UniversalDocument` or know about any other format.

## Exports

| Name                            | Kind                                                |
| ------------------------------- | --------------------------------------------------- |
| `Writer<TModel, TRaw = string>` | abstract class                                      |
| `WriteOptions`                  | interface (open-ended; `encoding`, `lineEnding`, …) |
| `MaybePromise<T>`               | type alias                                          |

## Dependencies

**None.** Mandated zero-import (§4.9).
