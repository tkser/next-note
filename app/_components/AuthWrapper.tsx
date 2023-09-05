import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { verifyJWT } from "@/app/_utils/auth";

type AuthWrapperProps = {
  children: React.ReactNode;
};

const AuthWrapper = async ({ children }: AuthWrapperProps) => {
  const token = cookies().get("token");
  if (!token) {
    return redirect("/dashboard/login");
  }
  const user = await verifyJWT(token.value);
  if (!user) {
    return redirect("/dashboard/login");
  }
  return <>{children}</>;
};

export default AuthWrapper;
