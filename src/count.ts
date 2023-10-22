import { useLiveQuery } from "dexie-react-hooks"
import { db } from "./db"

export function useCount() {
  const [count] = useLiveQuery(() => db.counts.toArray()) ?? []

  function incrementCount() {
    if (count?.id) {
      db.counts.update(count.id, { ...count, amount: count.amount + 1 })
    } else {
      db.counts.add({ amount: 1 })
    }
  }

  return {
    amount: count?.amount,
    increment: incrementCount,
  }
}
