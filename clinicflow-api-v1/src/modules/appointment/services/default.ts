import { BaseServices } from "@/modules/_shared";
import Model from "../models";
import { Errors } from "@/utils";
import { APPOINTMENT_STATUSES } from "@/modules/_shared/constants";

export const {
  existsById,
  exists,
  fetchAll,
  fetchOne,
  fetchById,
  createOne,
  updateById,
  updateOne,
  disableById,
  deleteById,
  countDocuments,
} = BaseServices(Model);

/**
 * Enforces the mandatory business rule:
 * "Un patient ne peut pas avoir 2 rendez-vous confirmés dans une fenêtre de 30 minutes."
 */
export const validateNoConflictWindow = async (data: {
  patientId: string;
  appointmentDate: Date;
  excludeAppointmentId?: string;
}): Promise<void> => {
  const { patientId, appointmentDate, excludeAppointmentId } = data;
  const windowStart = new Date(appointmentDate.getTime() - 30 * 60 * 1000);
  const windowEnd = new Date(appointmentDate.getTime() + 30 * 60 * 1000);

  const conflictingAppointment = await Model.findFirst({
    where: {
      patientId,
      status: APPOINTMENT_STATUSES.CONFIRMED,
      deletedAt: null,
      id: excludeAppointmentId ? { not: excludeAppointmentId } : undefined,
      appointmentDate: {
        gte: windowStart,
        lte: windowEnd,
      },
    },
    include: {
      patient: {
        select: { fullName: true },
      },
    },
  });

  if (conflictingAppointment) {
    const conflictFormattedTime = conflictingAppointment.appointmentDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    throw Errors.conflict(
      `Règle métier violée : le patient a déjà un rendez-vous confirmé à ${conflictFormattedTime} (conflit dans la fenêtre de 30 minutes).`
    );
  }
};
