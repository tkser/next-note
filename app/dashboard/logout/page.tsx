import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Logout | Note",
};

const Login = async () => {
  cookies().delete("token");
  return redirect("/");
};

export default Login;
