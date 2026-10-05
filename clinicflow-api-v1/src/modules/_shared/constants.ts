export const ROLES = {
  ADMIN: "ADMIN",
  STAFF: "STAFF",
} as const;

export const APPOINTMENT_STATUSES = {
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  CANCELLED: "CANCELLED",
} as const;

export default {
  ROLES,
  APPOINTMENT_STATUSES,
};
