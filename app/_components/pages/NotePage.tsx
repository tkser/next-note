"use client";

import Link from "next/link";

type NotePageProps = {
  note: Note;
  pages: Page[];
};

const NotePage = ({ note, pages }: NotePageProps) => {
  return (
    <div className="grow flex justify-center bg-gray-100">
      <div className="container mx-auto p-4 bg-white">
        <div className="mb-4">
          <p className="text-gray-700 mb-2">
            <span className="select-none">{note.is_private && "🔒"}</span>
            <span className="underline">
              <Link href={`/notes/${note.slug}`}>
                {note.slug}
              </Link>
            </span>
          </p>
          <h1 className="text-2xl font-semibold mb-4 text-gray-700">
            {note.title}
          </h1>
          <div className="mb-2 text-gray-700">
            <p>{note.summary}</p>
          </div>
        </div>
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Pages</h2>
          <ul className="space-y-2 border-2 border-gray-300 p-4">
            {pages.map((page) => (
              <li
                className="flex items-center space-x-4 mb-2 text-gray-700 border-b-2 border-gray-300 pb-1"
                key={page.page_id}
              >
                <span>{page.position.toString().padStart(2, "0")}</span>
                <Link href={`/notes/${note.slug}/${page.slug}`}>
                  <span>{page.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NotePage;
