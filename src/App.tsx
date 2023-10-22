import { useState } from "react"
import Notes from "./Notes"
import Workbench from "./Workbench"

export function App() {
  const [view, setView] = useState("workbench")

  return (
    <div className="p-3">
      <nav className="space-x-2">
        <button
          className="border px-3 py-2 rounded-md"
          onClick={() => setView("workbench")}
        >
          Workbench
        </button>
        <button
          className="border px-3 py-2 rounded-md"
          onClick={() => setView("notes")}
        >
          Notes
        </button>
      </nav>
      {view === "workbench" ? <Workbench /> : <Notes />}
    </div>
  )
}
