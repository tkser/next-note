"use client";

import { useState } from "react";

type NoteEditPageProps = {
  note: Note;
  pages: Page[];
};

const NoteEditPage = ({ note, pages }: NoteEditPageProps) => {
  const [title, setTitle] = useState(note.title);
  const [slug, setSlug] = useState(note.slug);
  const [summary, setSummary] = useState(note.summary);
  const [is_private, setIsPrivate] = useState(note.is_private);
  const [note_pages] = useState(pages);

  return (
    <div className="grow flex items-center justify-center bg-gray-100">
      <div className="container mx-auto p-4 bg-white">
        <h1 className="text-2xl font-semibold mb-4 text-gray-700">Edit Note</h1>
        <form>
          <div className="mb-4">
            <label htmlFor="title" className="block text-gray-600">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              className="w-full border p-2 rounded focus:outline-none focus:border-blue-500 text-gray-700"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={127}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="slug" className="block text-gray-600">
              Slug
            </label>
            <input
              type="text"
              id="slug"
              name="slug"
              className="w-full border p-2 rounded focus:outline-none focus:border-blue-500 text-gray-700"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              maxLength={127}
              required
              pattern="^[0-9a-zA-Z_-]+$"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="summary" className="block text-gray-600">
              Summary
            </label>
            <textarea
              id="summary"
              name="summary"
              className="w-full border p-2 rounded focus:outline-none focus:border-blue-500 text-gray-700"
              rows={3}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              maxLength={300}
            ></textarea>
          </div>
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              id="private"
              name="private"
              className="p-2 rounded focus:outline-none focus:border-blue-500 text-gray-700 mr-2"
              checked={is_private}
              onChange={(e) => setIsPrivate(e.target.checked)}
            />
            <label htmlFor="private" className="text-gray-600">
              Private
            </label>
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Save
          </button>
        </form>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Page List
          </h2>
          <button className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 mb-4">
            Add Page
          </button>
          <ul>
            {note_pages.length === 0 && (
              <li className="text-gray-600">No pages yet.</li>
            )}
            {note_pages.map((page) => (
              <li
                className="flex items-center space-x-4 mb-2"
                key={page.page_id}
              >
                <span>{page.position}</span>
                <span className="text-gray-600">Title:</span>
                <span>{page.title}</span>
                <span className="text-gray-600">Slug:</span>
                <span>{page.slug}</span>
              </li>
            ))}
          </ul>
          <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mt-4">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteEditPage;
