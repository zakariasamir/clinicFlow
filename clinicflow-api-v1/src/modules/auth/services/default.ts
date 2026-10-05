import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import config from "@/config";
import { Errors } from "@/utils";
import UserModule from "@/modules/user";

export const login = async (payload: { email?: string; password?: string }) => {
  const { email, password } = payload;
  if (!email || !password) {
    throw Errors.badRequest("L'email et le mot de passe sont requis.");
  }

  const user = await UserModule.services.fetchOne({
    query: {
      email: email.toLowerCase().trim(),
      deletedAt: null,
    },
  });

  if (!user) {
    throw Errors.incorrectCredentials();
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    throw Errors.incorrectCredentials();
  }

  const tokenPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    fullName: user.fullName,
  };

  const options: SignOptions = {
    expiresIn: (config.jwt.expiresIn as any) || "7d",
  };

  const token = jwt.sign(tokenPayload, config.jwt.secret, options);

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      fullName: user.fullName,
      createdAt: user.createdAt,
    },
  };
};

export const getMe = async (userId: string) => {
  const user = await UserModule.services.fetchById({
    id: userId,
    selection: ["id", "email", "fullName", "role", "createdAt"],
    throwIfNoResult: true,
  });

  return user;
};

export default {
  login,
  getMe,
};
