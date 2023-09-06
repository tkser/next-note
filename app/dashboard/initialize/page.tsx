import { redirect } from "next/navigation";

import { checkIfInitialized } from "@/app/_libs/database";
import InitializePage from "@/app/_components/pages/dashboard/InitializePage";

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
