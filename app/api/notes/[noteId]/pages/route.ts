import { NextRequest } from "next/server";

import { loginWithToken } from "@/app/_libs/auth";
import { makeResponse } from "@/app/_utils/response";
import { createPage, getPage, getPageById, getPagesByNoteId } from "@/app/_libs/page";
import { getNoteById } from "@/app/_libs/note";

export async function GET(
  request: NextRequest,
  { params }: { params: { noteId: string } },
) {
  try {
    if (!params.noteId) {
      return makeResponse(400, "BAD_REQUEST");
    }

    const token = request.cookies.get("token");
    const user = token ? await loginWithToken(token.value) : null;

    const note = await getNoteById(params.noteId);
    if (!note) {
      return makeResponse(404, "NOT_FOUND");
    }
    if (note.is_private && !user) {
      return makeResponse(401, "UNAUTHORIZED");
    }
    if (note.is_private && user && note.user_id !== user.user_id) {
      return makeResponse(403, "FORBIDDEN");
    }

    const pages = await getPagesByNoteId(params.noteId, note.is_private ? true : (user ? note.user_id === user.user_id : false));

    return makeResponse<ApiDataPageDetailResponse[]>(200, "OK", pages.map((page) => ({
      type: "pageDetail",
      page: {
        page_id: page.page_id,
        note_id: page.note_id,
        user_id: page.user_id,
        title: page.title,
        slug: page.slug,
        position: page.position,
        is_private: page.is_private,
        created_at: page.created_at,
        updated_at: page.updated_at,
      }
    })));
  } catch (error) {
    return makeResponse(500, "INTERNAL_SERVER_ERROR");
  }
}

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
