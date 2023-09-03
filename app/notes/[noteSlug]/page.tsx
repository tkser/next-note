"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

const Note = () => {
  const { noteSlug } = useParams();

  return (
    <div>
      <h1>{noteSlug}</h1>
    </div>
  );
};

export default Note;
