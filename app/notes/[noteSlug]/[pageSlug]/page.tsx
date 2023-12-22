import { JSDOM } from "jsdom";
import { notFound } from "next/navigation";
import markdownHtml from "zenn-markdown-html";

import { getNote } from "@/app/_libs/note";
import AuthWrapper from "@/app/_components/AuthWrapper";
import { getAroundPages, getPage, getPageBySlug } from "@/app/_libs/page";
import PageViewer from "@/app/_components/pages/PageViewer";
import { getUser } from "@/app/_libs/user";

export async function generateMetadata({
  params,
}: {
  params: { noteSlug: string; pageSlug: string };
}) {
  const page = await getPageBySlug(params.noteSlug, params.pageSlug);
  if (!page) {
    return {
      title: `Note`,
    };
  }
  return {
    title: `${page.title} | Note`,
  };
}

const PageWrapper = async ({
  note,
  page,
  article,
  author,
  auth,
}: {
  note: Note;
  page: Page;
  article: Article;
  author: User | null;
  auth: boolean;
}) => {
  const [prevPage, nextPage] = await getAroundPages(note.note_id, page.page_id, auth);
  return <PageViewer note={note} page={page} article={article} prevPage={prevPage} nextPage={nextPage} author={author} />;
}

const Page = async ({
  params,
}: {
  params: { noteSlug: string; pageSlug: string };
}) => {
  const { noteSlug, pageSlug } = params;
  const note = await getNote(noteSlug);
  if (!note) {
    return notFound();
  }
  const page = await getPage(note.note_id, pageSlug);
  if (!page) {
    return notFound();
  }
  const article: Article = {
    contentHtml: markdownHtml(page.content),
    tableOfContents: [],
  };
  const author = await getUser(page.user_id);
  const domHtml = new JSDOM(article.contentHtml).window.document;
  const elements = domHtml.querySelectorAll<HTMLElement>("h1, h2");
  elements.forEach((element) => {
    const level = element.tagName;
    const title = element.innerHTML.split("</a> ")[1];
    const href = `#${element.id}`;
    article.tableOfContents.push({
      level,
      title,
      href,
    });
  });
  return (
    <>
      {page.is_private ? (
        <AuthWrapper redirect="/" user_id={page.user_id}>
          <PageWrapper note={note} page={page} article={article} author={author} auth={true} />
        </AuthWrapper>
      ) : (
        <PageWrapper note={note} page={page} article={article} author={author} auth={false} />
      )}
    </>
  );
};

export default Page;
