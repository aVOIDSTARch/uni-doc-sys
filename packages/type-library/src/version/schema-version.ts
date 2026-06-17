/**
 * schema-version — versioning data shape (types only)
 * Created: 2026-06-15  |  Schema version: 1.0.0
 *
 * SchemaVersion is the INERT, dependency-free representation of a semantic
 * version, suitable for storage inside Tier-0 format-type files and inside a
 * document's `meta`. It carries no behavior — increment/format/compare logic
 * lives in the SemanticVersion class (see ./semantic-version), which hydrates
 * from this shape via `SemanticVersion.from(data)` and serializes back via
 * `instance.toData()`.
 *
 * Why a separate data type: a Tier-0 format type MUST contain types only (no
 * runtime imports). Holding a SemanticVersion *instance* would drag a class
 * dependency into every format file and break that rule, so the file stores
 * this plain shape instead.
 */

/** Bespoke schema version for the atom document model. Bump when THIS model changes. */
export const schemaSchemaVersion: SchemaVersionData = { major: 1, minor: 0, patch: 0 };

/**
 * The structured, serializable form of a semantic version. Mirrors the
 * SemanticVersion constructor field-for-field so the two round-trip cleanly.
 */
export interface SchemaVersionData {
  major: number;
  minor: number;
  patch: number;
  /** Pre-release label, e.g. "alpha" / "rc" (the dotted-suffix segment). */
  preRelease?: string;
  /** Numeric counter that follows the pre-release label, e.g. rc.2 -> 2. */
  preReleaseVersNum?: number;
  /** Build-metadata segments (the part after "+"). */
  buildParts?: string[];
}
