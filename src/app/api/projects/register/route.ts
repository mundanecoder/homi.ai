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
    const {
      name,
      location,
      description,
      builderId,
      status,
      priceRange,
      projectType,
      completionDate,
      images = [],
      contactInfo,
      flatTypes,
    } = await request.json();

    if (
      !name ||
      !location ||
      !builderId ||
      !status ||
      !priceRange ||
      !projectType
    ) {
      return NextResponse.json(
        { message: "Required fields are missing" },
        { status: 400 }
      );
    }

    // Ensure the builderId matches the user making the request
    if (user?.id !== builderId) {
      return NextResponse.json(
        {
          message:
            "You are not authorized to create a project for this builder",
        },
        { status: 403 }
      );
    }

    // Update the user to mark them as a builder
    if (!user?.isBuilder) {
      await prisma.user.update({
        where: { id: builderId },
        data: { isBuilder: true },
      });
    }

    // Create the project
    const newProject = await prisma.project.create({
      data: {
        name,
        location,
        description,
        builder: { connect: { id: builderId } },
        status,
        priceRange,
        projectType,
        completionDate: completionDate ? new Date(completionDate) : null,
        images: {
          create: images.map((image: { url: string; altText?: string }) => ({
            url: image.url,
            altText: image.altText,
          })),
        },
        contactInfo: contactInfo
          ? {
              create: {
                phone: contactInfo.phone,
                email: contactInfo.email,
                address: contactInfo.address,
              },
            }
          : undefined,
        flatTypes: {
          create: flatTypes?.map(
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
    });

    return NextResponse.json({
      message: "Project created successfully",
      project: newProject,
    });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { message: "Error creating project", error: (error as Error).message },
      { status: 500 }
    );
  }
}
