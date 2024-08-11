// src/app/api/status/route.ts
import { authMiddleware } from "@/middleware/authMiddleware";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const authResult = await authMiddleware(request);

  if (authResult.status !== 200) {
    return authResult;
  }

  return NextResponse.json({
    message: "Server is running!",
    user: request.user,
  });
}
