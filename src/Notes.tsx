import { useLiveQuery } from "dexie-react-hooks"
import { db } from "./db"
import { Fragment } from "react"

const PLACEHOLDER_TEXT = "New note"

export default function Notes() {
  const notes = useNotes()

  return (
    <>
      {notes.map((note) => (
        <Fragment key={note.id}>
          {note.text && (
            <div
              className="p-2 border-b outline-none"
              contentEditable
              dangerouslySetInnerHTML={{ __html: note.text }}
              suppressContentEditableWarning
              onBlur={(event) => {
                if (!note.id) return
                const text = event.currentTarget.innerHTML.trim()
                if (text === "<br>") db.notes.delete(note.id)
                else db.notes.update(note.id, { text })
              }}
            />
          )}
          {note.imageUrl && <img src={note.imageUrl} />}
        </Fragment>
      ))}
      <div
        className="p-2 border-b outline-none"
        contentEditable
        suppressContentEditableWarning
        onFocus={(event) => (event.currentTarget.innerHTML = "")}
        onBlur={(event) => {
          const text = event.currentTarget.innerHTML.trim()
          if (text === PLACEHOLDER_TEXT || text === "<br>") return
          db.notes.add({ text })
          event.currentTarget.innerHTML = PLACEHOLDER_TEXT
        }}
      >
        {PLACEHOLDER_TEXT}
      </div>
      <label htmlFor="new-image" className="block p-2 outline-none">
        New image
        <input
          id="new-image"
          className="hidden"
          type="file"
          onChange={async (event) => {
            const [file] = event.target.files ?? []
            if (!file) return
            event.currentTarget.value = ""
            db.notes.add({ image: await file.arrayBuffer() })
          }}
        />
      </label>
    </>
  )
}

function useNotes() {
  const rawNotes = useLiveQuery(() => db.notes.toArray()) ?? []
  return rawNotes.map((rawNote) =>
    Object.create(rawNote, {
      imageUrl: {
        get() {
          if (!this.image) return
          return URL.createObjectURL(new Blob([this.image]))
        },
      },
    })
  )
}
