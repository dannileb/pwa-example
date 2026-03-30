import Dexie, { Table } from "dexie";

export interface Note {
  id?: number;
  title: string;
  text: string;
}

export class NotesDexie extends Dexie {
  notes!: Table<Note, Note["id"]>;

  constructor() {
    super("notesDB");
    this.version(1).stores({
      notes: "++id, text",
    });
  }
}

export const notesDB = new NotesDexie();
