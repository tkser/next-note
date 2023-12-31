import { getNotes } from "@/app/_libs/note";
import TopPage from "@/app/_components/pages/TopPage";

const Page = async () => {
  const notes = await getNotes();
  return <TopPage notes={notes} />;
};

export default Page;
