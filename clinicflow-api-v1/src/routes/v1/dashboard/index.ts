import { Router } from "express";
import root from "./root";

const router = Router({ mergeParams: true });

// /v1/dashboard
router.use("/", root);

export default router;
