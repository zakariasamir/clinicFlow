import request2 from "@/lib/request2";
import useSWR, { SWRConfiguration } from "swr";
import { DashboardData } from "../types";

// GET /dashboard/stats
export function useGetStats(swrConfig?: SWRConfiguration) {
  const key = `/dashboard/stats`;

  const { data, isLoading, isValidating, error, mutate } = useSWR<{ success: boolean; data: DashboardData }>(
    key,
    (url: string) => request2.get(url),
    swrConfig
  );

  return {
    stats: data?.data,
    isLoading,
    isValidating,
    error,
    isError: !!error,
    mutate,
  };
}

// Aliases for compatibility
export const useStats = useGetStats;
export const useFindAll = useGetStats;

export async function getStats(): Promise<DashboardData> {
  const res = (await request2.get("/dashboard/stats")) as { data: DashboardData };
  return res.data;
}
