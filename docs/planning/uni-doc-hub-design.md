This is **hub-and-spoke**: N formats need N adapters (each format ⇄ the hub),
never N×(N−1) direct converters. Adding a format adds one parser, one writer,
one adapter — and instantly interoperates with every existing format.

Two invariants define the whole design:

- **A Parser/Writer speaks only `bytes ⇄ <Format>Document`.** It never sees the
  Universal Document.
- **An Adapter speaks only `<Format>Document ⇄ UniversalDocument`.** It never
  parses or serializes bytes.

These two halves meet only inside the **Engine**, which is injected with the
pieces and owns all cross-cutting concerns (loss tracking, reporting, detection).

---

## 2. Core principles

- **P1 — Encapsulation ("Lego").** Every file MUST be independent and reusable to
  the maximum degree its role allows. A file MUST NOT import more than its tier
  permits (§3). The ideal brick has zero imports and is droppable into an
  unrelated project unchanged.
- **P2 — Separation of parts.** A document is four independent concerns:
  **metadata**, **resources** (binary assets), **body** (content + structure),
  and **residue** (format-specific leftovers). Types and conversions MUST keep
  these separable.
- **P3 — Two-layer storage.** Every format type MUST provide both a _structured_
  layer (typed, queryable, useful without reading the spec) and a _residue_
  layer (`raw`/`base64`) guaranteeing byte-faithful reconstruction. Neither alone
  is acceptable (§7).
- **P4 — Honest loss.** Loss MUST be measurable and reported, never silent. Every
  adapter MUST declare its capabilities truthfully (§6).
- **P5 — No hidden coupling.** The Engine MUST NOT hardcode knowledge of specific
  formats. Formats are discovered at runtime through a registry.

---

## 3. Dependency tiers (the acyclic rule)

Every file belongs to exactly one tier. Imports MUST flow downward only. A cycle,
or an upward/sideways import that violates the table, is a MUST violation.

| Tier  | Files                                                                                                      | MAY import                                      | MUST NOT import                                                  |
| ----- | ---------------------------------------------------------------------------------------------------------- | ----------------------------------------------- | ---------------------------------------------------------------- |
| **0** | `<format>.ts` type models; shared container bases (`zip-container.ts`, `opc.ts`, `odf.ts`)                 | nothing outside Tier 0 (bases only)             | parsers, writers, adapters, `universal-document`, anything       |
| **1** | `Parser.ts`, `Writer.ts` (bases); `<format>.parser.ts`, `<format>.writer.ts`                               | their base + the **one** matching `<format>.ts` | `universal-document`, adapters, the engine, other formats        |
| **2** | `universal-document.ts`, `Adapter.ts`, `<format>.adapter.ts`, `engine.ts`, `cli.ts`, capability vocabulary | Tier 0 **types**, the IR, the `Adapter` base    | concrete parsers/writers (except `cli.ts`, the composition root) |

**Composition root exception:** `cli.ts` (and only it) MAY import concrete
parsers, writers, and adapters in order to wire them into the engine. No other
Tier-2 file may.

**Package boundaries (RECOMMENDED).** The tiers SHOULD ship as separable units so
each is independently consumable:

- `format-types` (Tier 0) — depends on nothing.
- `format-parsers` (Tier 1) — depends on `format-types`.
- `format-writers` (Tier 1) — depends on `format-types`.
- `unidoc` (Tier 2) — depends on `format-types` only; oblivious to parsers/writers.

---

## 4. File kinds and contracts

### 4.1 Format Type — `<format>.ts` (Tier 0)

**Provides:** the `<Format>Document` type — a complete structural model of one
file format.

**MUST:**

- Contain **types only** — no functions, no classes, no runtime values, no
  `const`s. Pure `type`/`interface` declarations.
- Import nothing except sibling Tier-0 container bases.
- Begin with a header comment carrying `Created: YYYY-MM-DD` and a one-line
  purpose, and export `type SchemaVersion = "1.0.0"`.
- Export a root `<Format>Document` interface that separates (P2): a `meta` object
  (at minimum encoding/line-ending where applicable, plus `schemaVersion`) and
  the content tree.
- Use **discriminated unions** keyed on a literal `type` (or `kind`) field for
  any node with variants.
- Use **ordered arrays** wherever the format's order or duplicates are
  significant (e.g. object members, attributes, list items). MUST NOT model
  ordered/duplicate-keyed data as a plain JS object.
- Provide a **residue escape hatch** (`raw?: string`, and/or `base64?: string`
  for binary) on every node whose grammar is open-ended, guaranteeing total
  reconstruction (P3 residue layer).
- Provide a **structured layer** rich enough to be useful without the residue
  (P3 structured layer; see §7 rubric).

**MUST NOT:**

- Reference `UniversalDocument`, `UniversalFeature`, or any hub concept. A format
  type is oblivious to the universal standard.

