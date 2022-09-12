import { Lesson, DAYS } from './parser.ts';
import { genCalendar } from './mod.ts';

const lessons: { [title: string]: Lesson } = {};
let day = DAYS[0];

const help = `
new - Create a new lesson entry
show - Show the timetable
help - Show this message
day <num> - Set day of the week, 1 for monday (Default), and 7 for sunday
finish - Generate timetable.ics file and exit
delete <title> - Delete
`
  .split('\n')
  .filter(l => l.includes(' - '))
  .map(l =>
    l
      .split(' - ')
      .map((v, i) => {
        if (i === 0) return v.padEnd(16, ' ');
        else return v;
      })
      .join('')
  )
  .join('\n');

const nextTime = (t: string) => {
  const time = t.split(':').map(v => parseInt(v));
  const mapTime = (t: number[]) =>
    t.map(v => v.toString().padStart(2, '0')).join(':');
  if (time[1] === 0) {
    return mapTime([time[0], time[1] + 30]);
  } else if (time[1] === 30) {
    return mapTime([time[0] + 1, 0]);
  } else {
    throw new Error('Invalid time');
  }
};

console.log('Welcome to the interactive CLI of e-bridge Timetable parser');
console.log('\n' + help + '\n');

while (true) {
  const command = prompt('>', '')?.trim();
  if (!command) continue;

  // Process command
  if (command === 'new') {
    // Command: new
    console.log('Current day of week:', day);
    const startInput = prompt('This class starts from: (eg. 9:00 or 9)', '')!;
    const duration = prompt('This class lasts for: (hours)', '')!;

    const start = startInput.includes(':') ? startInput : `${startInput}:00`;

    const time = [start];

    let i = parseInt(duration) * 2;
    while (--i) {
      time.push(nextTime(time[time.length - 1]));
    }

    const paste = [];

    console.log('You can paste the class info now.');

    while (paste.length < 4) {
      const input = prompt('paste:', '')!.trim();
      if (!input) continue;
      else paste.push(input);
    }

    const lesson: Lesson = {
      teachers: paste[1],
      location: paste[2],
      weeks: paste[3],
      day,
      time,
    };

    lessons[paste[0]] = lesson;
  } else if (command === 'show') {
    // Command: show
    console.table(lessons);
  } else if (command === 'help') {
    // Command: help
    console.log(help);
  } else if (command.startsWith('day')) {
    // Command: day
    if (!command.startsWith('day ')) {
      console.log('Invalid usage of "day"');
      continue;
    }
    const newDay = command.split(/\s+/);
    const newDayId = parseInt(newDay[1]);

    if (1 <= newDayId && newDayId <= 7) {
      day = DAYS[newDayId - 1];
      console.log('Current day of the week set to', day);
    } else {
      console.log('Invalid day number, must be between 1 to 7');
    }
  } else if (command === 'finish') {
    // Command: finish
    const calendar = genCalendar(lessons);

    Deno.writeTextFileSync('./timetable.ics', calendar.toString());
  } else if (command.startsWith('delete')) {
    // Command: delete
    if (!command.startsWith('delete ')) {
      console.log('Invalid usage of "delete"');
      continue;
    }
    const title = command.slice(7).trim();
    delete lessons[title];
  } else {
    console.log('Unknown command');
  }
}
