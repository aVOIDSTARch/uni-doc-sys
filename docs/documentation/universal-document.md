# `universal-document` — Reference

**Slug:** `universal-document` · **File:** `universal-document.ts` · **Tier:** 2 core · **Created:** 2026-06-15

## Purpose

`UniversalDocument` is the **pivot IR** — the single intermediate representation every adapter converts to and from.

## Separation of parts (P2)

Four independent top-level fields, so an adapter can extract/emit each cleanly:

1. **`meta`** — descriptive metadata (title, authors, dates, language, identifiers, custom).
2. **`resources`** — assets (images/fonts/media) addressed by `id`; content references them by id and MUST NOT inline binary payloads into body nodes.
3. **`body`** — the block/inline tree, including a `Section` node that carries chapter/structure nesting independent of heading level.
4. **`original?`** — per-format residue sidecar keyed by format id; survives a same-format round-trip, invisible cross-format.

Plus **`schemaVersion: SchemaVersionData`** — which IR schema the instance was built against.

## Body model

- **Blocks:** `Section`, `Heading`, `Paragraph`, `BlockList`, `DefinitionList`, `Table`, `CodeBlock`, `BlockQuote`, `Figure`, `ThematicBreak`, `MathBlock`, `RawBlock`.
- **Inlines:** `TextRun`, `Styled` (emphasis/strong/strikethrough/underline/sub/sup/smallcaps), `CodeSpan`, `LinkSpan`, `ImageSpan`, `LineBreak`, `MathInline`, `FootnoteRef`, `RawInline`, `GenericSpan`.
- **`Attr`** on most nodes carries `id`/`classes`/`attributes` plus a `source?` residue bag for same-format fidelity.

All nodes are discriminated on a literal `type` field.

## Contract (spec §4.5)

- **MUST** keep the four parts separated. **MUST** address resources by id. **MUST** carry `schemaVersion`. **SHOULD** provide per-node `attr.source`.

## Dependencies

Type-only import of `SchemaVersionData`.
