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
    const { projectId, flatTypes } = await request.json();

    if (!projectId || !flatTypes || !flatTypes.length) {
      return NextResponse.json(
        { message: "Required fields are missing" },
        { status: 400 }
      );
    }

    // Retrieve the project to ensure the user has access to it
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

    // Ensure the user is the builder of the project
    if (project.builderId !== user?.id) {
      return NextResponse.json(
        {
          message: "You are not authorized to add flat types to this project",
        },
        { status: 403 }
      );
    }

    // Add flat types to the project
    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: {
        flatTypes: {
          create: flatTypes.map(
            (flatType: {
              type: string;
              bedrooms: number;
              bathrooms: number;
              size: number;
              price: number;
              status: string;
            }) => ({
              type: flatType.type,
              bedrooms: flatType.bedrooms,
              bathrooms: flatType.bathrooms,
              size: flatType.size,
              price: flatType.price,
              status: flatType.status,
            })
          ),
        },
      },
      include: { flatTypes: true },
    });

    return NextResponse.json({
      message: "Flat types added successfully",
      project: updatedProject,
    });
  } catch (error) {
    console.error("Error adding flat types:", error);
    return NextResponse.json(
      { message: "Error adding flat types", error: (error as Error).message },
      { status: 500 }
    );
  }
}
