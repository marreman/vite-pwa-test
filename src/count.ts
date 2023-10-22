import { useLiveQuery } from "dexie-react-hooks"
import { db } from "./db"
import { useEffect, useState } from "react"

export function useCount() {
  const [storageEstimate, setStorageEstimate] = useState<StorageEstimate>()
  const [storagePersisted, setStoragePersisted] = useState<boolean>()
  const [count] = useLiveQuery(() => db.counts.toArray()) ?? []

  function increment() {
    if (count?.id) {
      return db.counts.update(count.id, { ...count, amount: count.amount + 1 })
    } else {
      return db.counts.add({ amount: 1 })
    }
  }

  useEffect(() => {
    navigator.storage.estimate().then((estimate) => {
      setStorageEstimate({
        quota: (estimate.quota ?? 0) / 1024 / 1024,
        usage: (estimate.usage ?? 0) / 1024 / 1024,
      })
    })
  }, [])

  useEffect(() => {
    navigator.storage.persisted().then(setStoragePersisted)
  }, [])

  return {
    storageEstimate,
    storagePersisted,
    amount: count?.amount,
    increment,
    async askForPersistedStorage() {
      if (!(await navigator.storage.persisted())) {
        const allowed = await navigator.storage.persist()
        setStoragePersisted(allowed)
      }
    },
  }
}
