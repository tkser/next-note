"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

type NoteEditPageProps = {
  note: Note;
  pages: Page[];
};

const NoteEditPage = ({ note, pages }: NoteEditPageProps) => {
  const [title, setTitle] = useState(note.title);
  const [slug, setSlug] = useState(note.slug);
  const [summary, setSummary] = useState(note.summary);
  const [is_private, setIsPrivate] = useState(note.is_private);
  const [note_pages, setNotePages] = useState(pages);
  const [showAddPageForm, setShowAddPageForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    isPrivate: note.is_private,
  });
  const router = useRouter();

  const handleSaveNote = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = {
      title,
      slug,
      summary,
      is_private,
    };
    try {
      const res = await fetch(`/api/notes/${note.note_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        next: { revalidate: false },
        credentials: "include",
      });
      const json = (await res.json()) as ApiResponse<ApiDataNoteResponse>;
      if (json.meta.message === "SUCCESS") {
        if (json.data) {
          note.title = json.data.note.title;
          note.slug = json.data.note.slug;
          note.summary = json.data.note.summary;
          note.is_private = json.data.note.is_private;
          note.updated_at = json.data.note.updated_at;
          setTitle(note.title);
          setSlug(note.slug);
          setSummary(note.summary);
          setIsPrivate(note.is_private);
          toast.success("Save Successful.");
        } else {
          toast.error("Something went wrong.");
        }
      } else if (json.meta.message === "BAD_REQUEST") {
        toast.error("Invalid data.");
      } else if (json.meta.message === "SLUG_CONFLICT") {
        toast.error("Slug is already taken.");
      } else {
        toast.error("Something went wrong.");
      }
    } catch (err) {
      toast.error("Something went wrong.");
    }
  };
  const handleRemoveNote = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/notes/${note.note_id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        next: { revalidate: false },
        credentials: "include",
      });
      const json = (await res.json()) as ApiResponse<ApiDataNoteResponse>;
      if (json.meta.message === "SUCCESS") {
        router.push("/dashboard");
        toast.success("Remove Successful.");
      } else {
        toast.error("Something went wrong.");
      }
    } catch (err) {
      toast.error("Something went wrong.");
    }
  };
  const handleAddPage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (showAddPageForm) {
      setShowAddPageForm(false);
      setFormData({ title: "", slug: "", isPrivate: false });
    } else {
      setShowAddPageForm(true);
    }
  };
  const handleRemovePage = async (page_id: string) => {
    try {
      const res = await fetch(`/api/notes/${note.note_id}/pages/${page_id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        next: { revalidate: false },
        credentials: "include",
      });
      const json = (await res.json()) as ApiResponse<ApiDataNoteResponse>;
      if (json.meta.message === "SUCCESS") {
        setNotePages(note_pages.filter((page) => page.page_id !== page_id));
        toast.success("Remove Successful.");
      } else {
        toast.error("Something went wrong.");
      }
    } catch (err) {
      toast.error("Something went wrong.");
    }
  };
  const handleAddPageSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = {
      title: formData.title,
      slug: formData.slug,
      is_private: is_private ? true : formData.isPrivate,
      note_id: note.note_id,
      position: note_pages.length + 1,
    };
    try {
      const res = await fetch(`/api/notes/${note.note_id}/pages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        next: { revalidate: false },
        credentials: "include",
      });
      setShowAddPageForm(false);
      setFormData({ title: "", slug: "", isPrivate: false });
      const json = (await res.json()) as ApiResponse<ApiDataPageResponse>;
      if (json.meta.message === "CREATED") {
        if (json.data) {
          setNotePages([...note_pages, json.data.page]);
          toast.success("Add Successful.");
        } else {
          toast.error("Something went wrong.");
        }
      } else if (json.meta.message === "BAD_REQUEST") {
        toast.error("Invalid data.");
      } else if (json.meta.message === "SLUG_CONFLICT") {
        toast.error("Slug is already taken.");
      } else {
        toast.error("Something went wrong.");
      }
    } catch (err) {
      toast.error("Something went wrong.");
    }
  };

  return (
    <div className="grow flex justify-center bg-gray-100">
      <div className="container mx-auto p-4 bg-white">
        <h1 className="text-2xl font-semibold mb-4 text-gray-700">Edit Note</h1>
        <form onSubmit={handleSaveNote}>
          <div className="mb-4">
            <label htmlFor="note_title" className="block text-gray-600">
              Title
            </label>
            <input
              type="text"
              id="note_title"
              name="title"
              className="w-full border p-2 rounded focus:outline-none focus:border-blue-500 text-gray-700"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={127}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="note_slug" className="block text-gray-600">
              Slug
            </label>
            <input
              type="text"
              id="note_slug"
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
            <label htmlFor="note_summary" className="block text-gray-600">
              Summary
            </label>
            <textarea
              id="note_summary"
              name="summary"
              className="w-full border p-2 rounded focus:outline-none focus:border-blue-500 text-gray-700"
              rows={2}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              maxLength={300}
            ></textarea>
          </div>
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              id="note_private"
              name="private"
              className="p-2 rounded focus:outline-none focus:border-blue-500 text-gray-700 mr-2"
              checked={is_private}
              onChange={(e) => setIsPrivate(e.target.checked)}
            />
            <label htmlFor="note_private" className="text-gray-600">
              Private
            </label>
          </div>
          <div className="mb-4 flex items-center">
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 select-none"
            >
              Save
            </button>
            <button
              type="button"
              className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 ml-2 select-none"
              onClick={handleRemoveNote}
            >
              Remove
            </button>
          </div>
        </form>
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Page List
          </h2>
          <button
            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 mb-4 select-none"
            onClick={handleAddPage}
          >
            Add Page
          </button>
          {showAddPageForm && (
            <form
              onSubmit={handleAddPageSubmit}
              className="border-2 border-gray-300 p-4 mb-2"
            >
              <div className="mb-4">
                <label htmlFor="page_title" className="block text-gray-600">
                  Title
                </label>
                <input
                  type="text"
                  id="page_title"
                  name="title"
                  className="w-full border p-2 rounded focus:outline-none focus:border-blue-500 text-gray-700"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  maxLength={127}
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="page_slug" className="block text-gray-600">
                  Slug
                </label>
                <input
                  type="text"
                  id="page_slug"
                  name="slug"
                  className="w-full border p-2 rounded focus:outline-none focus:border-blue-500 text-gray-700"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  maxLength={127}
                  required
                  pattern="^[0-9a-zA-Z_-]+$"
                />
              </div>
              <div className="mb-4 flex items-center">
                <input
                  type="checkbox"
                  id="page_private"
                  name="private"
                  className="p-2 rounded focus:outline-none focus:border-blue-500 text-gray-700 mr-2"
                  checked={formData.isPrivate}
                  onChange={(e) =>
                    setFormData({ ...formData, isPrivate: e.target.checked })
                  }
                  disabled={is_private}
                />
                <label htmlFor="page_private" className="text-gray-600">
                  Private
                </label>
              </div>
              <div className="mb-4 flex items-center">
                <button
                  type="button"
                  className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 mr-2 select-none"
                  onClick={handleAddPage}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 select-none"
                >
                  Save
                </button>
              </div>
            </form>
          )}
          <ul className="space-y-2 border-2 border-gray-300 p-4">
            {note_pages.length === 0 && (
              <li className="text-gray-600 mb-2">No pages.</li>
            )}
            {note_pages.map((page) => (
              <li
                className="flex items-center mb-2 text-gray-700 border-b-2 border-gray-300 pb-1 gap-3"
                key={page.page_id}
              >
                <span>{page.position.toString().padStart(2, "0")}</span>
                <Link
                  href="/dashboard/notes/[noteSlug]/[pageSlug]"
                  as={`/dashboard/notes/${note.slug}/${page.slug}`}
                >
                  <span className="hover:underline cursor-pointer font-semibold">
                    {page.title}
                  </span>
                </Link>
                <span
                  className="text-sm text-red-500 cursor-pointer underline ml-auto"
                  onClick={() => handleRemovePage(page.page_id)}
                >
                  Remove
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NoteEditPage;
