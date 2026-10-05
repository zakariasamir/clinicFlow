import request2, { API_BASE_URL } from "@/lib/request2";

export { API_BASE_URL };
export const apiClient = request2;

export const swrFetcher = async (url: string) => {
  const response = (await request2.get(url)) as { data?: unknown };
  return response?.data ?? response;
};

export default request2;
