# `parser` — Reference

**Slug:** `parser` · **File:** `parser.ts` · **Tier:** 1 · **Created:** 2026-06-15

## Purpose

`Parser<TModel, TRaw>` is the abstract **input surface**: the pure idea of "deserialize a raw form into a structured model." It is a **zero-import** Lego brick — it knows nothing about the universal IR, adapters, or any host project, and can be lifted into an unrelated codebase unchanged.

## Contract (spec §4.2, §4.9)

- **MUST** implement `parse(input: TRaw, options?: ParseOptions): MaybePromise<TModel>`.
- **MUST** populate the target model completely, including residue fields, so a conforming Writer can reproduce the input (`write(parse(x)) === x`).
- **MUST** be the only place that knows the format's byte grammar.
- **MUST NOT** import or reference `UniversalDocument`, any adapter, or any other format.
- **MAY** override `canParse(input)`; the default returns `false`.

## Exports

| Name                            | Kind                                                 |
| ------------------------------- | ---------------------------------------------------- |
| `Parser<TModel, TRaw = string>` | abstract class                                       |
| `ParseOptions`                  | interface (open-ended; `encoding`, `preserveRaw`, …) |
| `MaybePromise<T>`               | type alias (`T \| Promise<T>`)                       |

## Type parameters

- `TModel` — the format-specific document type (e.g. `MarkdownDocument`).
- `TRaw` — the serialized input; `string` for text formats, `Uint8Array` for binary. Defaults to `string`.

## Dependencies

**None.** No `import` statements at all — this is mandated by §4.9.
