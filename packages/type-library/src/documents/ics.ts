/**
 * iCalendar (.ics) — structural model (types only)
 * Created: 2026-06-15  |  Schema version: 1.0.0
 *
 * A reconstructable model of an iCalendar object: nested components (VEVENT,
 * VTODO, VTIMEZONE, VALARM, ...) and content lines with parameters. Line folding
 * and exact value text preserved for fidelity. No functions.
 *
 * Spec: RFC 5545 (+ RFC 7986 extensions)
 */
import type { SchemaVersionData } from "../version/schema-version.js";

/** Bespoke schema version for the ics document model. Bump when THIS model changes. */
export const icsSchemaVersion: SchemaVersionData = { major: 1, minor: 0, patch: 0 };

export interface IcsCalendar {
  meta: IcsMeta;
  /** The root VCALENDAR (and rarely, multiple). */
  components: IcsComponent[];
}
export interface IcsMeta {
  schemaVersion: SchemaVersionData;
  lineEnding?: "\r\n" | "\n"; // RFC mandates CRLF
}

export interface IcsComponent {
  type: "component";
  name: string; // "VCALENDAR", "VEVENT", "VTIMEZONE", "VALARM", ...
  properties: IcsProperty[];
  components: IcsComponent[]; // nested (e.g. VALARM within VEVENT)
}
export interface IcsProperty {
  type: "property";
  name: string; // "DTSTART", "SUMMARY", "RRULE", "X-CUSTOM", ...
  params: IcsParam[]; // ordered; e.g. TZID, VALUE, CN
  value: string; // exact value text (decode per VALUE type as needed)
  valueType?: string; // hint: TEXT, DATE-TIME, DATE, DURATION, ...
  raw?: string; // original unfolded line
}
export interface IcsParam {
  name: string;
  value: string;
  quoted?: boolean;
}
