import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { User } from "../types/user"; // Import the type

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const prisma = new PrismaClient();

declare module "next/server" {
  interface NextRequest {
    user?: User;
  }
}

export async function authMiddleware(request: NextRequest) {
  const token = request.headers.get("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return NextResponse.json({ message: "No token provided" }, { status: 401 });
  }

  try {
    // Decode the JWT token
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: number;
      email: string;
    };

    // Fetch user from the database using Prisma
    const user = (await prisma.user.findUnique({
      where: { id: decoded.userId },
    })) as User; // Typecast the user

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Attach user data to the request with proper type
    (request as any).user = user;

    // Continue to the next middleware or route handler
    return NextResponse.next();
  } catch (error) {
    return NextResponse.json(
      { message: "Invalid or expired token" },
      { status: 403 }
    );
  }
}
