import { db } from "@vercel/postgres";

import { getNote } from "@/app/_libs/note";

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

async function getPageById(page_id: string): Promise<Page | null> {
  const client = await db.connect();
  const { rows } = await client.query<PageDatabaseRow>(
    `
    SELECT * FROM pages WHERE page_id = $1 AND is_deleted = false;
  `,
    [page_id],
  );
  await client.release();
  if (!rows[0]) {
    return null;
  }
  const page = rows[0];
  return row2Page(page);
}

async function getPageBySlug(
  note_slug: string,
  page_slug: string,
): Promise<Page | null> {
  const note = await getNote(note_slug);
  if (!note) {
    return null;
  }
  const page = await getPage(note.note_id, page_slug);
  return page;
}

async function getAroundPages(
  note_id: string,
  page_id: string,
): Promise<[Page | null, Page | null]> {
  const client = await db.connect();
  const { rows } = await client.query<PageDatabaseRow>(
    `
    SELECT * FROM pages WHERE note_id = $1 AND is_deleted = false ORDER BY position ASC;
  `,
    [note_id],
  );
  await client.release();
  const pages = await Promise.all(rows.map(row2Page));
  const index = pages.findIndex((page) => page.page_id === page_id);
  const prev = index > 0 ? pages[index - 1] : null;
  const next = index < pages.length - 1 ? pages[index + 1] : null;
  return [prev, next];
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

async function updatePage(
  page_id: string,
  title: string,
  slug: string,
  content: string,
  is_private: boolean,
  position: number,
): Promise<Page | null> {
  const client = await db.connect();
  const { rows } = await client.query<PageDatabaseRow>(
    `
    UPDATE pages
    SET title = $1, slug = $2, content = $3, is_private = $4, position = $5
    WHERE page_id = $6
    RETURNING *;
  `,
    [title, slug, content, is_private, position, page_id],
  );
  await client.release();
  if (!rows[0]) {
    return null;
  }
  const page = rows[0];
  return row2Page(page);
}

async function deletePage(page_id: string): Promise<boolean> {
  const client = await db.connect();
  const { rows } = await client.query<PageDatabaseRow>(
    `
    UPDATE pages
    SET is_deleted = true
    WHERE page_id = $1
    RETURNING *;
  `,
    [page_id],
  );
  await client.release();
  if (!rows[0]) {
    return false;
  }
  return true;
}

async function deletePagesByNoteId(note_id: string): Promise<boolean> {
  const client = await db.connect();
  const { rows } = await client.query<PageDatabaseRow>(
    `
    UPDATE pages
    SET is_deleted = true
    WHERE note_id = $1
    RETURNING *;
  `,
    [note_id],
  );
  await client.release();
  if (!rows[0]) {
    return false;
  }
  return true;
}

export {
  getPagesByNoteId,
  getPagesByNoteSlug,
  getPage,
  getPageById,
  getPageBySlug,
  getAroundPages,
  createPage,
  updatePage,
  deletePage,
  deletePagesByNoteId,
};
