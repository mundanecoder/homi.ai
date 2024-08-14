import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "@/middleware/authMiddleware";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  const authResult = await authMiddleware(request);

  if (authResult.status !== 200) {
    return authResult;
  }

  const user = request.user;

  try {
    const { projectId, phone, email, address } = await request.json();

    if (!projectId || !phone || !email || !address) {
      return NextResponse.json(
        { message: "Required fields are missing" },
        { status: 400 }
      );
    }

    // Find the project by ID
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { builder: true },
    });

    if (!project) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 }
      );
    }

    // Ensure the user is authorized to update the contact info
    if (user?.id !== project.builderId) {
      return NextResponse.json(
        {
          message:
            "You are not authorized to update the contact info for this project",
        },
        { status: 403 }
      );
    }

    // Update or create contact info
    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: {
        contactInfo: {
          upsert: {
            create: {
              phone,
              email,
              address,
            },
            update: {
              phone,
              email,
              address,
            },
          },
        },
      },
    });

    return NextResponse.json({
      message: "Contact information updated successfully",
      project: updatedProject,
    });
  } catch (error) {
    console.error("Error updating contact information:", error);
    return NextResponse.json(
      {
        message: "Error updating contact information",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
