import { loginWithToken } from "@/app/_libs/auth";
import { makeResponse } from "@/app/_utils/response";
import { db } from "@vercel/postgres";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const reqJson = await request.json() as NoteApiRequest;
    const { title, slug, summary, is_private } = reqJson;

    if (!title || !slug || !summary || is_private === undefined) {
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

    const client = await db.connect();

    const { rows: [slugCheck] } = await client.query<NoteDatabaseRow>(`
      SELECT * FROM notes WHERE slug = $1;
    `, [slug]);

    if (slugCheck) {
      return makeResponse(409, "SLUG_CONFLICT");
    }

    const { rows: [note] } = await client.query<NoteDatabaseRow>(`
      INSERT INTO notes (title, slug, summary, is_private, user_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `, [title, slug, summary, is_private, user.user_id]);

    await client.release();

    return makeResponse<ApiDataNoteResponse>(201, "CREATED", {
      type: "note",
      note: {
        note_id: note.note_id,
        title: note.title,
        slug: note.slug,
        summary: note.summary,
        is_private: note.is_private,
        created_at: note.created_at,
        updated_at: note.updated_at,
      }
    });
  } catch (error) {
    return makeResponse(500, "INTERNAL_SERVER_ERROR");
  }
}