import { db } from "@vercel/postgres";

async function row2Note(row: NoteDatabaseRow): Promise<Note> {
  return {
    note_id: row.note_id,
    title: row.title,
    slug: row.slug,
    summary: row.summary,
    is_private: row.is_private,
    created_at: row.created_at,
    updated_at: row.updated_at,
    user_id: row.user_id,
  };
}

async function getNote(slug: string): Promise<Note | null> {
  const client = await db.connect();
  const { rows } = await client.query<NoteDatabaseRow>(
    `
    SELECT * FROM notes WHERE slug = $1 AND is_deleted = false;
  `,
    [slug],
  );
  await client.release();
  if (!rows[0]) {
    return null;
  }
  const note = rows[0];
  return row2Note(note);
}

async function getNoteById(note_id: string): Promise<Note | null> {
  const client = await db.connect();
  const { rows } = await client.query<NoteDatabaseRow>(
    `
    SELECT * FROM notes WHERE note_id = $1 AND is_deleted = false;
  `,
    [note_id],
  );
  await client.release();
  if (!rows[0]) {
    return null;
  }
  const note = rows[0];
  return row2Note(note);
}

async function createNote(
  title: string,
  slug: string,
  summary: string,
  is_private: boolean,
  user_id: string,
): Promise<Note | null> {
  const client = await db.connect();
  const { rows } = await client.query<NoteDatabaseRow>(
    `
    INSERT INTO notes (title, slug, summary, is_private, user_id)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `,
    [title, slug, summary, is_private, user_id],
  );
  await client.release();
  if (!rows[0]) {
    return null;
  }
  const note = rows[0];
  return row2Note(note);
}

async function updateNote(
  note_id: string,
  title: string,
  slug: string,
  summary: string,
  is_private: boolean,
): Promise<Note | null> {
  const client = await db.connect();
  const { rows } = await client.query<NoteDatabaseRow>(
    `
    UPDATE notes
    SET title = $1, slug = $2, summary = $3, is_private = $4
    WHERE note_id = $5
    RETURNING *;
  `,
    [title, slug, summary, is_private, note_id],
  );
  await client.release();
  if (!rows[0]) {
    return null;
  }
  const note = rows[0];
  return row2Note(note);
}

export { getNote, getNoteById, createNote, updateNote };
