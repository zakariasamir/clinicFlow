import { Router } from "express";
import root from "./root";
import patientId from "./[patientId]";

const router = Router({ mergeParams: true });

// /v1/patients
router.use("/", root);

// /v1/patients/:patientId
router.use("/:patientId", patientId);

export default router;
