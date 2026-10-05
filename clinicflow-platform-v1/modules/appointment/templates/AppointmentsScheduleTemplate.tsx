import StatusBadge from "@/modules/_shared/components/StatusBadge";
import API from "@/router";
import { AppointmentStatus } from "@/router/types";
import {
  Button,
  Menu,
  Paper,
  Select,
  Skeleton,
  Table,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  IconCalendar,
  IconCalendarPlus,
  IconCheck,
  IconClock,
  IconDotsVertical,
  IconX,
} from "@tabler/icons-react";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { useState } from "react";
import AppointmentBookingDrawer from "../patterns/AppointmentBookingDrawer";
import Pagination from "@/modules/_shared/components/Pagination";

export function AppointmentsScheduleTemplate() {
  const router = useRouter();
  const [filterDate, setFilterDate] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [drawerOpened, setDrawerOpened] = useState(
    router.query.action === "create",
  );
  const [selectedPatientId, setSelectedPatientId] = useState<
    string | undefined
  >((router.query.patientId as string) || undefined);

  const { appointments, meta, totalPages, totalDocs, isLoading, mutate } = API.appointments.useList({
    date: filterDate || undefined,
    status:
      filterStatus === "ALL" ? undefined : (filterStatus as AppointmentStatus),
    page,
    limit,
  });

  const handleStatusChange = async (
    appointmentId: string,
    newStatus: AppointmentStatus,
  ) => {
    try {
      await API.appointments.updateStatus(appointmentId, newStatus);
      notifications.show({
        title: "Statut mis à jour",
        message: `Le statut du rendez-vous est maintenant '${newStatus}'.`,
        color: "teal",
        icon: <IconCheck size={16} />,
      });
      mutate();
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        "Impossible de mettre à jour le statut du rendez-vous.";
      notifications.show({
        title: "Conflit ou Erreur Métier",
        message: msg,
        color: "red",
        autoClose: 6000,
      });
    }
  };

  const handleResetFilters = () => {
    setFilterDate("");
    setFilterStatus("ALL");
    setPage(1);
  };

  const handleSetToday = () => {
    setFilterDate(dayjs().format("YYYY-MM-DD"));
    setPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Header & Primary Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Title
            order={1}
            className="text-2xl font-bold text-slate-900 tracking-tight"
          >
            Planning des Rendez-vous
          </Title>
          <Text size="sm" c="dimmed">
            Planifiez, filtrez par date/statut et gérez les consultations
            cliniques
          </Text>
        </div>

        <Button
          leftSection={<IconCalendarPlus size={16} />}
          color="teal"
          size="sm"
          onClick={() => {
            setSelectedPatientId(undefined);
            setDrawerOpened(true);
          }}
        >
          Nouveau Rendez-vous
        </Button>
      </div>

      {/* Filter Toolbar */}
      <Paper withBorder p="md" radius="lg" className="bg-white">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <TextInput
              label="Filtrer par Date"
              type="date"
              size="xs"
              value={filterDate}
              onChange={(e) => setFilterDate(e.currentTarget.value)}
              className="w-40"
            />

            <Select
              label="Filtrer par Statut"
              size="xs"
              data={[
                { value: "ALL", label: "Tous les statuts" },
                { value: "PENDING", label: "En attente (Pending)" },
                { value: "CONFIRMED", label: "Confirmé (Confirmed)" },
                { value: "CANCELLED", label: "Annulé (Cancelled)" },
              ]}
              value={filterStatus}
              onChange={(val) => setFilterStatus(val || "ALL")}
              className="w-44"
            />

            <div className="flex items-end gap-1.5 mt-auto">
              <Button
                variant="light"
                color="teal"
                size="xs"
                onClick={handleSetToday}
              >
                Aujourd'hui
              </Button>

              {(filterDate || filterStatus !== "ALL") && (
                <Button
                  variant="subtle"
                  color="gray"
                  size="xs"
                  onClick={handleResetFilters}
                >
                  Réinitialiser
                </Button>
              )}
            </div>
          </div>

          <Text size="xs" c="dimmed">
            Affichage de{" "}
            <strong className="text-slate-800">{appointments.length}</strong>{" "}
            rendez-vous
          </Text>
        </div>
      </Paper>

      {/* Appointments List Table */}
      <Paper withBorder radius="lg" p="lg" className="bg-white">
        {isLoading ? (
          <div className="space-y-3 py-4">
            <Skeleton height={44} radius="md" />
            <Skeleton height={44} radius="md" />
            <Skeleton height={44} radius="md" />
          </div>
        ) : !appointments.length ? (
          <div className="py-12 text-center text-slate-500">
            <IconCalendar size={40} className="mx-auto text-slate-300 mb-2" />
            <Text size="sm" fw={500}>
              Aucun rendez-vous trouvé pour les critères sélectionnés.
            </Text>
            <Button
              variant="subtle"
              color="teal"
              size="xs"
              mt="xs"
              onClick={() => {
                setSelectedPatientId(undefined);
                setDrawerOpened(true);
              }}
            >
              Planifier une nouvelle consultation
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table verticalSpacing="sm" highlightOnHover>
              <Table.Thead className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider">
                <Table.Tr>
                  <Table.Th>Patient</Table.Th>
                  <Table.Th>Date & Heure</Table.Th>
                  <Table.Th>Motif de la consultation</Table.Th>
                  <Table.Th>Statut</Table.Th>
                  <Table.Th>Planifié par</Table.Th>
                  <Table.Th className="text-right">Changer Statut</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {appointments.map((appt) => (
                  <Table.Tr key={appt.id} className="text-sm">
                    <Table.Td>
                      <button
                        onClick={() =>
                          router.push(`/patients/${appt.patient?.id}`)
                        }
                        className="font-semibold text-slate-900 hover:text-teal-600 text-left block"
                      >
                        {appt.patient?.fullName || "—"}
                      </button>
                      <span className="text-xs text-slate-500 font-mono">
                        CIN: {appt.patient?.cin || "—"} •{" "}
                        {appt.patient?.phone || "—"}
                      </span>
                    </Table.Td>

                    <Table.Td>
                      <div className="font-semibold text-slate-800">
                        {dayjs(appt.appointmentDate).format("DD MMMM YYYY")}
                      </div>
                      <div className="text-xs text-teal-700 font-bold">
                        {dayjs(appt.appointmentDate).format("HH:mm")}
                      </div>
                    </Table.Td>

                    <Table.Td>
                      <div className="font-medium text-slate-800">
                        {appt.reason}
                      </div>
                      {appt.notes && (
                        <div className="text-xs text-slate-400 truncate max-w-xs">
                          {appt.notes}
                        </div>
                      )}
                    </Table.Td>

                    <Table.Td>
                      <StatusBadge status={appt.status} />
                    </Table.Td>

                    <Table.Td className="text-xs text-slate-500">
                      {appt.creator?.fullName || "Système"}
                    </Table.Td>

                    <Table.Td className="text-right">
                      <Menu position="bottom-end" shadow="md">
                        <Menu.Target>
                          <Button
                            variant="light"
                            color="gray"
                            size="xs"
                            rightSection={<IconDotsVertical size={14} />}
                          >
                            Modifier
                          </Button>
                        </Menu.Target>
                        <Menu.Dropdown>
                          <Menu.Label>Modifier le statut</Menu.Label>
                          {appt.status !== "CONFIRMED" && (
                            <Menu.Item
                              color="teal"
                              leftSection={<IconCheck size={14} />}
                              onClick={() =>
                                handleStatusChange(appt.id, "CONFIRMED")
                              }
                            >
                              Confirmer (Vérifie règle 30 min)
                            </Menu.Item>
                          )}
                          {appt.status !== "PENDING" && (
                            <Menu.Item
                              color="yellow"
                              leftSection={<IconClock size={14} />}
                              onClick={() =>
                                handleStatusChange(appt.id, "PENDING")
                              }
                            >
                              Mettre en attente
                            </Menu.Item>
                          )}
                          {appt.status !== "CANCELLED" && (
                            <Menu.Item
                              color="red"
                              leftSection={<IconX size={14} />}
                              onClick={() =>
                                handleStatusChange(appt.id, "CANCELLED")
                              }
                            >
                              Annuler le rendez-vous
                            </Menu.Item>
                          )}
                        </Menu.Dropdown>
                      </Menu>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </div>
        )}

        {/* Pagination */}
        <Pagination
          page={page}
          totalPages={totalPages || meta?.totalPages || 1}
          totalDocs={totalDocs || meta?.total || 0}
          limit={limit}
          isLoading={isLoading}
          onPageChange={(newPage) => {
            setPage(newPage);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          onLimitChange={(newLimit) => {
            setLimit(newLimit);
            setPage(1);
          }}
          itemLabel="rendez-vous"
        />
      </Paper>

      {/* Appointment Booking Drawer */}
      <AppointmentBookingDrawer
        opened={drawerOpened}
        onClose={() => setDrawerOpened(false)}
        initialPatientId={selectedPatientId}
        onSuccess={() => mutate()}
      />
    </div>
  );
}

export default AppointmentsScheduleTemplate;
