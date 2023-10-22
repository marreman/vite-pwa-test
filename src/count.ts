import { useLiveQuery } from "dexie-react-hooks"
import { db } from "./db"
import { useState } from "react"

export function useCount() {
  const [persisted, setPersisted] = useState<boolean>()
  const [count] = useLiveQuery(() => db.counts.toArray()) ?? []

  function incrementCount() {
    if (count?.id) {
      return db.counts.update(count.id, { ...count, amount: count.amount + 1 })
    } else {
      return db.counts.add({ amount: 1 })
    }
  }

  return {
    persisted,
    amount: count?.amount,
    increment: () => {
      incrementCount().then(async () => {
        const isPersisted = await navigator.storage.persisted()
        setPersisted(isPersisted)
        console.log(`Persisted storage granted: ${isPersisted}`)
      })
    },
  }
}
