import { Request, Response, NextFunction } from "express";
import { Errors } from "@/utils";
import { ROLES } from "@/modules/_shared/constants";

export default function isAdmin(req: Request, _res: Response, next: NextFunction) {
  if (!req.currentUser) {
    return next(Errors.unAuthenticatedUser());
  }

  if (req.currentUser.role !== ROLES.ADMIN) {
    return next(Errors.forbidden("Action réservée aux administrateurs."));
  }

  next();
}
