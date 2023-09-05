import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = NextResponse.json(
      {
        meta: {
          status: 200,
          message: "LOGOUT_SUCCESS",
        },
      },
      {
        status: 200,
      },
    );
    response.cookies.delete("token");

    return response;
  } catch (error) {
    return NextResponse.json(
      {
        meta: {
          status: 500,
          message: "LOGOUT_FAILED",
        },
      },
      {
        status: 500,
      },
    );
  }
}
