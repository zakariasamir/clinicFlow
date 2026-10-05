import { z } from "zod";
import { AppointmentStatus } from "@prisma/client";

const statusSchema = z.preprocess(
  (val) => (typeof val === "string" ? val.toUpperCase() : val),
  z.nativeEnum(AppointmentStatus)
);

export const createAppointmentSchema = z.object({
  patientId: z.string().uuid("Identifiant du patient invalide"),
  appointmentDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "La date et l'heure du rendez-vous doivent être valides",
  }),
  status: statusSchema.optional().default(AppointmentStatus.PENDING),
  reason: z.string().min(2, "Le motif du rendez-vous est obligatoire"),
  notes: z.string().optional().nullable(),
});

export const updateAppointmentStatusSchema = z.object({
  status: statusSchema,
});

export const queryAppointmentSchema = z.object({
  date: z.string().optional(),
  status: statusSchema.optional(),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(20),
});

export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>;
export type UpdateAppointmentStatusInput = z.infer<typeof updateAppointmentStatusSchema>;
export type QueryAppointmentInput = z.infer<typeof queryAppointmentSchema>;
