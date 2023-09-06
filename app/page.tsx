import TopPage from "./_components/pages/TopPage";
import { getNotes } from "@/app/_libs/note";

const Page = async () => {
  const notes = await getNotes();
  return <TopPage notes={notes} />;
};

export default Page;
