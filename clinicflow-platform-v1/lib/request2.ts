import axios from "axios";

let runtimeApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

if (typeof window !== "undefined") {
  // Try to read stored or runtime config if available
  const storedUrl = localStorage.getItem("clinicflow_api_url");
  if (storedUrl) {
    runtimeApiUrl = storedUrl;
  }
}

export const API_BASE_URL = runtimeApiUrl;

const request2 = axios.create({
  baseURL: runtimeApiUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

request2.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      // Ensure baseURL is updated from localStorage if changed
      const currentStored = localStorage.getItem("clinicflow_api_url");
      if (currentStored && config.baseURL !== currentStored) {
        config.baseURL = currentStored;
      }

      const token = localStorage.getItem("clinicflow_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

request2.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (typeof window !== "undefined" && error.response?.status === 401) {
      if (!window.location.pathname.includes("/login")) {
        localStorage.removeItem("clinicflow_token");
        localStorage.removeItem("clinicflow_user");
        window.location.href = "/login";
      }
    }
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Une erreur est survenue";
    return Promise.reject(new Error(message));
  }
);

export default request2;
