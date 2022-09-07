import { EventConfig, RecurrenceRule, Event, Calendar, Day } from './deps.ts';
import { Lesson } from './parser.ts';

const FIRST_DAY = [2022, 8, 5];

const getMondayOfWeek = (n: number) => {
  const [year, month, date] = FIRST_DAY;
  return new Date(year, month, (n - 1) * 7 + date);
};

const getDayCode = (day: Day) => {
  switch (day) {
    case 'MO':
      return 1;
    case 'TU':
      return 2;
    case 'WE':
      return 3;
    case 'TH':
      return 4;
    case 'FR':
      return 5;
    case 'SA':
      return 6;
    case 'SU':
      return 7;
  }
};

export function genCalendar(lessons: { [title: string]: Lesson }) {
  const events: Event[] = [];

  for (const title in lessons) {
    const lesson = lessons[title];

    const desc = lesson.location;
    const duration = lesson.time.length * 30 * 60;
    const day = lesson.day;
    const beginTime = lesson.time[0].split(':').map(t => parseInt(t));
    const timeSinceMonday =
      (getDayCode(day) * 86400 + beginTime[0] * 3600 + beginTime[1] * 60) * 1e3;

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
        beginDate: new Date(firstMonday.getTime() + timeSinceMonday),
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
