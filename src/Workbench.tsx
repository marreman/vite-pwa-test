import { useLiveQuery } from "dexie-react-hooks"
import { useState, useEffect } from "react"
import { db } from "./db"

export default function Workbench() {
  const workbench = useWorkbench()

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const [file] = e.target.files ?? []
    if (file) workbench.saveImage(file)
  }

  return (
    <>
      <h1 className="text-2xl">PWA test</h1>
      <h2 className="text-xl mt-5 mb-3">Storing text</h2>
      <p>
        {workbench && (
          <button
            className="border px-3 py-2 rounded-md"
            onClick={workbench.incrementCount}
          >
            Count is {workbench.count ?? "?"}
          </button>
        )}
      </p>
      <h2 className="text-xl mt-5 mb-3">Storing images</h2>
      <p>
        <input type="file" onChange={handleFileChange} />
      </p>
      <p>
        <img src={workbench.imageURL} style={{ maxWidth: "100%" }} />
      </p>
      <h2 className="text-xl mt-5 mb-3">Storage information</h2>
      <p>
        <button
          className="border px-3 py-2 rounded-md"
          onClick={workbench.askForPersistedStorage}
        >
          Ask for persisted storage
        </button>
      </p>
      <p>
        Persisted storage granted:{" "}
        <code>{workbench.storagePersisted?.toString() ?? "?"}</code>
      </p>
      <p>Persisted storage estimate:</p>
      <dl>
        <dt>Quota</dt>
        <dd>{workbench.storageEstimate?.quota?.toFixed()} MiB</dd>
        <dt>Usage</dt>
        <dd>{workbench.storageEstimate?.usage?.toFixed()} MiB</dd>
      </dl>
    </>
  )
}

function useWorkbench() {
  const [storageEstimate, setStorageEstimate] = useState<StorageEstimate>()
  const [storagePersisted, setStoragePersisted] = useState<boolean>()
  const [count] = useLiveQuery(() => db.counts.toArray()) ?? []

  function incrementCount() {
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
    async askForPersistedStorage() {
      if (!(await navigator.storage.persisted())) {
        const allowed = await navigator.storage.persist()
        setStoragePersisted(allowed)
      }
    },
    count: count?.amount,
    incrementCount,
    imageURL: count?.image && URL.createObjectURL(new Blob([count.image])),
    async saveImage(file: File) {
      const buffer = await file.arrayBuffer()
      if (count?.id) {
        return db.counts.update(count.id, { ...count, image: buffer })
      } else {
        return db.counts.add({ amount: 0, image: buffer })
      }
    },
  }
}
