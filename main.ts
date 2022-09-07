import { DOMParser, EventConfig } from './deps.ts';
import { parseTimetable, Lesson } from './parser.ts';

export function generateICS(lessons: { [title: string]: Lesson }) {
  const events: EventConfig[] = [];

  for (const title in lessons) {
    const lesson = lessons[title];

    const desc = lesson.location;
    const duration = lesson.time.length * 30 * 60;
    const byDay = lesson.day;

    const weeks = lesson.weeks
      .slice(5)
      .split(',')
      .map(weekDuration =>
        weekDuration
          .trim()
          .split('-')
          .map(week => parseInt(week))
      );

    for (const week of weeks) {
    }

    console.log(weeks);
  }
}
