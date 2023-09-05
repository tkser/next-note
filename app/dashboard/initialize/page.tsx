import InitializePage from "@/app/components/pages/InitializePage";
import { checkIfInitialized } from "@/libs/database";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Initialize | Note",
};

const Initialize = async () => {
  const initialized = await checkIfInitialized();
  if (initialized) {
    return redirect("/");
  } else {
    return <InitializePage />;
  }
};

export default Initialize;
