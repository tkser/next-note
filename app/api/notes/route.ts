import { NextRequest } from "next/server";

import { loginWithToken } from "@/app/_libs/auth";
import { makeResponse } from "@/app/_utils/response";
import { createNote, getNote } from "@/app/_libs/note";

export async function POST(request: NextRequest) {
  try {
    const reqJson = (await request.json()) as NoteApiRequest;
    const { title, slug, summary, is_private } = reqJson;

    if (!title || !slug || !summary || is_private === undefined) {
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

    const slugCheck = await getNote(slug);

    if (slugCheck) {
      return makeResponse(409, "SLUG_CONFLICT");
    }

    const note = await createNote(
      title,
      slug,
      summary,
      is_private,
      user.user_id,
    );

    if (!note) {
      return makeResponse(500, "INTERNAL_SERVER_ERROR");
    }

    return makeResponse<ApiDataNoteResponse>(201, "CREATED", {
      type: "note",
      note: note,
    });
  } catch (error) {
    return makeResponse(500, "INTERNAL_SERVER_ERROR");
  }
}
