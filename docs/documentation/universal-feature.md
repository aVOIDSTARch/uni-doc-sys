# `universal-feature` — Reference

**Slug:** `universal-feature` · **File:** `universal-feature.ts` · **Tier:** 2 core · **Created:** 2026-06-15

## Purpose

The shared **capability vocabulary** both sides of a conversion speak, plus the signature of the **document probe**. Loss is computed as set arithmetic:

```
lostFeatures = featuresUsed(sourceDoc)  MINUS  targetAdapter.capabilities.features
```

## Two halves, two owners (spec §6)

- **`UniversalFeature`** (this file) — a coarse string-literal union owned solely by the unidoc core. A _static_ vocabulary.
- **`FeaturesUsed`** (this file, signature) — the type of the **pure, format-independent** probe that walks a `UniversalDocument` and returns the `Set<UniversalFeature>` it actually uses. A _runtime_ fact about a document. The concrete walk is implemented by the engine.

Capability data MUST NOT live on any Tier-0 format type (that would couple formats to this vocabulary, violating §4.1/P5). The adapter declares what its format supports; this file defines the words they both use.

## The vocabulary (keep it COARSE)

`images`, `tables`, `sections`, `nestedSections`, `lists`, `footnotes`, `math`, `codeBlocks`, `blockQuotes`, `inlineStyles`, `links`, `rawBlocks`, `metadata.authors`, `metadata.identifiers`, `metadata.dates`.

Track `math` as **one** token, not every construct. Coarseness bounds the governance tax.

## Governance constraint (MUST)

Adding a token obliges **every adapter** to revisit its `capabilities.features` so it neither over- nor under-claims.

## Dependencies

Type-only import of `UniversalDocument` (for the `FeaturesUsed` signature).
