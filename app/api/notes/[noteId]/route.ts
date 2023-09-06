import { NextRequest } from "next/server";

import { loginWithToken } from "@/app/_libs/auth";
import { makeResponse } from "@/app/_utils/response";
import { updateNote, getNoteById } from "@/app/_libs/note";

export async function PUT(
  request: NextRequest,
  { params }: { params: { noteId: string } },
) {
  try {
    const reqJson = (await request.json()) as NoteApiRequest;
    const { title, slug, summary, is_private } = reqJson;
    const noteId = params.noteId;

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

    const note = await getNoteById(noteId);

    if (!note) {
      return makeResponse(404, "NOT_FOUND");
    }
    if (note.user_id !== user.user_id) {
      return makeResponse(403, "FORBIDDEN");
    }

    const updatedNote = await updateNote(
      note.note_id,
      title,
      slug,
      summary,
      is_private,
    );

    if (!updatedNote) {
      return makeResponse(500, "INTERNAL_SERVER_ERROR");
    }

    return makeResponse(200, "SUCCESS", {
      type: "note",
      note: updatedNote,
    });
  } catch (error) {
    return makeResponse(500, "INTERNAL_SERVER_ERROR");
  }
}
