import { atom } from "jotai";

export const notesAtom = atom([
  {
    date: "2023-09-15T12:34:56",
    text: "Пятая заметка",
    isStriked: false,
    showCheckbox: false,
  },
  {
    date: "2023-10-17T12:34:56",
    text: "Первая заметка здесь много текста здесь много текст здесь много текст здесь много текст здесь много текст здесь много текст",
    isStriked: false,
    showCheckbox: false,
  },
  {
    date: "2023-11-05T12:34:56",
    text: "Вторая заметка",
    isStriked: false,
    showCheckbox: false,
  },
]);

export const currentNoteIndexAtom = atom<number | null>(null);
