import { NextResponse } from "next/server";

export function makeResponse<T = never>(
  status: number,
  message: string,
  data?: T,
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      data,
      meta: {
        status,
        message,
      },
    },
    {
      status,
    },
  );
}
