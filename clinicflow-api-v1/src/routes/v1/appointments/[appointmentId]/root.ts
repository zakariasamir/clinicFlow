import { Request, Router } from "express";
import AppointmentModule from "@/modules/appointment";
import { authenticate } from "@/middlewares";
import { Errors } from "@/utils";
import { APPOINTMENT_STATUSES } from "@/modules/_shared/constants";

const router = Router({ mergeParams: true });

router.use(authenticate);

/**
 * GET /appointments/:appointmentId
 */
router.get("/", async (req: Request, res, next) => {
  try {
    const id = Array.isArray(req.params.appointmentId) ? req.params.appointmentId[0] : req.params.appointmentId;

    const appointment = await AppointmentModule.services.fetchById({
      id,
      include: {
        patient: {
          select: { id: true, fullName: true, cin: true, phone: true },
        },
        creator: {
          select: { id: true, fullName: true, role: true },
        },
      },
      throwIfNoResult: true,
    });

    return res.status(200).json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PATCH /appointments/:appointmentId/status
 */
router.patch("/status", async (req: Request, res, next) => {
  try {
    const id = Array.isArray(req.params.appointmentId) ? req.params.appointmentId[0] : req.params.appointmentId;
    const rawStatus = req.body?.status;
    const status = typeof rawStatus === "string" ? rawStatus.toUpperCase() : rawStatus;

    if (!status || !Object.values(APPOINTMENT_STATUSES).includes(status as any)) {
      throw Errors.badRequest("Statut de rendez-vous invalide (PENDING, CONFIRMED ou CANCELLED).");
    }

    const existing = await AppointmentModule.services.fetchById({ id, throwIfNoResult: true });

    // Validate 30-min window when transitioning to CONFIRMED
    if (status === APPOINTMENT_STATUSES.CONFIRMED && existing.status !== APPOINTMENT_STATUSES.CONFIRMED) {
      await AppointmentModule.services.validateNoConflictWindow({
        patientId: existing.patientId,
        appointmentDate: existing.appointmentDate,
        excludeAppointmentId: existing.id,
      });
    }

    const updated = await AppointmentModule.services.updateById({
      id,
      payload: { status },
    });

    return res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
