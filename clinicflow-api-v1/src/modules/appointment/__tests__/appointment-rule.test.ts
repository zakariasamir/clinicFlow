import { describe, it, expect, vi, beforeEach } from "vitest";
import AppointmentModule from "../index";
import { prisma } from "@/loaders/database";
import { AppointmentStatus } from "@prisma/client";

// Mock the prisma client for unit/rule tests
vi.mock("@/loaders/database", () => ({
  prisma: {
    patient: {
      findFirst: vi.fn(),
    },
    appointment: {
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      findMany: vi.fn(),
    },
    auditLog: {
      create: vi.fn(),
    },
  },
}));

vi.mock("@/services", () => ({
  EventEmitter: {
    emit: vi.fn(),
    start: vi.fn(),
  },
  AsyncHook: {
    start: vi.fn(),
    getRequestContext: vi.fn(),
    createRequestContext: vi.fn(),
  },
  Logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

describe("Appointment Business Rule: 30-Minute Conflict Window", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fail when patient already has a confirmed appointment within 20 minutes", async () => {
    const patientId = "patient-uuid-123";
    const requestedDate = new Date("2026-10-15T10:00:00.000Z");

    // Existing confirmed appointment at 10:20 (20 min later, within 30 min window)
    (prisma.appointment.findFirst as any).mockResolvedValueOnce({
      id: "appt-existing-456",
      patientId,
      status: AppointmentStatus.CONFIRMED,
      appointmentDate: new Date("2026-10-15T10:20:00.000Z"),
      patient: { fullName: "Amine Bennani" },
    });

    await expect(
      AppointmentModule.services.validateNoConflictWindow({
        patientId,
        appointmentDate: requestedDate,
      })
    ).rejects.toThrow();
  });

  it("should succeed when no conflicting appointment is in the 30-minute window", async () => {
    const patientId = "patient-uuid-123";
    const requestedDate = new Date("2026-10-15T10:00:00.000Z");

    (prisma.appointment.findFirst as any).mockResolvedValueOnce(null);

    await expect(
      AppointmentModule.services.validateNoConflictWindow({
        patientId,
        appointmentDate: requestedDate,
      })
    ).resolves.toBeUndefined();
  });

  it("should allow excluding the appointment's own ID when updating status to CONFIRMED", async () => {
    const patientId = "patient-uuid-123";
    const requestedDate = new Date("2026-10-15T10:00:00.000Z");
    const currentAppointmentId = "appt-self-789";

    (prisma.appointment.findFirst as any).mockResolvedValueOnce(null);

    await expect(
      AppointmentModule.services.validateNoConflictWindow({
        patientId,
        appointmentDate: requestedDate,
        excludeAppointmentId: currentAppointmentId,
      })
    ).resolves.toBeUndefined();

    expect(prisma.appointment.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          id: { not: currentAppointmentId },
          status: AppointmentStatus.CONFIRMED,
        }),
      })
    );
  });
});
