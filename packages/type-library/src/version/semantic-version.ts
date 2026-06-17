/**
 * semantic-version — SemanticVersion value object (v2)
 * Created: 2026-06-15  |  Schema version: 1.0.0
 *
 * VERSION 2 of ts-kit's SemanticVersion. It is a corrected, immutable rewrite of
 * the original (src/classes/SemanticVersion.ts) and is published as a SEPARATE
 * file so the original behavior is not disturbed. When relocating into ts-kit,
 * decide explicitly whether this supersedes the original.
 *
 * CHANGES FROM V1 (all deliberate; two are behavior-breaking):
 *   1. Readonly getters added (major/minor/patch/preRelease/preReleaseVersNum/
 *      buildParts) — v1 had no way to read values back out.
 *   2. Static `parse(string)` and `from(SchemaVersionData)` added — v1 could not
 *      be rehydrated from stored data.  `toData()` added for the reverse.
 *   3. [BREAKING] `toCoreString()` now emits dotted SemVer "1.0.0".  V1 used the
 *      format string "{0}:{1}:{2}" and emitted "1:0:0" (colons), which is NOT
 *      valid SemVer.  Default core format string is now "{0}.{1}.{2}".
 *   4. [BREAKING] `increment(field)` is now IMMUTABLE — it returns a NEW
 *      SemanticVersion instead of mutating in place, and takes the typed
 *      `coreFieldName` enum instead of a loose string.  Incrementing MAJOR
 *      resets MINOR/PATCH to 0; incrementing MINOR resets PATCH to 0 (standard
 *      SemVer cascade — another correction over v1, which only bumped one field).
 *   5. `toFullStringWithOpts` join fixed: build parts are joined with "."; the
 *      pre-release version number is only appended when a pre-release exists.
 *
 * DEPENDENCY NOTE: v1 imported `formatString` from ts-kit. To keep this v2 file a
 * zero-dependency brick (droppable anywhere), formatting is done with a small
 * private template-fill that honors the same "{0}.{1}.{2}" placeholder syntax.
 * If you prefer to reuse ts-kit's `formatString`, swap `fill()` for it on move.
 */
import type { SchemaVersionData } from "./schema-version.js";

/** Bespoke schema version for the atom document model. Bump when THIS model changes. */
export const semVerSchemaVersion: SchemaVersionData = { major: 1, minor: 0, patch: 0 };
/** Interface for a class that has one or more incrementable values. */
export interface Incrementable {
  increment(field: coreFieldName): Incrementable;
}

/** The three core SemVer fields, typed (replaces v1's loose string argument). */
export enum coreFieldName {
  MAJOR = "MAJOR",
  MINOR = "MINOR",
  PATCH = "PATCH",
}

export class SemanticVersion implements Incrementable {
  /** Internal marker so callers can distinguish this from the v1 class. */
  static readonly implementationVersion = 2 as const;

  static readonly description =
    "Given a version number MAJOR.MINOR.PATCH, increment the MAJOR version when " +
    "you make incompatible API changes, the MINOR version when you add " +
    "functionality in a backward compatible manner, and the PATCH version when " +
    "you make backward compatible bug fixes. Additional labels for pre-release " +
    "and build metadata are available as extensions to the " +
    "MAJOR.MINOR.PATCH-<PRERELEASE.PREVERS>+<BUILD.PART...> format.";

  /** Default core format: dotted SemVer (v1 used "{0}:{1}:{2}"). */
  static CoreFormattingString = "{0}.{1}.{2}";

  private readonly majorValue: number;
  private readonly minorValue: number;
  private readonly patchValue: number;
  private readonly preReleaseValue: string;
  private readonly preReleaseVersNumValue: number;
  private readonly buildPartValues: readonly string[];

  public constructor(
    major: number,
    minor: number,
    patch: number,
    preRelease?: string,
    preReleaseVersNum?: number,
    buildParts?: string[],
  ) {
    this.majorValue = major;
    this.minorValue = minor;
    this.patchValue = patch;
    this.preReleaseValue = preRelease ?? "";
    this.preReleaseVersNumValue = preRelease && preReleaseVersNum ? preReleaseVersNum : 0;
    this.buildPartValues = buildParts ? [...buildParts] : [];
  }

  /* ----------------------------- accessors ----------------------------- */
  public get major(): number {
    return this.majorValue;
  }
  public get minor(): number {
    return this.minorValue;
  }
  public get patch(): number {
    return this.patchValue;
  }
  public get preRelease(): string {
    return this.preReleaseValue;
  }
  public get preReleaseVersNum(): number {
    return this.preReleaseVersNumValue;
  }
  public get buildParts(): readonly string[] {
    return this.buildPartValues;
  }

