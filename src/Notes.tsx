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
          <div id={"note-" + note.id}>
            {note.text && (
              <div
                contentEditable
                dangerouslySetInnerHTML={{ __html: note.text }}
                suppressContentEditableWarning
                onBlur={(event) => {
                  if (!note.id) return
                  const text = event.currentTarget.innerHTML.trim()
                  console.log(text)
                  if (text === "<br>") db.notes.delete(note.id)
                  else db.notes.update(note.id, { text })
                }}
              />
            )}
            {note.imageUrl && (
              <img src={note.imageUrl} style={{ maxWidth: "100%" }} />
            )}
          </div>
          <hr />
        </Fragment>
      ))}
      <div
        contentEditable
        suppressContentEditableWarning
        onBlur={(event) => {
          if (event.currentTarget.innerHTML === PLACEHOLDER_TEXT) return
          createTextNote(event.currentTarget.innerHTML)
          event.currentTarget.innerHTML = PLACEHOLDER_TEXT
        }}
      >
        {PLACEHOLDER_TEXT}
      </div>
      <input
        type="file"
        onChange={async (event) => {
          const [file] = event.target.files ?? []
          if (!file) return
          event.currentTarget.value = ""
          db.notes.add({ image: await file.arrayBuffer() })
        }}
      />
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

function createTextNote(text: string) {
  db.notes.add({ text })
}
