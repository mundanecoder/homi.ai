import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "@/middleware/authMiddleware";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  // Authenticate the user
  const authResult = await authMiddleware(request);

  if (authResult.status !== 200) {
    return authResult;
  }

  const user = (request as any).user;

  try {
    // Parse request JSON
    const {
      flatType,
      minBudget,
      maxBudget,
      preferredAreas,
      minSize,
      maxSize,
      description,
    } = await request.json();

    // Validate required fields
    if (!flatType || !preferredAreas) {
      return NextResponse.json(
        { message: "Required fields are missing" },
        { status: 400 }
      );
    }

    // Ensure user ID is available
    if (!user?.id) {
      return NextResponse.json(
        { message: "User ID is not available" },
        { status: 400 }
      );
    }

    // Update or create user preferences
    const preferences = await prisma.userPreferences.upsert({
      where: { userId: user.id },
      update: {
        flatType,
        minBudget,
        maxBudget,
        preferredAreas,
        minSize,
        maxSize,
        description,
      },
      create: {
        userId: user.id,
        flatType,
        minBudget,
        maxBudget,
        preferredAreas,
        minSize,
        maxSize,
        description,
      },
    });

    return NextResponse.json({
      message: "User preferences updated successfully",
      preferences,
    });
  } catch (error) {
    console.error("Error updating user preferences:", error);
    return NextResponse.json(
      {
        message: "Error updating user preferences",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
