import { EventConfig, RecurrenceRule, Event, Calendar } from './deps.ts';
import { Lesson } from './parser.ts';

const FIRST_DAY = [2022, 9, 6];

const getMondayOfWeek = (n: number) => {
  const [year, month, date] = FIRST_DAY;
  return new Date(year, month, (n - 1) * 7 + date);
};

export function generateICS(lessons: { [title: string]: Lesson }) {
  const events: Event[] = [];

  for (const title in lessons) {
    const lesson = lessons[title];

    const desc = lesson.location;
    const duration = lesson.time.length * 30 * 60;
    const day = lesson.day;

    const weeks = lesson.weeks
      .slice(5)
      .split(',')
      .map(weekDuration =>
        weekDuration
          .trim()
          .split('-')
          .map(week => parseInt(week))
      );

    for (const weekDuration of weeks) {
      const firstMonday = getMondayOfWeek(weekDuration[0]);
      const lastWeek = weekDuration[weekDuration.length - 1];

      const rrule: RecurrenceRule = {
        freq: 'DAILY',
        byDay: [day],
        until: getMondayOfWeek(lastWeek + 1),
      };

      const cfg: EventConfig = {
        title,
        beginDate: firstMonday,
        desc,
        duration,
        rrule,
      };

      const evt = new Event(cfg);

      events.push(evt);
    }
  }
  return new Calendar(events);
}
