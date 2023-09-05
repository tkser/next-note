"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

const LogoutPage = () => {
  const router = useRouter();

  useEffect(() => {
    const logout = async () => {
      await fetch("/api/auth/logout");
      router.push("/");
    };
    logout();
  });

  return <div className="grow flex items-center justify-center bg-gray-100" />;
};

export default LogoutPage;
