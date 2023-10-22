import Dexie, { Table } from "dexie"

export interface Count {
  id?: number
  amount: number
}

export class Database extends Dexie {
  counts!: Table<Count>

  constructor() {
    super("myDatabase")
    this.version(1).stores({
      counts: "++id", // Primary key and indexed props
    })
  }
}

export const db = new Database()
