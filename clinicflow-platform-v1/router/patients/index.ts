import qs from "@/lib/qs";
import request2 from "@/lib/request2";
import useSWR, { SWRConfiguration } from "swr";
import useSWRMutation from "swr/mutation";
import { Patient, PaginatedResponse } from "../types";

export interface PatientFilterQuery {
  search?: string;
  page?: number;
  limit?: number;
  [key: string]: unknown;
}

export type PatientFilterParams = PatientFilterQuery;

export interface CreatePatientDto {
  fullName: string;
  cin: string;
  phone: string;
  birthDate: string;
  address?: string | null;
}

// GET /patients
export function useFindAll(
  query?: PatientFilterQuery,
  swrConfig?: SWRConfiguration
) {
  const queryString = qs.stringify(query);
  const key = `/patients${queryString ? `?${queryString}` : ""}`;

  const { data, isLoading, isValidating, error, mutate } = useSWR<PaginatedResponse<Patient>>(
    key,
    (url: string) => request2.get(url),
    { keepPreviousData: true, ...swrConfig }
  );

  const page = data?.meta?.page ?? (Number(query?.page) || 1);
  const limit = data?.meta?.limit ?? (Number(query?.limit) || 10);
  const totalDocs = data?.meta?.total ?? 0;
  const totalPages = data?.meta?.totalPages ?? 1;

  return {
    patients: data?.data || [],
    meta: data?.meta,
    page,
    limit,
    totalDocs,
    totalPages,
    hasNextPage: data?.meta?.hasNextPage ?? page < totalPages,
    hasPreviousPage: data?.meta?.hasPrevPage ?? page > 1,
    isLoading,
    isValidating,
    error,
    isError: !!error,
    mutate,
  };
}

// Alias for backwards compatibility
export const useList = useFindAll;

// GET /patients/:patientId
type useFindByIdParams = { patientId: string };
export function useFindById(
  params: useFindByIdParams,
  swrConfig?: SWRConfiguration
) {
  const { patientId } = params;
  const key = patientId ? `/patients/${patientId}` : null;

  const { data, isLoading, isValidating, error, mutate } = useSWR<{ success: boolean; data: Patient }>(
    key,
    (url: string) => request2.get(url),
    swrConfig
  );

  return {
    patient: data?.data,
    isLoading,
    isValidating,
    error,
    isError: !!error,
    mutate,
  };
}

// Alias for backwards compatibility
export function useGetById(id?: string, swrConfig?: SWRConfiguration) {
  return useFindById({ patientId: id || "" }, swrConfig);
}

// POST /patients
export function useCreateOne() {
  const key = `/patients`;

  const { trigger, data, error, isMutating } = useSWRMutation<
    { success: boolean; data: Patient },
    Error,
    string,
    CreatePatientDto
  >(key, (url, { arg }) => {
    return request2.post(url, arg);
  });

  return { trigger, data: data?.data, error, isMutating };
}

// Direct async helper
export async function create(dto: CreatePatientDto): Promise<Patient> {
  const res = (await request2.post("/patients", dto)) as { data: Patient };
  return res.data;
}

// PUT /patients/:patientId
type useUpdateByIdParams = { patientId: string };
export function useUpdateById(params: useUpdateByIdParams) {
  const { patientId } = params;
  const key = patientId ? `/patients/${patientId}` : null;

  const { trigger, data, error, isMutating } = useSWRMutation<
    { success: boolean; data: Patient },
    Error,
    string | null,
    Partial<CreatePatientDto>
  >(key, (url, { arg }) => {
    if (!url) throw new Error("ID du patient manquant");
    return request2.put(url, arg);
  });

  return { trigger, data: data?.data, error, isMutating };
}

// Direct async helper
export async function update(patientId: string, dto: Partial<CreatePatientDto>): Promise<Patient> {
  const res = (await request2.put(`/patients/${patientId}`, dto)) as { data: Patient };
  return res.data;
}

// DELETE /patients/:patientId
type useDeleteByIdParams = { patientId: string };
export function useDeleteById(params: useDeleteByIdParams) {
  const { patientId } = params;
  const key = patientId ? `/patients/${patientId}` : null;

  const { trigger, data, error, isMutating } = useSWRMutation<
    { success: boolean },
    Error,
    string | null,
    void
  >(key, (url) => {
    if (!url) throw new Error("ID du patient manquant");
    return request2.delete(url);
  });

  return { trigger, data, error, isMutating };
}

// Direct async helper
export async function deletePatient(patientId: string): Promise<void> {
  await request2.delete(`/patients/${patientId}`);
}
export { deletePatient as delete };
