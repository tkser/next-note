import { redirect } from "next/navigation";

import InitializePage from "@/app/_components/pages/InitializePage";
import { checkIfInitialized } from "@/app/_libs/database";

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
