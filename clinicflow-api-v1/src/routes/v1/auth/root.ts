import { Request, Router } from "express";
import AuthModule from "@/modules/auth";
import { loginSchema } from "@/modules/auth/auth.validation";
import { authenticate } from "@/middlewares";

const router = Router({ mergeParams: true });

/**
 * POST /auth/login
 */
router.post("/login", async (req: Request, res, next) => {
  try {
    const validatedData = loginSchema.parse(req.body);
    const result = await AuthModule.services.login(validatedData);
    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /auth/me
 */
router.get("/me", [authenticate], async (req: Request, res, next) => {
  try {
    const user = req.currentUser;
    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
