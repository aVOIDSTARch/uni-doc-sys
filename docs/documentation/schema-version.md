# `schema-version` — Reference

**Slug:** `schema-version` · **File:** `schema-version.ts` · **Tier:** 0-safe (data) · **Created:** 2026-06-15

## Purpose

`SchemaVersionData` is the **inert, dependency-free** representation of a semantic version. It is the form stored inside Tier-0 format-type files and inside a `UniversalDocument.schemaVersion`. It carries **no behavior** — all increment/format/compare logic lives in [`semantic-version`](./semantic-version.md), which hydrates from this shape and serializes back to it.

## Why it exists (the §4.1 rule)

A Tier-0 format type MUST contain types only — no runtime imports. Holding a `SemanticVersion` _instance_ would drag a class dependency into every format file and break that rule. So the file stores this plain data shape; code that needs behavior calls `SemanticVersion.from(data)` at the point of use.

## Exports

| Name                | Kind             | Notes                                                         |
| ------------------- | ---------------- | ------------------------------------------------------------- |
| `SchemaVersion`     | `type = "1.0.0"` | the per-file convention literal                               |
| `SchemaVersionData` | `interface`      | structured version, mirrors the `SemanticVersion` constructor |

## Shape

- `major`, `minor`, `patch` — `number` (required)
- `preRelease?` — `string` (the dotted-suffix label, e.g. `rc`)
- `preReleaseVersNum?` — `number` (counter after the label, e.g. `rc.2` → `2`)
- `buildParts?` — `string[]` (segments after `+`)

## Round-trip contract

`SemanticVersion.from(data).toData()` MUST equal `data` (modulo absent optional fields normalized away). This is the guarantee that lets versions move between storage and behavior without drift.

## Dependencies

None. Pure types.
