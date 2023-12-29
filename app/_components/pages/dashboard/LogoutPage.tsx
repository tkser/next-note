"use client";

import { useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const LogoutPage = () => {
  const router = useRouter();

  useEffect(() => {
    const logout = async () => {
      await fetch("/api/auth/logout", {
        next: { revalidate: false },
        credentials: "include",
      });
      router.prefetch("/");
      router.push("/");
      router.refresh();
      toast.success("Logout Successful.");
    };
    logout();
  }, []);

  return <div className="grow flex items-center justify-center bg-gray-100" />;
};

export default LogoutPage;
