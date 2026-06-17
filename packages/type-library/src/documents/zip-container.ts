/**
 * ZIP container — shared archive base (types only)
 * Created: 2026-06-15  |  Schema version: 1.0.0
 *
 * The common substrate for every ZIP-based document format: EPUB (OCF),
 * OOXML (OPC: docx/xlsx/pptx) and OpenDocument (ODF: odt/ods/odp). This is
 * just the raw archive entries; each format layers its own structure on top.
 * No functions.
 */
export interface ZipArchive {
  entries: ZipEntry[];
}
export interface ZipEntry {
  path: string; // e.g. "OEBPS/content.opf"
  /** Text payload, OR base64 for binary — set exactly one. */
  text?: string;
  base64?: string;
  compression?: "stored" | "deflate";
  /** Fidelity notes, e.g. "must be the first entry and stored" (epub mimetype). */
  notes?: string;
}
