import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { loginWithToken } from "@/app/_libs/auth";
import { getNotesByUserId } from "@/app/_libs/note";
import AuthWrapper from "@/app/_components/AuthWrapper";
import DashboardPage from "@/app/_components/pages/dashboard/DashboardPage";

export const metadata = {
  title: "Dashboard | Note",
};

const Dashboard = async () => {
  const token = cookies().get("token");
  if (!token) {
    return redirect("/dashboard/login");
  }
  const user = await loginWithToken(token.value);
  if (!user) {
    return redirect("/dashboard/login");
  }
  const notes = await getNotesByUserId(user.user_id, true);
  return (
    <AuthWrapper>
      <DashboardPage notes={notes} />
    </AuthWrapper>
  );
};

export default Dashboard;
