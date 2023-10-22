import { useLiveQuery } from "dexie-react-hooks"
import { Note, db } from "./db"

// const PLACEHOLDER_TEXT = "New note"

export default function Notes() {
  const notes = useNotes()

  return (
    <main className="pb-[50vh]">
      {notes.map((note) => (
        <div key={note.id} className="relative">
          {note.text != null && (
            <div
              autoFocus={note.autofocus}
              className="p-2 min-h-[100px] border-b outline-none"
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
          <button
            onClick={() => {
              if (note.id) db.notes.delete(note.id)
            }}
            className="absolute top-2 right-2 aspect-square w-8 bg-white rounded-md text-lg leading-none pb-[1.5px] border border-black/5"
          >
            &times;
          </button>
        </div>
      ))}
      <div className="fixed bottom-0 w-full bg-white flex divide-x border-t">
        <button
          className="flex-1 py-4"
          onClick={() => {
            db.notes.add({ text: "", autofocus: true })
          }}
        >
          New text
        </button>
        {/* <div
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
        </div> */}
        <label htmlFor="new-image" className="flex-1 text-center py-4">
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
      </div>
    </main>
  )
}

function useNotes(): (Note & { imageUrl: string })[] {
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
