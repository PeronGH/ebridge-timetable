import { DOMParser, parseTimetable, genCalendar } from './mod.ts';

Deno.test({
  name: 'gen ics',
  fn() {
    const document = new DOMParser().parseFromString(
      Deno.readTextFileSync('XJTLU e-Bridge.html').toString(),
      'text/html'
    )!;

    const lessons = parseTimetable(document);

    console.log(lessons);

    const calendar = genCalendar(lessons);

    Deno.writeTextFileSync('test.ics', calendar.toString());
  },
});
