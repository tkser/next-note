"use client";

import { useRouter } from "next/navigation";

import { useContext } from "react";
import { AuthContext } from "@/app/_providor/AuthProvider";

type AuthWrapperProps = {
  children: React.ReactNode;
  user_id?: string;
  role?: UserRole;
  redirect?: string;
};

const AuthWrapper = async (props: AuthWrapperProps) => {
  const user = useContext(AuthContext);
  const router = useRouter();

  const redirect_uri = props.redirect || "/dashboard/login";
  if (!user) {
    router.prefetch(redirect_uri);
    router.push(redirect_uri);
  }
  else if (props.role && user.role !== props.role) {
    router.prefetch(redirect_uri);
    router.push(redirect_uri);
  }
  else if (props.user_id && user.user_id !== props.user_id) {
    router.prefetch(redirect_uri);
    router.push(redirect_uri);
  }
  else {
    return <>{props.children}</>;
  }
  return <></>;
};

export default AuthWrapper;
