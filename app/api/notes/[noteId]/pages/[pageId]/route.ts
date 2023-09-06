import { NextRequest } from "next/server";

import { loginWithToken } from "@/app/_libs/auth";
import { makeResponse } from "@/app/_utils/response";
import { getPageById, updatePage } from "@/app/_libs/page";

export async function PUT(
  request: NextRequest,
  { params }: { params: { noteId: string, pageId: string } },
) {
  try {
    const reqJson = (await request.json()) as PageApiRequest;
    const { title, slug, content, is_private, position } = reqJson;
    const noteId = params.noteId;
    const pageId = params.pageId;

    if (!title || !slug || !content || is_private === undefined || !position) {
      return makeResponse(400, "BAD_REQUEST");
    }

    if (!slug.match(/^[a-zA-Z0-9_-]+$/)) {
      return makeResponse(400, "BAD_REQUEST");
    }

    if (slug === "create") {
      return makeResponse(400, "BAD_REQUEST");
    }

    const token = request.cookies.get("token");
    if (!token) {
      return makeResponse(401, "UNAUTHORIZED");
    }

    const user = await loginWithToken(token.value);
    if (!user) {
      return makeResponse(401, "UNAUTHORIZED");
    }

    const page = await getPageById(pageId);
    if (!page) {
      return makeResponse(404, "NOT_FOUND");
    }
    if (page.user_id !== user.user_id) {
      return makeResponse(403, "FORBIDDEN");
    }

    const updatedPage = await updatePage(
      page.page_id,
      title,
      slug,
      content,
      is_private,
      position,
    );

    if (!updatedPage) {
      return makeResponse(500, "INTERNAL_SERVER_ERROR");
    }

    return makeResponse(200, "SUCCESS", {
      type: "page",
      page: updatedPage,
    });
  } catch (e) {
    return makeResponse(500, "INTERNAL_SERVER_ERROR");
  }
}
