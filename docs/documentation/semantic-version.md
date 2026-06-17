# `semantic-version` — Reference

**Slug:** `semantic-version` · **File:** `semantic-version.ts` · **Tier:** ts-kit brick · **Created:** 2026-06-15

## Purpose

`SemanticVersion` is the **value object** that operates on a version: parse, format, compare, and increment. This is **version 2** — a corrected, immutable rewrite of ts-kit's original `src/classes/SemanticVersion.ts`, shipped as a **separate file** so the original behavior is not disturbed. `SemanticVersion.implementationVersion === 2` marks it at runtime.

## Relationship to `schema-version`

- **Data:** [`SchemaVersionData`](./schema-version.md) — what gets stored.
- **Behavior:** `SemanticVersion` — what operates on it.
- `SemanticVersion.from(data)` hydrates; `instance.toData()` serializes back.

## Changes from v1 (deliberate)

| #   | Change                                                                                                                                                    | Breaking?                                                            |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| 1   | Readonly getters `major/minor/patch/preRelease/preReleaseVersNum/buildParts` added (v1 had none)                                                          | no                                                                   |
| 2   | Static `parse(string)` + `from(SchemaVersionData)` and instance `toData()` added (v1 could not rehydrate)                                                 | no                                                                   |
| 3   | `toCoreString()` emits dotted `1.0.0`; default format string is `"{0}.{1}.{2}"`                                                                           | **yes** — v1 emitted `1:0:0` (colons)                                |
| 4   | `increment(field)` is **immutable** (returns a new instance), takes the `coreFieldName` enum, and cascades (MAJOR resets MINOR+PATCH; MINOR resets PATCH) | **yes** — v1 mutated in place, bumped one field, took a loose string |
| 5   | `toFullStringWithOpts` joins build parts with `.` and only appends the pre-release number when a pre-release exists                                       | fix                                                                  |

## API

- `new SemanticVersion(major, minor, patch, preRelease?, preReleaseVersNum?, buildParts?)`
- `static from(data: SchemaVersionData): SemanticVersion`
- `static parse(input: string): SemanticVersion` — throws on a malformed core triple
- `toData(): SchemaVersionData`
- `toCoreString(): string` → `"1.0.0"`
- `toFullStringWithOpts(withPreRelease, withPreReleaseVersNum, withBuildParts): string`
- `toString(): string` — canonical full string
- `increment(field: coreFieldName): SemanticVersion` — **new instance**
- `compareCore(other): -1 | 0 | 1`
- `static implementationVersion = 2`, `static CoreFormattingString`, `static description`

## Dependencies

Type-only import of `SchemaVersionData`. The formatting helper is a private template-fill so the class stays a zero-runtime-dependency brick; on move into ts-kit you MAY swap it for ts-kit's `formatString` (which v1 used).

## Known limitations / future work

- `parse` handles the common `MAJOR.MINOR.PATCH[-pre[.num]][+build.parts]` grammar; it does not validate the full SemVer pre-release/build BNF.
- `compareCore` compares the core triple only — pre-release precedence (SemVer §11) is not yet implemented.
