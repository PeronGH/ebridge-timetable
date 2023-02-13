import { EventConfig, RecurrenceRule, Event, Calendar, Day } from './deps.ts';
import { Lesson } from './parser.ts';

const WEEK1_FIRST_DAY = [2023, 1, 13];

const getMondayOfWeek = (n: number) => {
    const [year, month, date] = WEEK1_FIRST_DAY;
    return new Date(year, month, (n - 1) * 7 + date);
};

const getDayCode = (day: Day) => {
  switch (day) {
    case 'MO':
      return 0;
    case 'TU':
      return 1;
    case 'WE':
      return 2;
    case 'TH':
      return 3;
    case 'FR':
      return 4;
    case 'SA':
      return 5;
    case 'SU':
      return 6;
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
    // eg. [11:00, 11:30, 12:00] => [11,0]

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

      const rrule: RecurrenceRule = {
        freq: 'WEEKLY',
        until:
          weekDuration.length >= 2
            ? new Date(
                firstMonday.getTime() +
                  86400 * 7e3 * (weekDuration[1] - weekDuration[0] + 1)
              )
            : new Date(firstMonday.getTime() + 86400 * 7e3),
      };

      const cfg: EventConfig = {
        title,
        beginDate: new Date(firstMonday.getTime() + timeSinceMonday),
        desc,
        duration,
        rrule,
        alarm: {
          desc: `${title} will start in 30 minutes`,
          advance: 30,
        },
      };

      const evt = new Event(cfg);

      events.push(evt);
    }
  }
  return new Calendar(events);
}
