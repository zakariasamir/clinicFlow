import React, { useState } from "react";
import { useRouter } from "next/router";
import {
  Title,
  Text,
  Button,
  Paper,
  Table,
  Group,
  Skeleton,
  Badge,
  ActionIcon,
} from "@mantine/core";
import {
  IconArrowLeft,
  IconCalendarPlus,
  IconEdit,
  IconUser,
  IconPhone,
  IconId,
  IconMapPin,
  IconCalendar,
} from "@tabler/icons-react";
import API from "@/router";
import StatusBadge from "@/modules/_shared/components/StatusBadge";
import PatientFormModal from "../components/PatientFormModal";
import AppointmentBookingDrawer from "@/modules/appointment/patterns/AppointmentBookingDrawer";
import dayjs from "dayjs";

export function PatientDetailTemplate({ patientId }: { patientId: string }) {
  const router = useRouter();
  const [editModalOpened, setEditModalOpened] = useState(false);
  const [bookingDrawerOpened, setBookingDrawerOpened] = useState(false);

  const { patient, isLoading, mutate } = API.patients.useGetById(patientId);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton height={50} radius="md" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton height={200} radius="lg" />
          <Skeleton height={200} radius="lg" className="md:col-span-2" />
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="py-16 text-center">
        <Title order={3} className="text-slate-800">
          Patient introuvable
        </Title>
        <Text size="sm" c="dimmed" mt="xs">
          Le dossier médical demandé n'existe pas ou a été archivé.
        </Text>
        <Button
          variant="light"
          color="teal"
          size="sm"
          mt="md"
          onClick={() => router.push("/patients")}
        >
          Retour à la liste des patients
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Navigation & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <ActionIcon
            variant="default"
            size="lg"
            radius="md"
            onClick={() => router.push("/patients")}
          >
            <IconArrowLeft size={18} />
          </ActionIcon>
          <div>
            <Title order={1} className="text-2xl font-bold text-slate-900 tracking-tight">
              {patient.fullName}
            </Title>
            <Text size="xs" c="dimmed">
              Dossier Médical Clinique • CIN : <span className="font-mono font-semibold">{patient.cin}</span>
            </Text>
          </div>
        </div>

        <Group gap="xs">
          <Button
            leftSection={<IconEdit size={16} />}
            variant="default"
            size="sm"
            onClick={() => setEditModalOpened(true)}
          >
            Modifier le Dossier
          </Button>
          <Button
            leftSection={<IconCalendarPlus size={16} />}
            color="teal"
            size="sm"
            onClick={() => setBookingDrawerOpened(true)}
          >
            Nouveau Rendez-vous
          </Button>
        </Group>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Patient Profile Information */}
        <Paper withBorder radius="lg" p="lg" className="bg-white space-y-5">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-12 h-12 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-lg">
              <IconUser size={24} />
            </div>
            <div>
              <div className="font-bold text-slate-900 text-base">{patient.fullName}</div>
              <Badge color="teal" variant="light" size="xs">
                Patient Actif
              </Badge>
            </div>
          </div>

          <div className="space-y-3.5 text-sm">
            <div className="flex items-start gap-2.5">
              <IconId size={18} className="text-slate-400 mt-0.5 shrink-0" />
              <div>
                <div className="text-xs text-slate-400">CIN (Identifiant)</div>
                <div className="font-mono font-semibold text-slate-800">{patient.cin}</div>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <IconPhone size={18} className="text-slate-400 mt-0.5 shrink-0" />
              <div>
                <div className="text-xs text-slate-400">Téléphone</div>
                <div className="font-medium text-slate-800">{patient.phone}</div>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <IconCalendar size={18} className="text-slate-400 mt-0.5 shrink-0" />
              <div>
                <div className="text-xs text-slate-400">Date de Naissance</div>
                <div className="text-slate-800">
                  {dayjs(patient.birthDate).format("DD MMMM YYYY")} (
                  {dayjs().diff(dayjs(patient.birthDate), "year")} ans)
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <IconMapPin size={18} className="text-slate-400 mt-0.5 shrink-0" />
              <div>
                <div className="text-xs text-slate-400">Adresse</div>
                <div className="text-slate-700">{patient.address || "Non renseignée"}</div>
              </div>
            </div>
          </div>
        </Paper>

        {/* Right Column: List of Patient's Appointments */}
        <Paper withBorder radius="lg" p="lg" className="bg-white lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <Title order={3} className="text-base font-semibold text-slate-900">
                Historique des Rendez-vous
              </Title>
              <Text size="xs" c="dimmed">
                Toutes les consultations programmées pour ce patient
              </Text>
            </div>
            <Badge color="gray" variant="light">
              {patient.appointments?.length ?? 0} rendez-vous
            </Badge>
          </div>

          {!patient.appointments?.length ? (
            <div className="py-12 text-center text-slate-500">
              <IconCalendar size={36} className="mx-auto text-slate-300 mb-2" />
              <Text size="sm">Aucun rendez-vous enregistré pour ce patient.</Text>
              <Button
                variant="subtle"
                color="teal"
                size="xs"
                mt="xs"
                onClick={() => setBookingDrawerOpened(true)}
              >
                Planifier une première consultation
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table verticalSpacing="sm" highlightOnHover>
                <Table.Thead className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider">
                  <Table.Tr>
                    <Table.Th>Date & Heure</Table.Th>
                    <Table.Th>Motif</Table.Th>
                    <Table.Th>Statut</Table.Th>
                    <Table.Th>Créé par</Table.Th>
                    <Table.Th>Notes</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {patient.appointments.map((appt) => (
                    <Table.Tr key={appt.id} className="text-sm">
                      <Table.Td>
                        <div className="font-semibold text-slate-900">
                          {dayjs(appt.appointmentDate).format("DD MMM YYYY")}
                        </div>
                        <div className="text-xs text-teal-700 font-bold">
                          {dayjs(appt.appointmentDate).format("HH:mm")}
                        </div>
                      </Table.Td>

                      <Table.Td className="font-medium text-slate-800">
                        {appt.reason}
                      </Table.Td>

                      <Table.Td>
                        <StatusBadge status={appt.status} />
                      </Table.Td>

                      <Table.Td className="text-xs text-slate-500">
                        {appt.creator?.fullName || "Système"}
                      </Table.Td>

                      <Table.Td className="text-xs text-slate-500 max-w-xs truncate">
                        {appt.notes || "—"}
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </div>
          )}
        </Paper>
      </div>

      {/* Edit Patient Modal */}
      <PatientFormModal
        opened={editModalOpened}
        onClose={() => setEditModalOpened(false)}
        patientToEdit={patient}
        onSuccess={() => mutate()}
      />

      {/* Appointment Booking Drawer pre-selected for this patient */}
      <AppointmentBookingDrawer
        opened={bookingDrawerOpened}
        onClose={() => setBookingDrawerOpened(false)}
        initialPatientId={patient.id}
        onSuccess={() => mutate()}
      />
    </div>
  );
}

export default PatientDetailTemplate;
