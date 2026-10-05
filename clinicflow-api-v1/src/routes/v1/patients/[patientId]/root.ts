import { Request, Router } from "express";
import PatientModule from "@/modules/patient";
import { updatePatientSchema } from "@/modules/patient/patient.validation";
import { authenticate, isAdmin } from "@/middlewares";
import { Errors } from "@/utils";

const router = Router({ mergeParams: true });

router.use(authenticate);

/**
 * GET /patients/:patientId
 */
router.get("/", async (req: Request, res, next) => {
  try {
    const id = Array.isArray(req.params.patientId) ? req.params.patientId[0] : req.params.patientId;

    const patient = await PatientModule.services.fetchById({
      id,
      include: {
        appointments: {
          where: { deletedAt: null },
          orderBy: { appointmentDate: "desc" },
          include: {
            creator: {
              select: { id: true, fullName: true, role: true },
            },
          },
        },
      },
      throwIfNoResult: true,
    });

    return res.status(200).json({
      success: true,
      data: patient,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /patients/:patientId
 */
router.put("/", async (req: Request, res, next) => {
  try {
    const id = Array.isArray(req.params.patientId) ? req.params.patientId[0] : req.params.patientId;
    const validatedData = updatePatientSchema.parse(req.body);
    const { fullName, cin, phone, birthDate, address } = validatedData;

    await PatientModule.services.fetchById({ id, throwIfNoResult: true });

    if (cin) {
      const cinExists = await PatientModule.services.exists({
        query: {
          cin: cin.toUpperCase().trim(),
          deletedAt: null,
          id: { not: id },
        },
      });

      if (cinExists) {
        throw Errors.conflict(`Un patient avec le CIN '${cin}' existe déjà.`);
      }
    }

    const updated = await PatientModule.services.updateById({
      id,
      payload: {
        ...(fullName && { fullName }),
        ...(cin && { cin: cin.toUpperCase().trim() }),
        ...(phone && { phone }),
        ...(birthDate && { birthDate: new Date(birthDate) }),
        ...(address !== undefined && { address: address || null }),
      },
    });

    return res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /patients/:patientId (Admin only)
 */
router.delete("/", [isAdmin], async (req: Request, res, next) => {
  try {
    const id = Array.isArray(req.params.patientId) ? req.params.patientId[0] : req.params.patientId;

    await PatientModule.services.fetchById({ id, throwIfNoResult: true });
    await PatientModule.services.disableById({ id });

    return res.status(200).json({
      success: true,
      message: "Patient supprimé avec succès.",
    });
  } catch (error) {
    next(error);
  }
});

export default router;
