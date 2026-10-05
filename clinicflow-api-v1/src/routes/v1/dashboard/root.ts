import { Request, Router } from "express";
import DashboardModule from "@/modules/dashboard";
import { authenticate } from "@/middlewares";

const router = Router({ mergeParams: true });

router.use(authenticate);

/**
 * GET /dashboard/stats
 */
router.get("/stats", async (_req: Request, res, next) => {
  try {
    const stats = await DashboardModule.services.getStats();
    return res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
