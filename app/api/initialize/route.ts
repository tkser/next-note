import { db } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";

import { generatePasswordHash } from "@/utils/auth";

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

export async function GET() {
  try {
    const initialized = await checkIfInitialized();
    if (initialized) {
      return NextResponse.json(
        {
          status: 200,
          message: "INITIALIZED",
        },
        {
          status: 200,
        },
      );
    } else {
      return NextResponse.json(
        {
          status: 200,
          message: "NOT_INITIALIZED",
        },
        {
          status: 200,
        },
      );
    }
  } catch (error) {
    console.error("Error during initialization", error);
    return NextResponse.json(
      {
        status: 500,
        message: "INITIALIZATION_ERROR",
      },
      {
        status: 500,
      },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const initialized = await checkIfInitialized();
    if (initialized) {
      return NextResponse.json(
        {
          status: 200,
          message: "INITIALIZED",
        },
        {
          status: 200,
        },
      );
    }

    const client = await db.connect();
    const { username, password } = (await request.json()) as {
      username: string;
      password: string;
    };
    const { salt, hash } = await generatePasswordHash(password);

    await client.query(`
      CREATE EXTENSION IF NOT EXISTS pgcrypto;
    `);

    await client.query(`
      CREATE TABLE users (
        user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        username VARCHAR(255) UNIQUE NOT NULL,
        role VARCHAR(50) NOT NULL,
        password_hash TEXT NOT NULL,
        password_salt TEXT NOT NULL,
        is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT chk_valid_role CHECK (role IN ('admin', 'user'))
      );
    `);

    await client.query(`
      CREATE TABLE notes (
        note_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE,
        summary TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        is_private BOOLEAN NOT NULL DEFAULT FALSE,
        is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
        user_id UUID REFERENCES users(user_id)
      );
    `);

    await client.query(`
      CREATE TABLE pages (
        page_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        note_id UUID REFERENCES notes(note_id),
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE,
        content TEXT,
        position INT,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        is_private BOOLEAN NOT NULL DEFAULT FALSE,
        is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
        user_id UUID REFERENCES users(user_id)
      );
    `);

    await client.query(`
      CREATE OR REPLACE FUNCTION updated_at()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ language 'plpgsql';

      CREATE TRIGGER update_note_timestamp
      BEFORE UPDATE ON notes
      FOR EACH ROW
      EXECUTE PROCEDURE updated_at();

      CREATE TRIGGER update_page_timestamp
      BEFORE UPDATE ON pages
      FOR EACH ROW
      EXECUTE PROCEDURE updated_at();

      CREATE TRIGGER update_user_timestamp
      BEFORE UPDATE ON users
      FOR EACH ROW
      EXECUTE PROCEDURE updated_at();
    `);

    await client.query(
      `
      INSERT INTO users (username, role, password_hash, password_salt)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (username) DO NOTHING;
    `,
      [username, "admin", hash, salt],
    );

    await client.release();

    return NextResponse.json(
      {
        status: 201,
        message: "INITIALIZED",
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error("Error during initialization", error);
    return NextResponse.json(
      {
        status: 500,
        message: "INITIALIZATION_ERROR",
      },
      {
        status: 500,
      },
    );
  }
}
