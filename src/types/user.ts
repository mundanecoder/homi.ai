import { Prisma } from "@prisma/client";

export type User = Prisma.UserGetPayload<{
  select: {
    id: true;
    name: true;
    email: true;
    isBuilder: true;
    gender: true;
    avatar: true;
    isdeleted: true;
    createdAt: true;
    updatedAt: true;
  };
}>;
