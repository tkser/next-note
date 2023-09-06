"use client";

import Link from "next/link";

type TopPageProps = {
  notes: Note[];
}

const TopPage = ({ notes }: TopPageProps) => {
  return (
    <div className="grow flex justify-center bg-gray-100">
      <div className="container mx-auto p-4 bg-white">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold mb-4 text-gray-700">Notes</h1>
        </div>
        <ul>
          {notes.map((note) => (
            <li key={note.note_id} className="mb-4 border-b pb-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-700">
                  <Link href={`/notes/${note.slug}`}>
                    <span>{note.title}</span>
                  </Link>
                </h2>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default TopPage;
