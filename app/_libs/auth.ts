import { db } from "@vercel/postgres";

import {
  comparePasswordHash,
  verifyJWT,
} from "@/app/_utils/auth";

async function loginWithToken(token: string) {
  try {
    const user = await verifyJWT(token);
    return user;
  } catch (error) {
    return null;
  }
}

async function loginWithPassword(username: string, password: string) {
  const client = await db.connect();
  const {
    rows: [user],
  } = await client.query<UserDatabaseRow>(
    `
    SELECT * FROM users
    WHERE username = $1 AND is_deleted = false
    LIMIT 1;
  `,
    [username],
  );

  if (!user) {
    return null;
  }

  const password_hash = user.password_hash;
  const passwordMatches = await comparePasswordHash(password, password_hash);

  if (!passwordMatches) {
    return null;
  }

  await client.release();
  return {
    user_id: user.user_id,
    username: user.username,
    role: user.role,
  } as User;
}

export { loginWithToken, loginWithPassword };
