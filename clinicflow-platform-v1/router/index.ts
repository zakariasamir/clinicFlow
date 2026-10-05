import * as auth from "./auth";
import * as patients from "./patients";
import * as appointments from "./appointments";
import * as dashboard from "./dashboard";
import request2, { API_BASE_URL } from "@/lib/request2";

export * from "./types";
export { request2, API_BASE_URL };

const API = {
  auth,
  patients,
  appointments,
  dashboard,
};

export default API;
