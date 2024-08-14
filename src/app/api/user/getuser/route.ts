// src/app/api/user/delete/route.ts

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "@/middleware/authMiddleware";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const authResult = await authMiddleware(request);

  if ("error" in authResult) {
    return NextResponse.json({ message: authResult.error }, { status: 401 });
  }

  const user = request.user;

  try {
    // Only proceed if the authenticated user is not deleted
    const UserData = await prisma.user.findUnique({
      where: { id: user?.id.toString() },
    });

    return NextResponse.json({
      message: "User successfully deleted",
      user: UserData,
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { message: "Error deleting user" },
      { status: 500 }
    );
  }
}
