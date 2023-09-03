"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

const Page = () => {
  const { noteSlug, pageSlug } = useParams();

  return (
    <div>
      <h1>{noteSlug}</h1>
      <h2>{pageSlug}</h2>
    </div>
  );
};

export default Page;
