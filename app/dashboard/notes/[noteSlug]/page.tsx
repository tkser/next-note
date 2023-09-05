import AuthWrapper from "@/app/_components/AuthWrapper";
import NoteEditPage from "@/app/_components/pages/dashboard/NoteEditPage";
import { getNote } from "@/app/_libs/note";
import { getPagesByNoteId } from "@/app/_libs/page";
import { redirect } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: { noteSlug: string };
}) {
  return {
    title: `${params.noteSlug} | Note Dashboard`,
  };
}

const NoteEdit = async ({ params }: { params: { noteSlug: string } }) => {
  const note = await getNote(params.noteSlug);
  if (!note) return redirect("/dashboard");
  const pages = await getPagesByNoteId(note.note_id);
  return (
    <AuthWrapper redirect="/dashboard" user_id={note.user_id}>
      <NoteEditPage note={note} pages={pages} />
    </AuthWrapper>
  );
};

export default NoteEdit;