### 4.2 Parser — `<format>.parser.ts` (Tier 1)

**Provides:** `class <Format>Parser extends Parser<<Format>Document, TRaw>`.

**MUST:**

- Implement `parse(input: TRaw, options?): MaybePromise<<Format>Document>`.
- Import only the `Parser` base and the matching `<format>.ts`.
- Populate the type **completely**, including residue fields, such that a
  conforming Writer can reproduce the input (target: `write(parse(x)) === x`).
- Be the _only_ place in the system that knows this format's byte grammar.

**MUST NOT:** import or reference `UniversalDocument`; perform any
universalization; know about any other format.

**MAY:** override `canParse(input)` for detection; default returns `false`.

### 4.3 Writer — `<format>.writer.ts` (Tier 1)

**Provides:** `class <Format>Writer extends Writer<<Format>Document, TRaw>`.

**MUST:**

- Implement `write(model: <Format>Document, options?): MaybePromise<TRaw>`.
- Import only the `Writer` base and the matching `<format>.ts`.
- Be the inverse of the Parser; prefer residue fields over re-deriving when
  present, to maximize byte-fidelity.

**MUST NOT:** import `UniversalDocument`; know about any other format.

### 4.4 Adapter — `<format>.adapter.ts` (Tier 2)

**Provides:** `class <Format>Adapter extends Adapter<<Format>Document, TRaw>`.

**MUST:**

- Implement `toUniversal(doc)` and `fromUniversal(doc)`.
- Provide the abstract members: `format` (stable id), `extensions`, `kind`
  (`"text" | "binary"`), `parser`, `writer`, and `capabilities` (§6).
- Map the format object's content/structure/metadata into the four Universal
  parts, and back.
- Stash anything with no universal equivalent into `UniversalDocument.original[
this.format]` so a same-format round-trip is recoverable.
- Declare `capabilities.features` as the exact `ReadonlySet<UniversalFeature>`
  it can faithfully carry — no more, no less (P4).

**MUST NOT:**

- Read or write bytes (that is the parser/writer's job; the adapter receives and
  returns built objects).
- Import a concrete parser or writer. It depends on the `<format>.ts` **type**
  only; its `parser`/`writer` members are supplied by injection/subclass wiring.

### 4.5 Universal Document — `universal-document.ts` (Tier 2 core)

**Provides:** the `UniversalDocument` IR and its node types.

**MUST** express the four parts (P2) as distinct top-level fields:

- `meta` — descriptive metadata (title, authors, dates, language, identifiers,
  custom).
- `resources` — assets (images/fonts/media) addressed by `id`; content
  references them by id and MUST NOT inline binary payloads into body nodes.
- `body` — the block/inline tree, including a `Section` node that carries
  chapter/structure nesting independent of heading level.
- `original?: Record<string, unknown>` — per-format residue sidecar keyed by
  format id (the P3 residue layer at the hub level).

**MUST** carry `SchemaVersion`. **SHOULD** provide per-node `attr` with a
`source?` residue bag for same-format fidelity.

### 4.6 Capability vocabulary & feature probe (Tier 2 core)

**Provides:** the shared feature language and the document probe.

**MUST:**

- Define `UniversalFeature` as a **coarse** string-literal union owned solely by
  the unidoc core (e.g. `"images" | "tables" | "sections" | "lists" |
"footnotes" | "math" | "inlineStyles" | "metadata.authors" | "rawBlocks"`).
  Keep it coarse: track `"math"` as one token, not every construct.
- Define `featuresUsed(doc: UniversalDocument): Set<UniversalFeature>` as a
  **pure, format-independent** tree walk reporting which features actually appear
  in a given document. This is the single source of "what's in this doc."

**MUST NOT:** place capability data on any Tier-0 format type (that would couple
formats to the hub vocabulary, violating §4.1 and P5).

### 4.7 Engine — `engine.ts` (Tier 2)

**Provides:** the central `class UniDoc` (or `ConversionEngine`) owning all
mechanics beyond a single adapter's conversion.

**MUST:**

- Hold the parsers, writers, and adapters as **injected registries**
  (`Map<format, …>`), populated by the caller. It MUST NOT import concrete
  parsers/writers/adapters itself (P5).
- Implement conversion as composition:
  `write(to)( fromUniversal(to)( toUniversal(from)( parse(from)(input) ) ) )`.
- Own **loss tracking**: compute `featuresUsed(sourceUniversalDoc) −
targetAdapter.capabilities.features` and report the difference (§6).
- Produce a structured `ConversionReport` (lossy features, sidecar items
  preserved-but-unavailable, warnings).
- **MAY** provide format auto-detection by polling each parser's `canParse`.

**MUST NOT:** maintain a hardcoded per-format capability table; the registry of
adapters IS the capability library, read at runtime.

