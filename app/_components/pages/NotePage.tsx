"use client";

import Link from "next/link";
import { BiSolidLockAlt } from "react-icons/bi";

type NotePageProps = {
  note: Note;
  pages: Page[];
  author: User | null;
};

const NotePage = ({ note, pages, author }: NotePageProps) => {
  return (
    <div className="grow flex justify-center bg-gray-100">
      <div className="container mx-auto p-4 bg-white">
        <div className="mb-4">
          <p className="text-gray-700 mb-2 flex gap-1 items-center">
            <span className="select-none">{note.is_private && <BiSolidLockAlt />}</span>
            <span className="underline">
              <Link href="/notes/[noteSlug]" as={`/notes/${note.slug}`}>
                {note.slug}
              </Link>
            </span>
          </p>
          <h1 className="text-2xl font-semibold mb-4 text-gray-700">
            {note.title}
          </h1>
          <div className="text-gray-500 text-sm mb-4 flex flex-col">
            <p className="flex flex-row gap-3">
              <span>Created: {note.created_at.toLocaleString()}</span>
              <span>Updated: {note.updated_at.toLocaleString()}</span>
            </p>
            {author && (
              <p className="flex flex-row gap-3">
                <span>Author: {author.username}</span>
              </p>
            )}
          </div>
          <div className="mb-2 text-gray-700">
            <p>{note.summary}</p>
          </div>
        </div>
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-4 text-gray-700 select-none">Pages</h2>
          <ul className="space-y-2 border-2 border-gray-300 p-4">
            {pages.map((page) => (
              <li
                className="flex items-center space-x-4 mb-2 text-gray-700 border-b-2 border-gray-300 pb-1"
                key={page.page_id}
              >
                <span>{page.position.toString().padStart(2, "0")}</span>
                <Link href="/notes/[noteSlug]/[pageSlug]" as={`/notes/${note.slug}/${page.slug}`}>
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
