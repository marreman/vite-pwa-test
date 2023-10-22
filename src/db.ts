import Dexie, { Table } from "dexie"

export interface Count {
  id?: number
  amount: number
  image?: ArrayBuffer
}

export interface Note {
  id?: number
  text?: string
  image?: ArrayBuffer

  autofocus?: boolean
}

export class Database extends Dexie {
  counts!: Table<Count>
  notes!: Table<Note>

  constructor() {
    super("myDatabase")
    this.version(2).stores({
      counts: "++id",
      notes: "++id",
    })
  }
}

export const db = new Database()
