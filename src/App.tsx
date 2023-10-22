import { useCount } from "./count"

function App() {
  const count = useCount()
  return (
    <>
      <p>
        {count && (
          <button onClick={count.increment}>
            Count is {count.amount ?? "?"}
          </button>
        )}
      </p>
      <h2>Storage</h2>
      <p>
        <button onClick={count.askForPersistedStorage}>
          Ask for persisted storage
        </button>
      </p>
      <p>
        Persisted storage granted: {count.storagePersisted?.toString() ?? "?"}
      </p>
      <p>Persisted storage estimate:</p>
      <dl>
        <dt>Quota</dt>
        <dd>{count.storageEstimate?.quota?.toFixed()} MiB</dd>
        <dt>Usage</dt>
        <dd>{count.storageEstimate?.usage?.toFixed()} MiB</dd>
      </dl>
    </>
  )
}

export default App
