/**
 * ODF (OpenDocument Format) — shared container base (types only)
 * Created: 2026-06-15  |  Schema version: 1.0.0
 *
 * The ZIP + manifest + Dublin-core metadata layer shared by odt/ods/odp.
 * Sits on top of the generic ZIP container. No functions.
 *
 * Spec: ISO/IEC 26300 / OASIS OpenDocument 1.3
 */
import type { ZipArchive } from "./zip-container.js";
export interface OdfContainer {
  archive?: ZipArchive; // underlying ZIP (mimetype first & stored)
  mimetype: string; // e.g. application/vnd.oasis.opendocument.text
  manifest: OdfManifest; // META-INF/manifest.xml
  documentMeta?: OdfMeta; // meta.xml
  stylesRaw?: string; // styles.xml
  settingsRaw?: string; // settings.xml
  contentRaw?: string; // content.xml (authoritative; structured view layered per format)
}
export interface OdfManifest {
  entries: Array<{ fullPath: string; mediaType: string; version?: string }>;
}
/** Dublin-core + ODF meta (meta.xml). */
export interface OdfMeta {
  title?: string;
  subject?: string;
  description?: string;
  creator?: string;
  initialCreator?: string;
  keywords?: string[];
  language?: string;
  generator?: string;
  created?: string;
  modified?: string;
  editingCycles?: number;
  editingDuration?: string;
  userDefined?: Record<string, string>;
}
