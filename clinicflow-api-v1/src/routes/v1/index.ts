import { Router } from "express";
import auth from "./auth";
import patients from "./patients";
import appointments from "./appointments";
import dashboard from "./dashboard";

const router = Router({ mergeParams: true });

router.use("/auth", auth);
router.use("/patients", patients);
router.use("/appointments", appointments);
router.use("/dashboard", dashboard);

export default router;
