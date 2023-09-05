import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { loginWithToken } from "../_libs/auth";

type AuthWrapperProps = {
  children: React.ReactNode;
  user_id?: string;
  role?: UserRole;
  redirect?: string;
};

const AuthWrapper = async (props: AuthWrapperProps) => {
  const token = cookies().get("token");
  if (!token) {
    return redirect("/dashboard/login");
  }
  const user = await loginWithToken(token.value);
  if (!user) {
    return redirect("/dashboard/login");
  }
  if (props.role && user.role !== props.role) {
    return redirect(props.redirect || "/dashboard/login");
  }
  if (props.user_id && user.user_id !== props.user_id) {
    return redirect(props.redirect || "/dashboard/login");
  }
  return <>{props.children}</>;
};

export default AuthWrapper;
