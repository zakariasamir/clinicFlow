import { prisma } from "@/loaders/database";

export const PatientModel = prisma.patient;
export type { Patient } from "@prisma/client";
export default PatientModel;
