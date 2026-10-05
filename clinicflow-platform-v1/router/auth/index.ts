import request2 from "@/lib/request2";
import useSWR, { SWRConfiguration } from "swr";
import { User } from "../types";

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// GET /auth/me
export function useMe(swrConfig?: SWRConfiguration) {
  const hasToken =
    typeof window !== "undefined" && !!localStorage.getItem("clinicflow_token");

  const key = hasToken ? `/auth/me` : null;

  const { data, isLoading, isValidating, error, mutate } = useSWR<{ success: boolean; data: User }>(
    key,
    (url: string) => request2.get(url),
    swrConfig
  );

  return {
    user: data?.data,
    isLoading,
    isValidating,
    error,
    isError: !!error,
    mutate,
  };
}

export async function login(dto: LoginDto): Promise<AuthResponse> {
  const res = (await request2.post("/auth/login", dto)) as { data: AuthResponse };
  const authData: AuthResponse = res.data;

  if (typeof window !== "undefined") {
    localStorage.setItem("clinicflow_token", authData.token);
    localStorage.setItem("clinicflow_user", JSON.stringify(authData.user));
  }

  return authData;
}

export function logout() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("clinicflow_token");
    localStorage.removeItem("clinicflow_user");
    window.location.href = "/login";
  }
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null;
  const userJson = localStorage.getItem("clinicflow_user");
  if (!userJson) return null;
  try {
    return JSON.parse(userJson) as User;
  } catch {
    return null;
  }
}

const authApi = {
  login,
  logout,
  getCurrentUser,
  useMe,
};

export default authApi;
