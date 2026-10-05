export type Role = "ADMIN" | "STAFF";

export type AppointmentStatus = "PENDING" | "CONFIRMED" | "CANCELLED";

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: Role;
  createdAt: string;
}

export interface Patient {
  id: string;
  cin: string;
  fullName: string;
  phone: string;
  birthDate: string;
  address?: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: {
    appointments: number;
  };
  appointments?: Appointment[];
}

export interface Appointment {
  id: string;
  patientId: string;
  createdById?: string | null;
  appointmentDate: string;
  status: AppointmentStatus;
  reason: string;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  patient?: {
    id: string;
    fullName: string;
    cin: string;
    phone: string;
  };
  creator?: {
    id: string;
    fullName: string;
    role: Role;
  } | null;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta: PaginationMeta;
}

export interface DashboardMetrics {
  totalPatients: number;
  todayAppointments: number;
  pendingAppointments: number;
  confirmedAppointments: number;
}

export interface DashboardData {
  metrics: DashboardMetrics;
  recentAppointments: Appointment[];
}
