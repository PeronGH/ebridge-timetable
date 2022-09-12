import { HTMLDocument, Day } from './deps.ts';

export const DAYS: Day[] = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'];

const customDays: Day[] = [];

export function parseTimetable(document: HTMLDocument) {
  const lessonDict: { [title: string]: Lesson } = {};

  const table = document.querySelector('.maintable')!;
  const tbody = table.firstElementChild!;

  const rows = tbody.children;

  for (let row_i = 0; row_i < rows.length; ++row_i) {
    if (row_i === 0) {
      // First row (days of the week)
      for (const cell of rows[row_i].children) {
        const day = cell.textContent.trim().slice(0, 2).toUpperCase() as Day;
        customDays.push(day);
      }
    }
    // Walk through every row
    const row = rows[row_i];

    // Time will be set later
    let time = '';

    const cells = row.children;

    for (let col_i = 0; col_i < cells.length; ++col_i) {
      const day = customDays[col_i]!;
      // Walk through every cell
      const cell = cells[col_i];

      // Get start time
      if (col_i === 0) {
        time = cell.textContent;
        continue;
      }

      // Handle lesson cells
      if (cell.className.includes('nonemptycell')) {
        const details = cell.firstElementChild!.firstElementChild!.children;

        const title = details[0].textContent.trim();

        const lessonRef = lessonDict[title];

        if (lessonRef === undefined) {
          const lesson: Lesson = {
            teachers: details[1].textContent.trim(),
            location: details[2].textContent.trim(),
            weeks: details[3].textContent.trim(),
            day,
            time: [time],
          };
          lessonDict[title] = lesson;
        } else {
          lessonRef.time.push(time);
        }
      }
    }
  }

  return lessonDict;
}

export type Lesson = {
  teachers: string;
  location: string;
  weeks: string;
  day: Day;
  time: string[];
};
