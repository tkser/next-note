import { notFound } from "next/navigation";

import { getNote } from "@/app/_libs/note";
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
          <NotePage note={note} author={author} />
        </AuthWrapper>
      ) : (
        <NotePage note={note} author={author} />
      )}
    </>
  );
};

export default Note;
