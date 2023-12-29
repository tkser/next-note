import { NextRequest } from "next/server";

import { getNoteById } from "@/app/_libs/note";
import { loginWithToken } from "@/app/_libs/auth";
import { makeResponse } from "@/app/_utils/response";
import { getAroundPages, page2detail } from "@/app/_libs/page";

export async function GET(
  request: NextRequest,
  { params }: { params: { noteId: string; pageId: string } },
) {
  try {
    const { noteId, pageId } = params;

    const token = request.cookies.get("token");
    const user = token ? await loginWithToken(token.value) : null;

    const note = await getNoteById(noteId);
    if (!note) {
      return makeResponse(404, "NOT_FOUND");
    }
    if (note.is_private && !user) {
      return makeResponse(401, "UNAUTHORIZED");
    }
    if (note.is_private && user && note.user_id !== user.user_id) {
      return makeResponse(403, "FORBIDDEN");
    }

    const [prevPage, nextPage] = await getAroundPages(
      noteId,
      pageId,
      note.is_private ? true : user ? note.user_id === user.user_id : false,
    );

    return makeResponse<ApiDataAroundPagesResponse>(
      200,
      "OK",
      {
        type: "aroundPages",
        prev: prevPage ? page2detail(prevPage) : null,
        next: nextPage ? page2detail(nextPage) : null,
      },
    );
  } catch (error) {
    console.error(error);
    return makeResponse(500, "INTERNAL_SERVER_ERROR");
  }
}
