import { Router } from "express";
import root from "./root";
import appointmentId from "./[appointmentId]";

const router = Router({ mergeParams: true });

// /v1/appointments
router.use("/", root);

// /v1/appointments/:appointmentId
router.use("/:appointmentId", appointmentId);

export default router;
