import { useWorkbench } from "./workbench"

function App() {
  const workbench = useWorkbench()

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const [file] = e.target.files ?? []
    if (file) workbench.saveImage(file)
  }

  console.log(workbench.imageURL)

  return (
    <>
      <h1>PWA test</h1>
      <h2>Storing text</h2>
      <p>
        {workbench && (
          <button onClick={workbench.incrementCount}>
            Count is {workbench.count ?? "?"}
          </button>
        )}
      </p>
      <h2>Storing images</h2>
      <p>
        <input type="file" onChange={handleFileChange} />
      </p>
      <p>
        <img src={workbench.imageURL} style={{ maxWidth: "100%" }} />
      </p>
      <h2>Storage information</h2>
      <p>
        <button onClick={workbench.askForPersistedStorage}>
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

export default App
