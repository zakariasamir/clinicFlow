import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "@/config";

declare global {
  namespace Express {
    interface Request {
      token?: any;
      currentUser?: any;
    }
  }
}

export default function attachJWT(req: Request, _res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, config.jwt.secret);
      req.token = { data: decoded };
    }
    next();
  } catch (err: any) {
    // Let authenticate middleware handle missing or invalid token
    next();
  }
}
