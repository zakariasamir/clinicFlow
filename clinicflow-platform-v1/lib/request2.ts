import axios from "axios";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

const request2 = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

request2.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
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
