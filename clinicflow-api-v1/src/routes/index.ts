import { Router } from "express";
import v1 from "./v1";

const router = Router();

// Versioned routes: /v1/auth, /v1/patients, /v1/appointments, /v1/dashboard
router.use("/v1", v1);

// Direct routes per PDF spec: /auth, /patients, /appointments, /dashboard
router.use("/", v1);

export default router;
