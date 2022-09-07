import { DOMParser, parseTimetable, genCalendar } from './mod.ts';

Deno.test({
  name: 'gen_ics',
  fn() {
    const document = new DOMParser().parseFromString(
      Deno.readTextFileSync('XJTLU e-Bridge.html').toString(),
      'text/html'
    )!;

    const lessons = parseTimetable(document);

    console.table(lessons);

    const calendar = genCalendar(lessons);

    console.table(calendar.toLines());

    Deno.writeTextFileSync('test.ics', calendar.toString());
  },
});
