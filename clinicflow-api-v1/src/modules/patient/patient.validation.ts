import { z } from "zod";

export const createPatientSchema = z.object({
  fullName: z.string().min(2, "Le nom complet est obligatoire (min 2 caractères)"),
  cin: z.string().min(3, "Le CIN est obligatoire et unique").toUpperCase().trim(),
  phone: z.string().min(6, "Le numéro de téléphone est obligatoire"),
  birthDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "La date de naissance doit être une date valide (YYYY-MM-DD)",
  }),
  address: z.string().optional().nullable(),
});

export const updatePatientSchema = createPatientSchema.partial();

export const queryPatientSchema = z.object({
  search: z.string().optional(),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(10),
});

export type CreatePatientInput = z.infer<typeof createPatientSchema>;
export type UpdatePatientInput = z.infer<typeof updatePatientSchema>;
export type QueryPatientInput = z.infer<typeof queryPatientSchema>;
