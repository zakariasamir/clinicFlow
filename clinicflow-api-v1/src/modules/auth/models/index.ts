import { prisma } from "@/loaders/database";

export const UserModel = prisma.user;
export type { User, Role } from "@prisma/client";
export default UserModel;
