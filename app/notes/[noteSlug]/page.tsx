"use client";

import { useParams } from "next/navigation";

const Note = async () => {
  const { noteSlug } = useParams();

  return (
    <div>
      <h1>{noteSlug}</h1>
    </div>
  );
};

export default Note;
