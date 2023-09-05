import { makeResponse } from "@/app/_utils/response";
import { db } from "@vercel/postgres";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const reqJson = await request.json()
  } catch (error) {
    return makeResponse(500, "INTERNAL_SERVER_ERROR");
  }
}