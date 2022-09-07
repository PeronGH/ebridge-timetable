import { DOMParser } from 'https://deno.land/x/deno_dom@v0.1.34-alpha/deno-dom-wasm.ts';
import { parseTimetable } from './mod.ts';

const document = new DOMParser().parseFromString(
  Deno.readTextFileSync('XJTLU e-Bridge.html').toString(),
  'text/html'
)!;

const lessons = parseTimetable(document);



console.table(lessons);
