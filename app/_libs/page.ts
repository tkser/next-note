import { db } from "@vercel/postgres";
import { getNote } from "./note";

async function row2Page(row: PageDatabaseRow): Promise<Page> {
  return {
    page_id: row.page_id,
    title: row.title,
    slug: row.slug,
    content: row.content,
    is_private: row.is_private,
    created_at: row.created_at,
    updated_at: row.updated_at,
    user_id: row.user_id,
    note_id: row.note_id,
    position: row.position,
  };
}

async function getPagesByNoteId(note_id: string): Promise<Page[]> {
  const client = await db.connect();
  const { rows } = await client.query<PageDatabaseRow>(
    `
    SELECT * FROM pages WHERE note_id = $1 AND is_deleted = false ORDER BY position ASC;
  `,
    [note_id],
  );
  await client.release();
  return Promise.all(rows.map(row2Page));
}

async function getPagesByNoteSlug(slug: string): Promise<Page[]> {
  const note = await getNote(slug);
  if (!note) {
    return [];
  }
  const pages = await getPagesByNoteId(note.note_id);
  return pages;
}

async function getPage(note_id: string, slug: string): Promise<Page | null> {
  const client = await db.connect();
  const { rows } = await client.query<PageDatabaseRow>(
    `
    SELECT * FROM pages WHERE note_id = $1 AND slug = $2 AND is_deleted = false;
  `,
    [note_id, slug],
  );
  await client.release();
  if (!rows[0]) {
    return null;
  }
  const page = rows[0];
  return row2Page(page);
}

async function createPage(
  title: string,
  slug: string,
  content: string,
  is_private: boolean,
  user_id: string,
  note_id: string,
  position: number,
): Promise<Page | null> {
  const client = await db.connect();
  const { rows } = await client.query<PageDatabaseRow>(
    `
    INSERT INTO pages (title, slug, content, is_private, user_id, note_id, position)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *;
  `,
    [title, slug, content, is_private, user_id, note_id, position],
  );
  await client.release();
  if (!rows[0]) {
    return null;
  }
  const page = rows[0];
  return row2Page(page);
}

export { getPagesByNoteId, getPagesByNoteSlug, getPage, createPage };
