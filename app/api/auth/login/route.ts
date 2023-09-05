import { NextRequest } from "next/server";

import {
  generateJWT,
} from "@/app/_utils/auth";
import { makeResponse } from "@/app/_utils/response";
import { loginWithPassword, loginWithToken } from "@/app/_libs/auth";

export async function POST(request: NextRequest) {
  try {
    const { username, password } = (await request.json()) as {
      username: string | undefined;
      password: string | undefined;
    };
    const token = request.cookies.get("token");

    let user: User | null = null;

    if (username && password) {
      user = await loginWithPassword(username, password);
    } else if (token) {
      user = await loginWithToken(token.value);
    } else {
      return makeResponse(400, "MISSING_USERNAME_OR_PASSWORD");
    }
    if (!user) {
      return makeResponse(401, "INVALID_USERNAME_OR_PASSWORD");
    }

    const next_token = await generateJWT({
      user_id: user.user_id,
      username: user.username,
      role: user.role,
    });
    
    const response = makeResponse<ApiDataUserResponse>(200, "LOGIN_SUCCESS", {
      type: "user",
      user: {
        user_id: user.user_id,
        username: user.username,
        role: user.role,
      }
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
    return makeResponse(500, "INTERNAL_SERVER_ERROR");
  }
}
