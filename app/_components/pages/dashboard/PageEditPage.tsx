"use client";

//import { useState } from "react";

type PageEditPageProps = {
  page: Page;
  note: Note;
};

const PageEditPage = ({ page }: PageEditPageProps) => {
  //const [value, setValue] = useState(page.content);
  return (
    <div className="grow flex justify-center bg-gray-100">
      <div className="container mx-auto p-4 bg-white">
        <h1 className="text-2xl font-semibold mb-4 text-gray-700">
          {page.title}
        </h1>
        <div className="mb-4 text-gray-600" style={{ height: "95%" }}>
          editor
        </div>
      </div>
    </div>
  );
};

export default PageEditPage;
