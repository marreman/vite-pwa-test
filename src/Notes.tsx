import { useLiveQuery } from "dexie-react-hooks"
import { Note, db } from "./db"
import { useEffect, useRef } from "react"

export default function Notes() {
  const notes = useNotes()

  return (
    <main className="pb-[50vh]">
      {notes.map((note) => (
        <div key={note.id} className="relative">
          {note.text != null && <TextNote note={note} />}
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
          onClick={async () => {
            await db.notes.add({ text: "", autofocus: true })
            const allTextNotes = Array.from(
              document.querySelectorAll("article")
            )
            const lastTextNote = allTextNotes[allTextNotes.length - 1]
            lastTextNote?.focus()
          }}
        >
          New text
        </button>
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

function TextNote({ note }: { note: Note }) {
  const el = useRef<HTMLElement>(null)
  useEffect(() => {
    if (!note.text) {
      el.current?.focus()
    }
  }, [])

  return (
    <article
      ref={el}
      className="p-2 min-h-[100px] border-b outline-none"
      contentEditable
      dangerouslySetInnerHTML={{ __html: note.text ?? "" }}
      suppressContentEditableWarning
      onBlur={(event) => {
        if (!note.id) return
        const text = event.currentTarget.innerHTML.trim()
        if (text === "<br>") db.notes.delete(note.id)
        else db.notes.update(note.id, { text })
      }}
    />
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
