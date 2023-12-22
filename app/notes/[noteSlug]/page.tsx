import { notFound } from "next/navigation";

import { getNote } from "@/app/_libs/note";
import { getPagesByNoteId } from "@/app/_libs/page";
import NotePage from "@/app/_components/pages/NotePage";
import AuthWrapper from "@/app/_components/AuthWrapper";
import { getUser } from "@/app/_libs/user";

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

const NoteWrapper = async ({ note, author, auth }: { note: Note; author: User | null, auth: boolean }) => {
  const pages = await getPagesByNoteId(note.note_id, auth);
  return <NotePage note={note} pages={pages} author={author} />;
}

const Note = async ({ params }: { params: { noteSlug: string } }) => {
  const note = await getNote(params.noteSlug);
  if (!note) {
    return notFound();
  }
  const author = await getUser(note.user_id);
  return (
    <>
      {note.is_private ? (
        <AuthWrapper redirect="/" user_id={note.user_id}>
          <NoteWrapper note={note} author={author} auth={true} />
        </AuthWrapper>
      ) : (
        <NoteWrapper note={note} author={author} auth={false} />
      )}
    </>
  );
};

export default Note;