### 4.8 CLI — `cli.ts` (Tier 2, composition root)

**Provides:** the `unidoc ./input.md ./output.pdf` entry point.

**MUST:** infer `from`/`to` from file extensions; read input; construct the
engine; register the needed parser/writer/adapter trio(s); call convert; write
output; print the report. It is the **only** file permitted to import concrete
parsers/writers/adapters.

### 4.9 Base classes — `Parser.ts`, `Writer.ts`, `Adapter.ts`

- `Parser.ts` and `Writer.ts` MUST be **zero-import** (no `import` statements at
  all). Each declares its own `MaybePromise` and options type. These are the
  purest bricks and MUST stay reusable outside this system.
- `Adapter.ts` MAY import (as `import type`) `UniversalDocument`, `Parser`,
  `Writer`. It composes a `parser` and `writer` as abstract members and derives
  `decode`/`encode` (raw ⇄ universal) once for all subclasses.

---

## 5. Shared conventions

- **Header (MUST).** Every file opens with a comment block containing the format
  or component name, `Created: YYYY-MM-DD`, a one-line purpose, and (for formats)
  a spec reference.
- **SchemaVersion (MUST).** Every file exports `type SchemaVersion = "1.0.0"`;
  document instances record the version they were built against.
- **Naming (MUST).** Format type files are lowercase `<format>.ts`. Base classes
  are PascalCase (`Parser.ts`). Two files MUST NOT differ only by case
  (case-insensitive filesystems treat `adapter.ts` and `Adapter.ts` as one file).
- **`type` discriminants (MUST)** on union members.
- **Async uniformity (SHOULD).** Surface methods return `MaybePromise<T>` so text
  formats stay sync while binary formats may be async.

---

## 6. Capability & loss model

There are exactly **three kinds of loss**, measured at three different seams:

1. **Parse loss** (bytes → `<Format>Document`). MUST be zero by design; the
   residue hatch exists to guarantee it. Verified by `write(parse(x)) === x`.
   A nonzero result indicts the **type or parser**, not the converter.
2. **Universalization loss** (`<Format>Document` → `UniversalDocument`).
   Unavoidable for format-specific features. The adapter routes the leftover into
   `original[format]`, so it survives a _same-format_ round-trip but is invisible
   cross-format. Reported as "preserved in sidecar, unavailable to other targets."
3. **Down-write loss** (`UniversalDocument` → target). The target cannot express
   something the document uses. Computed by the engine as
   `featuresUsed(doc) − targetAdapter.capabilities.features`.

**Who owns what (MUST):**

- The **adapter** declares static capability: `capabilities.features:
ReadonlySet<UniversalFeature>` — a build-time fact about the _format_.
- The **unidoc core** owns `featuresUsed(doc)` — a runtime fact about the
  _document_, format-independent.
- The **engine** owns the subtraction and the `ConversionReport`. Only it sees a
  source and a target together, so only it can compute an A→B loss.

The capability descriptor MUST NOT live on the format-type object (§4.6).

**`AdapterCapabilities` shape (normative sketch):**

```ts
interface AdapterCapabilities {
  readonly features: ReadonlySet<UniversalFeature>; // what this format can carry
  readonly losslessSerialization?: boolean; // claims write(parse(x)) === x
}
```

Governance constraint (MUST). When a new UniversalFeature token is added,
every adapter’s features set MUST be revisited so it neither over- nor
under-claims. Keep the vocabulary coarse to bound this tax.

## 7. The two-layer storage law (P3, expanded)

A format type that stores only { raw } is a file rename, not a model — it is
useless to consumers. A type with no residue hatch cannot guarantee
round-trip — it is incorrect. Every Tier-0 type MUST satisfy both:

    •	Structured layer: typed, queryable fields for everything a consumer would

plausibly read or manipulate (a docx’s paragraphs, a pdf’s pages, a csv’s
rows).
• Residue layer: raw/base64/original for the exotic remainder.

Conformance test (apply during audit):

(a) Can a consumer who has never read the format spec do something useful
using only the structured fields?
(b) Can a serializer reproduce the byte-exact file using structured +
residue together?
• Both true → the type conforms.
• Only (b) true → it is a glorified base64 blob; enrich the structured layer.
• Only (a) true → it is lossy; add residue hatches.

Binary/container formats (pdf, the OOXML/ODF families) legitimately lean harder
on residue, but MUST still expose a structured layer for their common 90%
(pages, paragraphs, cells, metadata).

## 8. Conformance checklists

Run the checklist for the file’s kind. Each line is PASS/FAIL; a failed MUST is a
blocking nonconformance.

