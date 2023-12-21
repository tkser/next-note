"use client";

import { useEffect } from "react";

const LogoutPage = () => {
  useEffect(() => {
    const logout = async () => {
      await fetch("/api/auth/logout");
      window.location.href = "/";
    };
    logout();
  });

  return <div className="grow flex items-center justify-center bg-gray-100" />;
};

export default LogoutPage;
