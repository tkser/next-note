"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { BiSolidLockAlt } from "react-icons/bi";

type DashboardPageProps = {
  notes: Note[];
};

const DashboardPage = ({ notes }: DashboardPageProps) => {
  const router = useRouter();
  const handleCreateNote = () => {
    router.push("/dashboard/notes/create");
  };
  const handleEditNote = (slug: string) => {
    router.push(`/dashboard/notes/${slug}`);
  };
  return (
    <div className="grow flex justify-center bg-gray-100">
      <div className="container mx-auto p-4 bg-white">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold mb-4 text-gray-700 select-none">
            My Notes
          </h1>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded select-none"
            onClick={handleCreateNote}
          >
            Create
          </button>
        </div>
        <ul>
          {notes.map((note) => (
            <li key={note.note_id} className="mb-4 border-b pb-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-700">
                  <Link href={`/notes/${note.slug}`} className="flex flex-row gap-1 items-center">
                    <span className="select-none">{note.is_private && <BiSolidLockAlt />}</span>
                    <span>{note.title}</span>
                  </Link>
                </h2>
                <div className="flex">
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded mr-2 select-none"
                    onClick={() => handleEditNote(note.slug)}
                  >
                    Edit
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DashboardPage;
