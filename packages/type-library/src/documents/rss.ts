/**
 * RSS 2.0 (.rss / .xml) — structural feed model (types only)
 * Created: 2026-06-15  |  Schema version: 1.0.0
 *
 * A reconstructable model of an RSS 2.0 feed: channel metadata + items, with an
 * extensions bag for foreign-namespace elements (content:encoded, dc:, etc.). No functions.
 *
 * Spec: RSS 2.0
 */
import type { SchemaVersionData } from "../version/schema-version.js";

/** Bespoke schema version for the rss document model. Bump when THIS model changes. */
export const rssSchemaVersion: SchemaVersionData = { major: 1, minor: 0, patch: 0 };

export interface RssDocument {
  meta: { schemaVersion: SchemaVersionData; version: string }; // version "2.0"
  channel: RssChannel;
}
export interface RssChannel {
  title: string;
  link: string;
  description: string;
  language?: string;
  copyright?: string;
  pubDate?: string;
  lastBuildDate?: string;
  generator?: string;
  image?: { url: string; title: string; link: string };
  categories?: string[];
  items: RssItem[];
  /** Foreign-namespace channel elements, preserved by qualified name. */
  extensions?: Array<{
    name: string;
    value?: string;
    attrs?: Record<string, string>;
    raw?: string;
  }>;
}
export interface RssItem {
  title?: string;
  link?: string;
  description?: string;
  author?: string;
  categories?: string[];
  comments?: string;
  enclosure?: { url: string; length?: number; type?: string };
  guid?: { value: string; isPermaLink?: boolean };
  pubDate?: string;
  source?: { url: string; value: string };
  extensions?: Array<{
    name: string;
    value?: string;
    attrs?: Record<string, string>;
    raw?: string;
  }>;
}
