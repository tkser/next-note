import { redirect } from "next/navigation";

import { getNote } from "@/app/_libs/note";
import { getPageBySlug } from "@/app/_libs/page";
import AuthWrapper from "@/app/_components/AuthWrapper";
import PageEditPage from "@/app/_components/pages/dashboard/PageEditPage";

export async function generateMetadata({
  params,
}: {
  params: { noteSlug: string; pageSlug: string };
}) {
  return {
    title: `${params.noteSlug}/${params.pageSlug} | Note Dashboard`,
  };
}

const PageEdit = async ({
  params,
}: {
  params: { noteSlug: string; pageSlug: string };
}) => {
  const page = await getPageBySlug(params.noteSlug, params.pageSlug);
  if (!page) return redirect("/dashboard");
  const note = await getNote(params.noteSlug);
  if (!note) return redirect("/dashboard");
  return (
    <AuthWrapper redirect="/dashboard" user_id={page.user_id}>
      <PageEditPage note={note} page={page} />
    </AuthWrapper>
  );
};

export default PageEdit;
