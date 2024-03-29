import { parseTimetable } from "./parser.ts";
import { genCalendar } from "./main.ts";
import { DOMParser } from "./deps.ts";

export { DOMParser, genCalendar, parseTimetable };

export function stringToIcs(text: string) {
  const document = new DOMParser().parseFromString(text, "text/html")!;

  const lessons = parseTimetable(document);

  const calendar = genCalendar(lessons);

  return calendar.toString();
}
