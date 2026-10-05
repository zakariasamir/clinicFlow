import qs from "@/lib/qs";
import request2 from "@/lib/request2";
import useSWR, { SWRConfiguration } from "swr";
import useSWRMutation from "swr/mutation";
import { Appointment, AppointmentStatus } from "../types";

export interface AppointmentFilterQuery {
  date?: string;
  status?: AppointmentStatus | "ALL";
  page?: number;
  limit?: number;
  [key: string]: unknown;
}

export type AppointmentFilterParams = AppointmentFilterQuery;

export interface CreateAppointmentDto {
  patientId: string;
  appointmentDate: string;
  reason: string;
  status?: AppointmentStatus;
  notes?: string | null;
}

// GET /appointments
export function useFindAll(
  query?: AppointmentFilterQuery,
  swrConfig?: SWRConfiguration
) {
  const queryString = qs.stringify(query);
  const key = `/appointments${queryString ? `?${queryString}` : ""}`;

  const { data, isLoading, isValidating, error, mutate } = useSWR<{
    success: boolean;
    data: Appointment[];
    meta?: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  }>(
    key,
    (url: string) => request2.get(url),
    { keepPreviousData: true, ...swrConfig }
  );

  const page = data?.meta?.page ?? (Number(query?.page) || 1);
  const limit = data?.meta?.limit ?? (Number(query?.limit) || 20);
  const totalDocs = data?.meta?.total ?? data?.data?.length ?? 0;
  const totalPages = data?.meta?.totalPages ?? 1;

  return {
    appointments: data?.data || [],
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

// GET /appointments/:appointmentId
type useFindByIdParams = { appointmentId: string };
export function useFindById(
  params: useFindByIdParams,
  swrConfig?: SWRConfiguration
) {
  const { appointmentId } = params;
  const key = appointmentId ? `/appointments/${appointmentId}` : null;

  const { data, isLoading, isValidating, error, mutate } = useSWR<{ success: boolean; data: Appointment }>(
    key,
    (url: string) => request2.get(url),
    swrConfig
  );

  return {
    appointment: data?.data,
    isLoading,
    isValidating,
    error,
    isError: !!error,
    mutate,
  };
}

// Alias for backwards compatibility
export function useGetById(id?: string, swrConfig?: SWRConfiguration) {
  return useFindById({ appointmentId: id || "" }, swrConfig);
}

// POST /appointments
export function useCreateOne() {
  const key = `/appointments`;

  const { trigger, data, error, isMutating } = useSWRMutation<
    { success: boolean; data: Appointment },
    Error,
    string,
    CreateAppointmentDto
  >(key, (url, { arg }) => {
    return request2.post(url, arg);
  });

  return { trigger, data: data?.data, error, isMutating };
}

// Direct async helper
export async function create(dto: CreateAppointmentDto): Promise<Appointment> {
  const res = (await request2.post("/appointments", dto)) as { data: Appointment };
  return res.data;
}

// PATCH /appointments/:appointmentId/status
type useUpdateStatusByIdParams = { appointmentId: string };
export function useUpdateStatusById(params: useUpdateStatusByIdParams) {
  const { appointmentId } = params;
  const key = appointmentId ? `/appointments/${appointmentId}/status` : null;

  const { trigger, data, error, isMutating } = useSWRMutation<
    { success: boolean; data: Appointment },
    Error,
    string | null,
    { status: AppointmentStatus }
  >(key, (url, { arg }) => {
    if (!url) throw new Error("ID du rendez-vous manquant");
    return request2.patch(url, arg);
  });

  return { trigger, data: data?.data, error, isMutating };
}

// Direct async helper
export async function updateStatus(
  appointmentId: string,
  status: AppointmentStatus
): Promise<Appointment> {
  const res = (await request2.patch(`/appointments/${appointmentId}/status`, { status })) as { data: Appointment };
  return res.data;
}
