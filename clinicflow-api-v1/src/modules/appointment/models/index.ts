import { prisma } from "@/loaders/database";

export const AppointmentModel = prisma.appointment;
export type { Appointment, AppointmentStatus } from "@prisma/client";
export default AppointmentModel;
