import { db } from "@vercel/postgres";

async function checkIfInitialized() {
  const client = await db.connect();

  const { rows } = await client.query(`
    SELECT EXISTS (
      SELECT 1
      FROM information_schema.tables
      WHERE table_name = 'users'
    ) AS "users_table_exists",
    EXISTS (
      SELECT 1
      FROM information_schema.tables
      WHERE table_name = 'notes'
    ) AS "notes_table_exists",
    EXISTS (
      SELECT 1
      FROM information_schema.tables
      WHERE table_name = 'pages'
    ) AS "pages_table_exists";
  `);
  const { users_table_exists, notes_table_exists, pages_table_exists } =
    rows[0];
  if (!users_table_exists || !notes_table_exists || !pages_table_exists) {
    await client.release();
    return false;
  }

  const { rows: users } = await client.query(`
    SELECT COUNT(*) AS "admin_user_count"
    FROM users
    WHERE role = 'admin';
  `);
  const { admin_user_count } = users[0];
  if (admin_user_count === 0) {
    await client.release();
    return false;
  }

  await client.release();

  return true;
}

export { checkIfInitialized }