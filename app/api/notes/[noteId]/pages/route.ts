import { NextRequest } from "next/server";

import { loginWithToken } from "@/app/_libs/auth";
import { makeResponse } from "@/app/_utils/response";
import { createPage, getPage } from "@/app/_libs/page";

export async function POST(request: NextRequest) {
  try {
    const reqJson = (await request.json()) as PageApiRequest;
    const { title, slug, content, position, is_private, note_id } = reqJson;

    if (!title || !slug || !position || is_private === undefined || !note_id) {
      return makeResponse(400, "BAD_REQUEST");
    }

    if (!slug.match(/^[a-zA-Z0-9_-]+$/)) {
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

    const slugCheck = await getPage(note_id, slug);

    if (slugCheck) {
      return makeResponse(409, "SLUG_CONFLICT");
    }

    const page = await createPage(
      title,
      slug,
      content || "",
      is_private,
      user.user_id,
      note_id,
      position,
    );

    if (!page) {
      return makeResponse(500, "INTERNAL_SERVER_ERROR");
    }

    return makeResponse<ApiDataPageResponse>(201, "CREATED", {
      type: "page",
      page: page,
    });
  } catch (error) {
    return makeResponse(500, "INTERNAL_SERVER_ERROR");
  }
}
