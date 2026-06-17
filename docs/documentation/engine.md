# `engine` — Reference

**Slug:** `engine` · **File:** `engine.ts` · **Tier:** 2 · **Created:** 2026-06-15

## Purpose

`ConversionEngine` is the central class that owns everything beyond a single adapter's conversion: the registries, the composition pipeline, and **loss tracking**. It is the only component that sees a source and a target together, so it is the only one that can compute an A→B loss.

## Injected registries (P5)

The engine holds an `AdapterRegistry` (`Map<format, Adapter>`) populated by the caller via `register(adapter)`. It imports **no concrete** parsers/writers/adapters — the CLI (composition root) wires those in. The registered adapter set _is_ the capability library, read at runtime; there is no hardcoded per-format table.

## The pipeline

```
write(to)( fromUniversal(to)( toUniversal(from)( parse(from)(input) ) ) )
```

Expressed via the adapters' own `decode`/`encode`.

## Loss model (spec §6)

- `featuresUsed(doc)` — **abstract**; the concrete engine supplies the pure tree-walk (typed by `universal-feature.FeaturesUsed`).
- `previewLoss(doc, targetFormat)` — concrete; returns `featuresUsed(doc) − target.capabilities.features`.
- `convert(input, from, to)` — **abstract**; runs the pipeline and assembles a `ConversionReport`.
- `detect(input, filename?)` — **abstract**; polls adapters' `parser.canParse`.

## Exports

| Name                     | Kind                                                       |
| ------------------------ | ---------------------------------------------------------- |
| `ConversionEngine`       | abstract class                                             |
| `AdapterRegistry`        | `Map<string, Adapter<unknown, Serialized>>`                |
| `ConversionReport`       | interface (`lostFeatures`, `sidecarPreserved`, `warnings`) |
| `ConversionResult<TRaw>` | interface (`output`, `report`)                             |

## Why abstract

`convert`, `featuresUsed`, and `detect` are left abstract because their bodies are policy (how to assemble the report, how to walk the tree, how to sniff). The registry mechanics, `register`, `require`, and `previewLoss` are concrete because they're invariant.

## Dependencies

Type-only imports of `Adapter`/`Serialized`, `UniversalDocument`, `UniversalFeature`.
