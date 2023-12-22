import { db } from "@vercel/postgres";

async function row2User(row: UserDatabaseRow): Promise<User> {
  return {
    user_id: row.user_id,
    username: row.username,
    role: row.role,
  };
}

async function getUser(user_id: string): Promise<User | null> {
  const client = await db.connect();
  const {
    rows: [user],
  } = await client.query<UserDatabaseRow>(
    `
    SELECT * FROM users
    WHERE user_id = $1 AND is_deleted = false
    LIMIT 1;
  `,
    [user_id],
  );
  await client.release();
  if (!user) {
    return null;
  }
  return row2User(user);
}

export { getUser };
