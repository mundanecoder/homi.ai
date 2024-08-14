// src/app/api/user/preference/route.ts

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
    // Fetch user preferences
    const userPreferences = await prisma.userPreferences.findUnique({
      where: { userId: user?.id.toString() },
    });

    if (!userPreferences) {
      return NextResponse.json(
        { message: "No preferences found for this user." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "User preferences retrieved successfully",
      preferences: userPreferences,
    });
  } catch (error) {
    console.error("Error retrieving user preferences:", error);
    return NextResponse.json(
      { message: "Error retrieving user preferences" },
      { status: 500 }
    );
  }
}
