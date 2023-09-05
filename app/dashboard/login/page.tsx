import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import LoginPage from "@/app/_components/pages/LoginPage";
import { verifyJWT } from "@/app/_utils/auth";

export const metadata = {
  title: "Login | Note",
};

const Login = async () => {
  const token = cookies().get("token");
  if (token) {
    const user = await verifyJWT(token.value);
    if (user) {
      return redirect("/dashboard");
    }
  }
  return <LoginPage />;
};

export default Login;
