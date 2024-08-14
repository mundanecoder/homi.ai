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

  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get("projectId");

  try {
    // If projectId is provided, return the specific project, else return all user's projects
    if (projectId) {
      const project = await prisma.project.findFirst({
        where: {
          id: projectId,
          builderId: user?.id,
          isdeleted: false, // Ensure that the project is not marked as deleted
        },
        include: {
          images: true,
          flatTypes: true,
          contactInfo: true,
        },
      });

      if (!project) {
        return NextResponse.json(
          { message: "Project not found or you do not have access to it." },
          { status: 404 }
        );
      }

      return NextResponse.json({ project });
    } else {
      const projects = await prisma.project.findMany({
        where: {
          builderId: user?.id,
          isdeleted: false, // Ensure that only non-deleted projects are returned
        },
        include: {
          images: true,
          flatTypes: true,
          contactInfo: true,
        },
      });

      return NextResponse.json({ projects });
    }
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { message: "Error fetching projects" },
      { status: 500 }
    );
  }
}
