// src/app/api/user/delete/route.ts

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "@/middleware/authMiddleware";

const prisma = new PrismaClient();

export async function DELETE(request: NextRequest) {
  const authResult = await authMiddleware(request);

  if ("error" in authResult) {
    return NextResponse.json({ message: authResult.error }, { status: 401 });
  }

  const userId = parseInt(new URL(request.url).searchParams.get("id") || "");

  if (!userId) {
    return NextResponse.json(
      { message: "User ID is required" },
      { status: 400 }
    );
  }

  try {
    // Only proceed if the authenticated user is not deleted
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { isdeleted: true }, // Mark as deleted
    });

    return NextResponse.json({
      message: "User successfully deleted",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { message: "Error deleting user" },
      { status: 500 }
    );
  }
}
