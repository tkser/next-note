"use client";

import { useRouter } from "next/navigation";
import markdownHtml from "zenn-markdown-html";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

type PageEditPageProps = {
  page: Page;
  note: Note;
};

const PageEditPage = ({ page }: PageEditPageProps) => {
  const router = useRouter();
  const [value, setValue] = useState(page.content);
  const [isPreview, setIsPreview] = useState(false);
  const [title, setTitle] = useState(page.title);

  const contentHtml = useMemo(() => {
    return markdownHtml(value);
  }, [value]);
  const savable = useMemo(() => {
    return page.content !== value || page.title !== title;
  }, [value, title, page]);
  const handleSave = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();
    if (page.content !== value || page.title !== title) {
      try {
        const res = await fetch(
          `/api/notes/${page.note_id}/pages/${page.page_id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              content: value,
              title: title,
              slug: page.slug,
              position: page.position,
              is_private: page.is_private,
            }),
            next: { revalidate: false },
            credentials: "include",
          },
        );
        const json = (await res.json()) as ApiResponse<ApiDataPageResponse>;
        if (json.meta.message === "SUCCESS") {
          if (json.data) {
            page.content = json.data.page.content;
            page.title = json.data.page.title;
            page.slug = json.data.page.slug;
            page.position = json.data.page.position;
            page.is_private = json.data.page.is_private;
            page.updated_at = json.data.page.updated_at;
            setTitle(page.title);
            setValue(page.content);
            router.refresh();
            toast.success("Save successfully.");
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
    }
  };

  useEffect(() => {
    import("zenn-embed-elements");
  });

  return (
    <div className="grow flex justify-center bg-gray-100">
      <div className="container mx-auto p-4 bg-white flex flex-col">
        <div className="flex justify-between items-center flex-row-reverse">
          <button
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed select-none"
            onClick={handleSave}
            disabled={!savable}
          >
            Save
          </button>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold grow mr-4"
          />
        </div>
        <div className="mb-4 text-gray-600 grow flex flex-col">
          <div className="mb-4 border-b border-gray-200">
            <ul
              className="flex flex-wrap -mb-px text-sm font-medium text-center"
              role="tablist"
            >
              <li className="mr-2" role="presentation">
                <button
                  className={`inline-block p-4 border-b-2 rounded-t-lg hover:border-gray-300 ${
                    isPreview
                      ? ""
                      : "hover:text-gray-600 border-gray-500 hover:border-gray-500 font-semibold select-none"
                  }`}
                  role="tab"
                  onClick={() => setIsPreview(false)}
                >
                  Editor
                </button>
              </li>
              <li className="mr-2" role="presentation">
                <button
                  className={`inline-block p-4 border-b-2 rounded-t-lg hover:border-gray-300 ${
                    isPreview
                      ? "hover:text-gray-600 border-gray-500 hover:border-gray-500 font-semibold select-none"
                      : ""
                  }`}
                  role="tab"
                  onClick={() => setIsPreview(true)}
                >
                  Preview
                </button>
              </li>
            </ul>
          </div>
          <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded-lg grow overflow-y-hidden flex-basic-0">
            <div
              className={`p-4 rounded-lg bg-gray-50 h-full ${
                isPreview ? "hidden" : ""
              }`}
              role="tabpanel"
            >
              <textarea
                className="w-full h-full resize-none text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline"
                value={value}
                onChange={(e) => setValue(e.target.value)}
              ></textarea>
            </div>
            <div
              className={`p-4 rounded-lg bg-gray-50 h-full ${
                isPreview ? "" : "hidden"
              }`}
              role="tabpanel"
            >
              <div
                className="znc overflow-y-auto h-full"
                dangerouslySetInnerHTML={{ __html: contentHtml }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageEditPage;
