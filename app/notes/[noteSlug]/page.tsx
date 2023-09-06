import { notFound } from "next/navigation";

import { getNote } from "@/app/_libs/note";
import { getPagesByNoteId } from "@/app/_libs/page";
import NotePage from "@/app/_components/pages/NotePage";
import AuthWrapper from "@/app/_components/AuthWrapper";

export async function generateMetadata({
  params,
}: {
  params: { noteSlug: string };
}) {
  const note = await getNote(params.noteSlug);
  if (!note) {
    return {
      title: `Note`,
    };
  }
  return {
    title: `${note.title} | Note`,
  };
}

const Note = async ({ params }: { params: { noteSlug: string } }) => {
  const note = await getNote(params.noteSlug);
  if (!note) {
    return notFound();
  }
  const pages = await getPagesByNoteId(note.note_id);
  return (
    <>
      {note.is_private ? (
        <AuthWrapper redirect="/" user_id={note.user_id}>
          <NotePage note={note} pages={pages} />
        </AuthWrapper>
      ) : (
        <NotePage note={note} pages={pages} />
      )}
    </>
  );
};

export default Note;
