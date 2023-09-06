"use client";

import Link from "next/link";
import { useEffect } from "react";

type PageViewerProps = {
  note: Note;
  page: Page;
  article: Article;
};

const PageViewer = ({ note, page, article }: PageViewerProps) => {
  useEffect(() => {
    import("zenn-embed-elements");
  });
  return (
    <div className="grow bg-gray-100 max-w-[1170px] mx-auto px-6 py-6 w-full">
      <div className="flex flex-row">
        <div className="w-full md:w-[calc(100%_-_18rem)] p-10 md:mr-3 shadow-md rounded-xl bg-white text-gray-700">
          <p className="text-gray-700 mb-2 flex gap-1">
            <Link href={`/notes/${note.slug}`}>
              <span className="underline">{note.slug}</span>
            </Link>
            <span>/</span>
            <Link href={`/notes/${note.slug}/${page.slug}`}>
              <span className="underline">{page.slug}</span>
            </Link>
          </p>
          <h1 className="text-2xl font-semibold mb-4 text-gray-700">
            {page.title}
          </h1>
          <div
            className="znc mt-10"
            dangerouslySetInnerHTML={{ __html: article.contentHtml }}
          />
        </div>
        <div className="hidden md:block w-72 ml-3">
          <div className="flex flex-col sticky top-6">
            <div className="p-4 shadow-md rounded-xl mb-6 bg-white">
              <p className="text-xl text-bold mb-4 text-gray-700">目次</p>
              <ol className="relative border-l-2 border-gray-200 pl-4">
                {article.tableOfContents.map((anchor: TableOfContent) => {
                  if (anchor.level === "H1") {
                    return (
                      <li className="" key={anchor.href}>
                        <div className="absolute w-3 h-3 bg-blue-400 rounded-full mt-1.5 -left-[7px] border border-white"></div>
                        <a
                          className="mb-4 text-base text-gray-500 dark:text-gray-700 font-semibold"
                          href={anchor.href}
                        >
                          {anchor.title}
                        </a>
                      </li>
                    );
                  } else {
                    return (
                      <li className="" key={anchor.href}>
                        <a
                          className="mb-4 text-base font-normal text-gray-500 dark:text-gray-700"
                          href={anchor.href}
                        >
                          {anchor.title}
                        </a>
                      </li>
                    );
                  }
                })}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageViewer;
