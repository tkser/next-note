import AuthWrapper from "@/app/_components/AuthWrapper";
import CreateNotePage from "@/app/_components/pages/dashboard/CreateNotePage";

export const metadata = {
  title: "Create Note | Note Dashboard",
};

const CreateNote = async () => {
  return (
    <AuthWrapper>
      <CreateNotePage />
    </AuthWrapper>
  );
};

export default CreateNote;
