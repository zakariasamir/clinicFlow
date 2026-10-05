import { Request, Response, NextFunction } from "express";
import { AsyncHook } from "@/services";
import { Errors } from "@/utils";
import UserModule from "@/modules/user";

export default async function authenticate(req: Request, _res: Response, next: NextFunction) {
  try {
    const userIdFromToken = req.token?.data?.userId || req.token?.data?._id;
    if (!userIdFromToken) {
      return next(Errors.unAuthenticatedUser("You need to be authenticated to perform this request."));
    }

    const rawUser = await UserModule.services.fetchById({
      id: userIdFromToken,
      selection: ["id", "email", "fullName", "role"],
    });

    if (!rawUser) {
      return next(Errors.noAccountAssociatedWithAuthToken());
    }

    req.currentUser = rawUser;

    const currentReqContext = AsyncHook.getRequestContext();
    if (currentReqContext) {
      currentReqContext.data = {
        ...currentReqContext.data,
        currentUser: rawUser,
      };
    }

    next();
  } catch (error) {
    next(error);
  }
}
