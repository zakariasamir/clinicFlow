import { Request, Router } from "express";
import AppointmentModule from "@/modules/appointment";
import PatientModule from "@/modules/patient";
import { createAppointmentSchema } from "@/modules/appointment/appointment.validation";
import { authenticate } from "@/middlewares";
import { Errors } from "@/utils";
import { APPOINTMENT_STATUSES } from "@/modules/_shared/constants";
import { startOfDay, endOfDay } from "date-fns";

const router = Router({ mergeParams: true });

router.use(authenticate);

/**
 * GET /appointments?date=&status=
 */
router.get("/", async (req: Request, res, next) => {
  try {
    const { date, status } = req.query as any;

    const query: any = {
      deletedAt: null,
    };

    if (status && status !== "ALL") {
      query.status = typeof status === "string" ? status.toUpperCase() : status;
    }

    if (date) {
      const parsedDate = new Date(date);
      if (!isNaN(parsedDate.getTime())) {
        query.appointmentDate = {
          gte: startOfDay(parsedDate),
          lte: endOfDay(parsedDate),
        };
      }
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;

    const appointments = await AppointmentModule.services.fetchAll({
      query,
      sort: { appointmentDate: "asc" },
      page,
      limit,
      include: {
        patient: {
          select: { id: true, fullName: true, cin: true, phone: true },
        },
        creator: {
          select: { id: true, fullName: true, role: true },
        },
      },
    });

    return res.status(200).json({
      success: true,
      data: appointments.docs,
      meta: {
        total: appointments.totalDocs,
        page: appointments.page,
        limit: appointments.limit,
        totalPages: appointments.totalPages,
        hasNextPage: appointments.hasNextPage,
        hasPrevPage: appointments.hasPrevPage,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /appointments
 */
router.post("/", async (req: Request, res, next) => {
  try {
    const validatedData = createAppointmentSchema.parse(req.body);
    const { patientId, appointmentDate, status, reason, notes } = validatedData;

    const patientExists = await PatientModule.services.existsById({ id: patientId });
    if (!patientExists) {
      throw Errors.notFound("Patient introuvable.");
    }

    const targetDate = new Date(appointmentDate);

    // Enforce 30-minute conflict validation if CONFIRMED
    if (status === APPOINTMENT_STATUSES.CONFIRMED) {
      await AppointmentModule.services.validateNoConflictWindow({
        patientId,
        appointmentDate: targetDate,
      });
    }

    const createdById = req.currentUser?.id;

    const appointment = await AppointmentModule.services.createOne({
      payload: {
        patientId,
        createdById: createdById || null,
        appointmentDate: targetDate,
        status,
        reason,
        notes: notes || null,
      },
    });

    return res.status(201).json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    next(error);
  }
});

export default router;

