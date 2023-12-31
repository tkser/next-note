import { db } from "@vercel/postgres";
import { NextRequest } from "next/server";

import { makeResponse } from "@/app/_utils/response";
import { generatePasswordHash } from "@/app/_utils/auth";
import { checkIfInitialized } from "@/app/_libs/database";

export async function POST(request: NextRequest) {
  try {
    const { username, password } =
      (await request.json()) as InitializeApiRequest;

    if (!username || !password) {
      return makeResponse(400, "BAD_REQUEST");
    }

    const initialized = await checkIfInitialized();
    if (initialized) {
      return makeResponse(200, "INITIALIZED");
    }

    const client = await db.connect();
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
        slug VARCHAR(255) NOT NULL,
        content TEXT,
        position INT NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        is_private BOOLEAN NOT NULL DEFAULT FALSE,
        is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
        user_id UUID REFERENCES users(user_id),
        CONSTRAINT uq_note_page_slug UNIQUE (note_id, slug)
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

    return makeResponse(201, "INITIALIZED");
  } catch (error) {
    console.error("Error during initialization", error);
    return makeResponse(500, "INITIALIZATION_ERROR");
  }
}
