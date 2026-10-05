import { prisma } from "@/loaders/database";
import { APPOINTMENT_STATUSES } from "@/modules/_shared/constants";
import { startOfDay, endOfDay } from "date-fns";

export const getStats = async () => {
  const today = new Date();
  const todayStart = startOfDay(today);
  const todayEnd = endOfDay(today);

  const [totalPatients, todayAppointments, pendingCount, confirmedCount] = await Promise.all([
    // 1. Total patients (excluding soft-deleted)
    prisma.patient.count({
      where: { deletedAt: null },
    }),

    // 2. Appointments scheduled for today
    prisma.appointment.count({
      where: {
        deletedAt: null,
        appointmentDate: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
    }),

    // 3. Total pending appointments
    prisma.appointment.count({
      where: {
        deletedAt: null,
        status: APPOINTMENT_STATUSES.PENDING,
      },
    }),

    // 4. Total confirmed appointments
    prisma.appointment.count({
      where: {
        deletedAt: null,
        status: APPOINTMENT_STATUSES.CONFIRMED,
      },
    }),
  ]);

  // Fetch recent upcoming appointments for quick dashboard preview
  const recentAppointments = await prisma.appointment.findMany({
    where: {
      deletedAt: null,
      appointmentDate: { gte: todayStart },
    },
    take: 5,
    orderBy: { appointmentDate: "asc" },
    include: {
      patient: {
        select: { id: true, fullName: true, cin: true, phone: true },
      },
    },
  });

  return {
    metrics: {
      totalPatients,
      todayAppointments,
      pendingAppointments: pendingCount,
      confirmedAppointments: confirmedCount,
    },
    recentAppointments,
  };
};

export default {
  getStats,
};
