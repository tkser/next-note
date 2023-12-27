"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const CreateNotePage = () => {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [summary, setSummary] = useState("");
  const [is_private, setIsPrivate] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors([]);
    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, slug, summary, is_private }),
        next: { revalidate: false },
        credentials: "include",
      });
      const data = (await response.json()) as ApiResponse<ApiDataNoteResponse>;

      if (data.meta.message === "CREATED") {
        if (data.data) {
          router.prefetch(`/dashboard/notes/${data.data.note.slug}`);
          router.push(`/dashboard/notes/${data.data.note.slug}`);
        } else {
          setErrors(["An error occurred. Please try again later"]);
        }
      } else if (data.meta.message === "SLUG_CONFLICT") {
        setErrors(["Slug already exists"]);
      } else if (data.meta.message === "BAD_REQUEST") {
        setErrors(["Bad request"]);
      } else {
        setErrors(["An error occurred. Please try again later"]);
      }
    } catch (error) {
      setErrors(["An error occurred. Please try again later"]);
    }
  };

  return (
    <div className="grow flex items-center justify-center bg-gray-100">
      <div className="container mx-auto p-4 bg-white">
        <h1 className="text-2xl font-semibold mb-4 text-gray-700">
          Create Note
        </h1>
        <p className="text-sm mb-2 text-red-500">
          {errors.map((error) => (
            <span key={error}>{error}</span>
          ))}
        </p>
        <form onSubmit={handleSubmit}>
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
            <label htmlFor="private" className="block text-gray-600">
              Private
            </label>
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 select-none"
          >
            Create
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateNotePage;
