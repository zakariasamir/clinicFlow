export const DomainEvents = {
  APPOINTMENT_CREATED: "appointment.created",
  APPOINTMENT_STATUS_CHANGED: "appointment.status_changed",
  PATIENT_CREATED: "patient.created",
  PATIENT_UPDATED: "patient.updated",
  PATIENT_DELETED: "patient.deleted",
} as const;

export type DomainEventType = typeof DomainEvents[keyof typeof DomainEvents];
