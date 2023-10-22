import { useCount } from "./count"

function App() {
  const count = useCount()
  return (
    <>
      {count && (
        <button onClick={count.increment}>Count is {count.amount}</button>
      )}
    </>
  )
}

export default App
