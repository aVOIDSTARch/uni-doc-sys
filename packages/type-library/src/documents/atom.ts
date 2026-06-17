/**
 * Atom (RFC 4287) — structural feed model (types only)
 * Created: 2026-06-15  |  Schema version: 1.0.0
 *
 * A reconstructable model of an Atom feed: feed-level metadata + entries, with
 * typed text constructs (text/html/xhtml) and an extensions bag. No functions.
 *
 * Spec: RFC 4287 (Atom Syndication Format)
 */
import type { SchemaVersionData } from "../version/schema-version.js";

/** Bespoke schema version for the atom document model. Bump when THIS model changes. */
export const atomSchemaVersion: SchemaVersionData = { major: 1, minor: 0, patch: 0 };

export interface AtomDocument {
  meta: { schemaVersion: SchemaVersionData };
  feed: AtomFeed;
}
export interface AtomText {
  type?: "text" | "html" | "xhtml";
  value: string;
}
export interface AtomPerson {
  name: string;
  uri?: string;
  email?: string;
}
export interface AtomLink {
  href: string;
  rel?: string;
  type?: string;
  hreflang?: string;
  title?: string;
  length?: number;
}
export interface AtomCategory {
  term: string;
  scheme?: string;
  label?: string;
}

export interface AtomFeed {
  id: string;
  title: AtomText;
  subtitle?: AtomText;
  updated: string;
  authors?: AtomPerson[];
  contributors?: AtomPerson[];
  links?: AtomLink[];
  categories?: AtomCategory[];
  generator?: { value: string; uri?: string; version?: string };
  icon?: string;
  logo?: string;
  rights?: AtomText;
  entries: AtomEntry[];
  extensions?: Array<{
    name: string;
    value?: string;
    attrs?: Record<string, string>;
    raw?: string;
  }>;
}
export interface AtomEntry {
  id: string;
  title: AtomText;
  updated: string;
  published?: string;
  authors?: AtomPerson[];
  contributors?: AtomPerson[];
  links?: AtomLink[];
  categories?: AtomCategory[];
  summary?: AtomText;
  content?: AtomText & { src?: string };
  rights?: AtomText;
  extensions?: Array<{
    name: string;
    value?: string;
    attrs?: Record<string, string>;
    raw?: string;
  }>;
}
