import { db } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";

import { JWTPayload, comparePasswordHash, generateJWT, verifyJWT } from "@/utils/auth";

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
  const { rows: [user] } = await client.query(`
    SELECT * FROM users
    WHERE username = $1 AND is_deleted = false
    LIMIT 1;
  `, [username]);

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
  } as JWTPayload;
}

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json() as {
      username: string | undefined;
      password: string | undefined;
    };
    const token = request.cookies.get("token");

    let user: JWTPayload | null = null;

    if (username && password) {
      user = await loginWithPassword(username, password);
    } else if (token) {
      user = await loginWithToken(token.value);
    } else {
      return NextResponse.json({
        meta: {
          status: 400,
          message: "MISSING_USERNAME_OR_PASSWORD",
        }
      }, {
        status: 400,
      });
    }

    if (!user) {
      return NextResponse.json({
        meta: {
          status: 401,
          message: "INVALID_USERNAME_OR_PASSWORD",
        }
      }, {
        status: 401,
      });
    }

    const next_token = await generateJWT({
      user_id: user.user_id,
      username: user.username,
      role: user.role
    });

    const response = NextResponse.json({
      meta: {
        status: 200,
        message: "LOGIN_SUCCESS",
      },
      data: {
        type: "user",
        user: {
          user_id: user.user_id,
          username: user.username,
          role: user.role
        }
      }
    }, {
      status: 200,
    });
    response.cookies.set("token", next_token, {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 1,
    });

    return response;
    
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      meta: {
        status: 500,
        message: "INTERNAL_SERVER_ERROR",
      }
    }, {
      status: 500,
    });
  }
}