### 8.1 Format Type (<format>.ts)

    •	Header with Created: date and purpose; spec reference present.
    •	Exports SchemaVersion.
    •	Types only — no functions, classes, or runtime values.
    •	Imports nothing but sibling Tier-0 bases.
    •	No reference to UniversalDocument/UniversalFeature.
    •	Root <Format>Document with separated meta + content.
    •	Discriminated unions on type for variant nodes.
    •	Ordered arrays where order/duplicates matter.
    •	Residue hatch (raw?/base64?) on open-ended nodes.
    •	Structured layer passes §7(a).

### 8.2 Parser / Writer (<format>.parser.ts / .writer.ts)

    •	Extends the correct base (Parser/Writer).
    •	Imports only its base + the one matching type.
    •	No UniversalDocument reference; no other format referenced.
    •	Parser populates residue fields; Writer prefers them — round-trip intended.

### 8.3 Adapter (<format>.adapter.ts)

    •	Extends Adapter<<Format>Document, TRaw>.
    •	Implements toUniversal + fromUniversal.
    •	Provides format, extensions, kind, parser, writer, capabilities.
    •	Does NOT read/write bytes; does NOT import a concrete parser/writer.
    •	Routes unmapped data to original[format].
    •	capabilities.features matches the format honestly.

### 8.4 Engine (engine.ts)

    •	Holds injected registries; imports no concrete parser/writer/adapter.
    •	Convert = the composition pipeline.
    •	Computes loss via featuresUsed − target.features; emits a report.
    •	No hardcoded capability table.

### 8.5 Universal core (universal-document.ts, capability vocabulary)

    •	Four parts present and separated (meta/resources/body/original).
    •	Section node carries structural nesting.
    •	UniversalFeature union + pure featuresUsed(doc) present and coarse.

### 8.6 Base classes

    •	Parser.ts / Writer.ts have zero imports.
    •	Adapter.ts uses import type only; derives decode/encode.

## 9. Agent alignment procedure

### 9.1 Classify

Determine the file’s kind from these signals (first match wins):

    •	Filename <x>.parser.ts → Parser; <x>.writer.ts → Writer;

<x>.adapter.ts → Adapter.
• Filename Parser.ts/Writer.ts/Adapter.ts → Base class.
• Filename universal-document.ts → Universal core;
engine.ts → Engine; cli.ts → CLI.
• Otherwise, if the file is <word>.ts exporting a <Word>Document type and no
runtime code → Format Type.
• Content signals override an ambiguous name: a class extends Parser is a
Parser regardless of filename; a toUniversal method means Adapter.

If no kind matches, halt and report — the file may be foreign to this system.

### 9.2 Audit

Load the matching Contract (§4.x) and Checklist (§8.x). Evaluate every item.
Record each as PASS / FAIL(MUST) / FAIL(SHOULD), with the offending line(s).

### 9.3 Remediate

For each FAIL, apply the minimal change that satisfies the rule:

    •	Wrong-tier import → remove it; if functionality is needed, move it behind

injection (Engine) or relocate the code to the correct tier.
• Function/value in a Tier-0 type → delete it or move it to the matching
Parser/Writer/Adapter.
• Missing residue hatch → add raw?: string (and base64? for binary) to
open-ended nodes.
• Thin structured layer (only-(b)) → add typed fields for the format’s common
constructs until §7(a) passes.
• Capability on a format type → remove it; move feature declaration to the
adapter.
• Adapter reading bytes → relocate byte logic to the parser/writer; have the
adapter operate on the built object.
• Engine hardcoding formats → replace with registry lookup.
• Missing header/SchemaVersion → add per §5.
• Case-colliding filenames → rename one; prefer the convention in §5.

Preserve public type/identifier names unless a rule requires the change; note any
rename so dependents can be updated.

### 9.4 Verify

    •	Dependency direction: the file’s imports satisfy its tier row in §3.
    •	Typecheck: the file (and the collection, if available) compiles under

tsc --strict with NodeNext resolution (cross-imports use .js specifiers).
• Naming/header/SchemaVersion present and correct.
• Round-trip note (for types/parsers/writers): state whether
write(parse(x)) === x is achievable with the current fields; if not, which
residue is missing.

Output: the classification, the audit table, the changes made (MUST), the
recommendations deferred (SHOULD), and the verification result.

## 10. Glossary

    •	Format Type / <Format>Document — Tier-0 structural model of one file

format; types only.
• Parser / Writer — Tier-1 bricks converting bytes ⇄ format object; oblivious
to the hub.
• Adapter — Tier-2 spoke converting format object ⇄ Universal Document.
• Universal Document — the pivot IR; four separated parts.
• Residue — format-specific data with no universal equivalent, stored in
raw/base64/original to guarantee reconstruction.
• UniversalFeature — coarse capability token in the shared vocabulary.
• Engine — central class owning conversion composition, loss tracking, and
reporting via injected registries.
• Composition root — the CLI; the only place concrete implementations are
wired together.
