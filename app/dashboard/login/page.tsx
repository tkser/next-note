import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { loginWithToken } from "@/app/_libs/auth";
import LoginPage from "@/app/_components/pages/dashboard/LoginPage";

export const metadata = {
  title: "Login | Note",
};

const Login = async () => {
  const token = cookies().get("token");
  if (token) {
    const user = await loginWithToken(token.value);
    if (user) {
      return redirect("/dashboard");
    }
  }
  return <LoginPage />;
};

export default Login;
