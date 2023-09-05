import NotePage from "@/app/_components/pages/NotePage";
import { getNote } from "@/app/_libs/note";
import { getPagesByNoteId } from "@/app/_libs/page";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: { noteSlug: string };
}) {
  const note = await getNote(params.noteSlug);
  if (!note) {
    return {
      title: `Note`,
    }
  }
  return {
    title: `${note.title} | Note`,
  };
}

const Note = async ({ params }: { params: { noteSlug: string } }) => {
  const note = await getNote(params.noteSlug);
  if (!note) {
    return notFound()
  }
  const pages = await getPagesByNoteId(note.note_id);
  return (
    <NotePage note={note} pages={pages} />
  );
};

export default Note;
