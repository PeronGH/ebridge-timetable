import { DOMParser, EventConfig } from './deps.ts';
import { parseTimetable } from './parser.ts';

const document = new DOMParser().parseFromString(
  Deno.readTextFileSync('XJTLU e-Bridge.html').toString(),
  'text/html'
)!;

const lessons = parseTimetable(document);

console.table(lessons);

for (const title in lessons) {
  const lesson = lessons[title];
}
