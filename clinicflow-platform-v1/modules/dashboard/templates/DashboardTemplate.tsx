import React from "react";
import { useRouter } from "next/router";
import {
  Title,
  Text,
  Button,
  Paper,
  Table,
  Group,
  Skeleton,
  Alert,
} from "@mantine/core";
import {
  IconUsers,
  IconCalendarEvent,
  IconClock,
  IconCheck,
  IconCalendarPlus,
  IconUserPlus,
  IconAlertCircle,
  IconChevronRight,
} from "@tabler/icons-react";
import API from "@/router";
import MetricKpiCard from "../components/MetricKpiCard";
import StatusBadge from "@/modules/_shared/components/StatusBadge";
import dayjs from "dayjs";
import "dayjs/locale/fr";

dayjs.locale("fr");

export function DashboardTemplate() {
  const router = useRouter();
  const { stats, isLoading, isError, error } = API.dashboard.useStats();

  return (
    <div className="space-y-8">
      {/* Header and Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
        <div>
          <Title order={1} className="text-2xl font-bold text-slate-900 tracking-tight">
            Tableau de Bord Clinique
          </Title>
          <Text size="sm" c="dimmed">
            Vue d'ensemble de l'activité du cabinet pour aujourd'hui ({dayjs().format("dddd D MMMM YYYY")})
          </Text>
        </div>

        <Group gap="xs">
          <Button
            leftSection={<IconUserPlus size={16} />}
            variant="default"
            size="sm"
            onClick={() => router.push("/patients?action=create")}
          >
            Nouveau Patient
          </Button>
          <Button
            leftSection={<IconCalendarPlus size={16} />}
            color="teal"
            size="sm"
            onClick={() => router.push("/appointments?action=create")}
          >
            Planifier RDV
          </Button>
        </Group>
      </div>

      {isError && (
        <Alert icon={<IconAlertCircle size={16} />} title="Erreur de chargement" color="red">
          {error?.response?.data?.message || "Impossible de charger les statistiques du tableau de bord."}
        </Alert>
      )}

      {/* 4 Mandatory KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          <>
            <Skeleton height={100} radius="lg" />
            <Skeleton height={100} radius="lg" />
            <Skeleton height={100} radius="lg" />
            <Skeleton height={100} radius="lg" />
          </>
        ) : (
          <>
            <MetricKpiCard
              title="Total Patients"
              value={stats?.metrics?.totalPatients ?? 0}
              icon={<IconUsers size={22} />}
              subtitle="Dossiers médicaux enregistrés"
              bgIconClass="bg-blue-50 text-blue-600"
            />
            <MetricKpiCard
              title="Rendez-vous du Jour"
              value={stats?.metrics?.todayAppointments ?? 0}
              icon={<IconCalendarEvent size={22} />}
              subtitle="Planifiés pour aujourd'hui"
              bgIconClass="bg-teal-50 text-teal-600"
            />
            <MetricKpiCard
              title="Nombre En Attente"
              value={stats?.metrics?.pendingAppointments ?? 0}
              icon={<IconClock size={22} />}
              subtitle="Statut 'pending' à valider"
              bgIconClass="bg-amber-50 text-amber-600"
            />
            <MetricKpiCard
              title="Nombre Confirmés"
              value={stats?.metrics?.confirmedAppointments ?? 0}
              icon={<IconCheck size={22} />}
              subtitle="Statut 'confirmed'"
              bgIconClass="bg-emerald-50 text-emerald-600"
            />
          </>
        )}
      </div>

      {/* Upcoming Today Appointments Table */}
      <Paper withBorder radius="lg" p="lg" className="bg-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <Title order={3} className="text-base font-semibold text-slate-900">
              Prochains Rendez-vous
            </Title>
            <Text size="xs" c="dimmed">
              Consultations programmées à partir d'aujourd'hui
            </Text>
          </div>
          <Button
            variant="subtle"
            color="teal"
            size="xs"
            rightSection={<IconChevronRight size={14} />}
            onClick={() => router.push("/appointments")}
          >
            Tous les rendez-vous
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-2 py-4">
            <Skeleton height={40} radius="md" />
            <Skeleton height={40} radius="md" />
            <Skeleton height={40} radius="md" />
          </div>
        ) : !stats?.recentAppointments?.length ? (
          <div className="py-10 text-center text-slate-500">
            <IconCalendarEvent size={36} className="mx-auto text-slate-300 mb-2" />
            <Text size="sm">Aucun rendez-vous planifié pour le moment.</Text>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table verticalSpacing="sm" highlightOnHover>
              <Table.Thead className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider">
                <Table.Tr>
                  <Table.Th>Patient</Table.Th>
                  <Table.Th>Date & Heure</Table.Th>
                  <Table.Th>Motif</Table.Th>
                  <Table.Th>Statut</Table.Th>
                  <Table.Th className="text-right">Action</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {stats.recentAppointments.map((appt) => (
                  <Table.Tr key={appt.id} className="text-sm">
                    <Table.Td>
                      <button
                        onClick={() => router.push(`/patients/${appt.patient?.id}`)}
                        className="font-medium text-slate-900 hover:text-teal-600 text-left"
                      >
                        {appt.patient?.fullName || "—"}
                      </button>
                      <div className="text-xs text-slate-500 font-mono">
                        CIN: {appt.patient?.cin || "—"}
                      </div>
                    </Table.Td>
                    <Table.Td>
                      <div className="font-medium text-slate-800">
                        {dayjs(appt.appointmentDate).format("DD MMM YYYY")}
                      </div>
                      <div className="text-xs text-teal-700 font-semibold">
                        {dayjs(appt.appointmentDate).format("HH:mm")}
                      </div>
                    </Table.Td>
                    <Table.Td className="text-slate-600 max-w-xs truncate">
                      {appt.reason}
                    </Table.Td>
                    <Table.Td>
                      <StatusBadge status={appt.status} />
                    </Table.Td>
                    <Table.Td className="text-right">
                      <Button
                        variant="light"
                        color="teal"
                        size="xs"
                        onClick={() => router.push("/appointments")}
                      >
                        Gérer
                      </Button>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </div>
        )}
      </Paper>
    </div>
  );
}

export default DashboardTemplate;
