import { useCount } from "./count"

function App() {
  const count = useCount()
  return (
    <>
      <p>
        {count && (
          <button onClick={count.increment}>Count is {count.amount}</button>
        )}
      </p>
      <p>Persisted storage granted: {count.persisted?.toString() ?? "?"}</p>
    </>
  )
}

export default App
