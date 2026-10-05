import { eventEmitter } from "@/loaders/eventEmitter";
import { prisma } from "@/loaders/database";
import { DomainEvents } from "@/workflows/events";

export function registerAuditWorkflows(): void {
  // Appointment status changed audit logger
  eventEmitter.on(DomainEvents.APPOINTMENT_STATUS_CHANGED, async (payload: {
    appointmentId: string;
    previousStatus: string;
    newStatus: string;
    actorId?: string;
  }) => {
    try {
      await prisma.auditLog.create({
        data: {
          action: "APPOINTMENT_STATUS_UPDATE",
          entity: "appointments",
          entityId: payload.appointmentId,
          actorId: payload.actorId,
          metadata: {
            from: payload.previousStatus,
            to: payload.newStatus,
          },
        },
      });
      console.log(`[AuditWorkflow] Logged status change for appointment ${payload.appointmentId}`);
    } catch (err) {
      console.error("[AuditWorkflow] Failed to record audit log:", err);
    }
  });

  // Patient deleted audit logger
  eventEmitter.on(DomainEvents.PATIENT_DELETED, async (payload: {
    patientId: string;
    cin: string;
    actorId?: string;
  }) => {
    try {
      await prisma.auditLog.create({
        data: {
          action: "PATIENT_SOFT_DELETE",
          entity: "patients",
          entityId: payload.patientId,
          actorId: payload.actorId,
          metadata: {
            cin: payload.cin,
          },
        },
      });
      console.log(`[AuditWorkflow] Logged deletion of patient ${payload.cin}`);
    } catch (err) {
      console.error("[AuditWorkflow] Failed to record audit log:", err);
    }
  });
}
