import { makeResponse } from "@/app/_utils/response";

export async function GET() {
  try {
    const response = makeResponse(200, "LOGOUT_SUCCESS");
    response.cookies.delete("token");
    return response;
  } catch (error) {
    return makeResponse(500, "LOGOUT_FAILED");
  }
}