  /* --------------------------- construction ---------------------------- */

  /** Hydrate from the inert SchemaVersionData shape (the storage form). */
  public static from(data: SchemaVersionData): SemanticVersion {
    return new SemanticVersion(
      data.major,
      data.minor,
      data.patch,
      data.preRelease,
      data.preReleaseVersNum,
      data.buildParts ? [...data.buildParts] : undefined,
    );
  }

  /**
   * Parse a SemVer-ish string "MAJOR.MINOR.PATCH[-pre[.num]][+build.parts]".
   * Throws on a malformed core triple.
   */
  public static parse(input: string): SemanticVersion {
    const [coreAndPre, buildRaw] = input.split("+", 2);
    const [core, preRaw] = coreAndPre.split("-", 2);
    const parts = core.split(".");
    if (parts.length !== 3 || parts.some((p) => !/^\d+$/.test(p))) {
      throw new Error(`Invalid core version triple: "${core}"`);
    }
    const [major, minor, patch] = parts.map((p) => Number(p));

    let preRelease: string | undefined;
    let preReleaseVersNum: number | undefined;
    if (preRaw) {
      const segs = preRaw.split(".");
      preRelease = segs[0];
      if (segs[1] && /^\d+$/.test(segs[1])) preReleaseVersNum = Number(segs[1]);
    }
    const buildParts = buildRaw ? buildRaw.split(".") : undefined;
    return new SemanticVersion(major, minor, patch, preRelease, preReleaseVersNum, buildParts);
  }

  /** Serialize back to the inert storage shape. */
  public toData(): SchemaVersionData {
    const data: SchemaVersionData = {
      major: this.majorValue,
      minor: this.minorValue,
      patch: this.patchValue,
    };
    if (this.preReleaseValue) data.preRelease = this.preReleaseValue;
    if (this.preReleaseVersNumValue) {
      data.preReleaseVersNum = this.preReleaseVersNumValue;
    }
    if (this.buildPartValues.length) {
      data.buildParts = [...this.buildPartValues];
    }
    return data;
  }

  /* ---------------------------- formatting ----------------------------- */

  public toCoreString(): string {
    return SemanticVersion.fill(
      SemanticVersion.CoreFormattingString,
      this.majorValue,
      this.minorValue,
      this.patchValue,
    );
  }

  public toFullStringWithOpts(
    withPreRelease: boolean,
    withPreReleaseVersNum: boolean,
    withBuildParts: boolean,
  ): string {
    let full = this.toCoreString();
    if (withPreRelease && this.preReleaseValue) {
      full += "-" + this.preReleaseValue;
      if (withPreReleaseVersNum && this.preReleaseVersNumValue) {
        full += "." + this.preReleaseVersNumValue;
      }
    }
    if (withBuildParts && this.buildPartValues.length) {
      full += "+" + this.buildPartValues.join(".");
    }
    return full;
  }

  /** Convenience: the canonical full SemVer string. */
  public toString(): string {
    return this.toFullStringWithOpts(true, true, true);
  }

  /* ---------------------------- mutation ------------------------------- */

  /**
   * Return a NEW version with `field` incremented and lower fields reset, per
   * SemVer cascade. Immutable: the receiver is unchanged. Throws on bad field.
   */
  public increment(field: coreFieldName): SemanticVersion {
    switch (field) {
      case coreFieldName.MAJOR:
        return new SemanticVersion(this.majorValue + 1, 0, 0);
      case coreFieldName.MINOR:
        return new SemanticVersion(this.majorValue, this.minorValue + 1, 0);
      case coreFieldName.PATCH:
        return new SemanticVersion(this.majorValue, this.minorValue, this.patchValue + 1);
      default:
        throw new Error("This value does not align with the required values");
    }
  }

  /* ----------------------------- compare ------------------------------- */

  /** -1 if this < other, 0 if equal core, 1 if this > other (core only). */
  public compareCore(other: SemanticVersion): -1 | 0 | 1 {
    if (this.majorValue !== other.majorValue) {
      return this.majorValue < other.majorValue ? -1 : 1;
    }
    if (this.minorValue !== other.minorValue) {
      return this.minorValue < other.minorValue ? -1 : 1;
    }
    if (this.patchValue !== other.patchValue) {
      return this.patchValue < other.patchValue ? -1 : 1;
    }
    return 0;
  }

  /** Minimal "{n}" placeholder fill, matching v1's format-string style. */
  private static fill(template: string, ...args: Array<string | number>): string {
    return template.replace(/\{(\d+)\}/g, (match, index) => {
      const value = args[Number(index)];
      return value === undefined ? match : String(value);
    });
  }
}
