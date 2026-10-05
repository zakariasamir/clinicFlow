import React, { useState } from "react";
import { useRouter } from "next/router";
import {
  Title,
  Text,
  Button,
  Paper,
  Table,
  TextInput,
  Group,
  Skeleton,
  ActionIcon,
  Badge,
  Menu,
} from "@mantine/core";
import Pagination from "@/modules/_shared/components/Pagination";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import {
  IconSearch,
  IconUserPlus,
  IconDotsVertical,
  IconEdit,
  IconTrash,
  IconEye,
  IconUsers,
  IconCalendar,
} from "@tabler/icons-react";
import API from "@/router";
import { Patient, User } from "@/router/types";
import PatientFormModal from "../components/PatientFormModal";
import authApi from "@/router/auth";
import dayjs from "dayjs";

export function PatientsListTemplate() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [modalOpened, setModalOpened] = useState(router.query.action === "create");
  const [patientToEdit, setPatientToEdit] = useState<Patient | null>(null);

  const currentUser = authApi.getCurrentUser();
  const isAdmin = currentUser?.role === "ADMIN";

  // Debounce search input
  const handleSearchChange = (val: string) => {
    setSearch(val);
    setPage(1);
    const timeout = setTimeout(() => {
      setDebouncedSearch(val);
    }, 300);
    return () => clearTimeout(timeout);
  };

  const { patients, meta, totalPages, totalDocs, isLoading, mutate } = API.patients.useList({
    search: debouncedSearch,
    page,
    limit,
  });

  const handleDeletePatient = (patient: Patient) => {
    if (!isAdmin) {
      notifications.show({
        title: "Action refusée",
        message: "Seul un administrateur peut supprimer un patient.",
        color: "red",
      });
      return;
    }

    modals.openConfirmModal({
      title: "Confirmer la suppression du patient",
      centered: true,
      children: (
        <Text size="sm">
          Êtes-vous sûr de vouloir supprimer le dossier médical de{" "}
          <strong className="text-slate-900">{patient.fullName}</strong> (CIN: {patient.cin}) ?
          Cette action archivera le patient.
        </Text>
      ),
      labels: { confirm: "Supprimer", cancel: "Annuler" },
      confirmProps: { color: "red" },
      onConfirm: async () => {
        try {
          await API.patients.delete(patient.id);
          notifications.show({
            title: "Patient supprimé",
            message: `Le patient ${patient.fullName} a été supprimé.`,
            color: "teal",
          });
          mutate();
        } catch (err: any) {
          notifications.show({
            title: "Erreur",
            message: err.response?.data?.message || "Impossible de supprimer le patient.",
            color: "red",
          });
        }
      },
    });
  };

  const openCreateModal = () => {
    setPatientToEdit(null);
    setModalOpened(true);
  };

  const openEditModal = (patient: Patient) => {
    setPatientToEdit(patient);
    setModalOpened(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Title order={1} className="text-2xl font-bold text-slate-900 tracking-tight">
            Gestion des Patients
          </Title>
          <Text size="sm" c="dimmed">
            Consultez, recherchez et gérez les dossiers médicaux des patients
          </Text>
        </div>

        <Button
          leftSection={<IconUserPlus size={16} />}
          color="teal"
          size="sm"
          onClick={openCreateModal}
        >
          Nouveau Patient
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <Paper withBorder p="md" radius="lg" className="bg-white">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <TextInput
            placeholder="Rechercher par nom complet ou CIN..."
            leftSection={<IconSearch size={16} className="text-slate-400" />}
            value={search}
            onChange={(e) => handleSearchChange(e.currentTarget.value)}
            className="w-full sm:max-w-md"
            size="sm"
          />

          <Text size="xs" c="dimmed">
            Total : <strong className="text-slate-800">{meta?.total ?? 0}</strong> patients trouvés
          </Text>
        </div>
      </Paper>

      {/* Patients Table */}
      <Paper withBorder radius="lg" p="lg" className="bg-white">
        {isLoading ? (
          <div className="space-y-3 py-4">
            <Skeleton height={44} radius="md" />
            <Skeleton height={44} radius="md" />
            <Skeleton height={44} radius="md" />
            <Skeleton height={44} radius="md" />
          </div>
        ) : !patients.length ? (
          <div className="py-12 text-center text-slate-500">
            <IconUsers size={40} className="mx-auto text-slate-300 mb-2" />
            <Text size="sm" fw={500}>
              Aucun patient ne correspond à votre recherche.
            </Text>
            <Button
              variant="subtle"
              color="teal"
              size="xs"
              mt="sm"
              onClick={openCreateModal}
            >
              Ajouter un premier patient
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table verticalSpacing="sm" highlightOnHover>
              <Table.Thead className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider">
                <Table.Tr>
                  <Table.Th>Patient</Table.Th>
                  <Table.Th>CIN</Table.Th>
                  <Table.Th>Téléphone</Table.Th>
                  <Table.Th>Date de Naissance</Table.Th>
                  <Table.Th>RDV Associés</Table.Th>
                  <Table.Th className="text-right">Actions</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {patients.map((patient) => (
                  <Table.Tr key={patient.id} className="text-sm">
                    <Table.Td>
                      <button
                        onClick={() => router.push(`/patients/${patient.id}`)}
                        className="font-semibold text-slate-900 hover:text-teal-600 text-left block"
                      >
                        {patient.fullName}
                      </button>
                      <span className="text-xs text-slate-400">
                        Inscrit le {dayjs(patient.createdAt).format("DD/MM/YYYY")}
                      </span>
                    </Table.Td>

                    <Table.Td>
                      <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-semibold border border-slate-200">
                        {patient.cin}
                      </span>
                    </Table.Td>

                    <Table.Td className="text-slate-700 font-medium">
                      {patient.phone}
                    </Table.Td>

                    <Table.Td className="text-slate-600">
                      {dayjs(patient.birthDate).format("DD MMMM YYYY")}
                    </Table.Td>

                    <Table.Td>
                      <Badge variant="dot" color="teal" size="sm">
                        {patient._count?.appointments ?? 0} consultations
                      </Badge>
                    </Table.Td>

                    <Table.Td className="text-right">
                      <Group gap="xs" justify="flex-end">
                        <Button
                          variant="light"
                          color="teal"
                          size="xs"
                          leftSection={<IconEye size={14} />}
                          onClick={() => router.push(`/patients/${patient.id}`)}
                        >
                          Détails
                        </Button>

                        <Menu position="bottom-end" shadow="md">
                          <Menu.Target>
                            <ActionIcon variant="subtle" color="gray" size="sm">
                              <IconDotsVertical size={16} />
                            </ActionIcon>
                          </Menu.Target>
                          <Menu.Dropdown>
                            <Menu.Item
                              leftSection={<IconEdit size={14} />}
                              onClick={() => openEditModal(patient)}
                            >
                              Modifier le dossier
                            </Menu.Item>
                            <Menu.Item
                              leftSection={<IconCalendar size={14} />}
                              onClick={() => router.push(`/appointments?patientId=${patient.id}&action=create`)}
                            >
                              Prendre un rendez-vous
                            </Menu.Item>
                            {isAdmin && (
                              <Menu.Item
                                color="red"
                                leftSection={<IconTrash size={14} />}
                                onClick={() => handleDeletePatient(patient)}
                              >
                                Supprimer le patient (Admin)
                              </Menu.Item>
                            )}
                          </Menu.Dropdown>
                        </Menu>
                      </Group>
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
          itemLabel="patients"
        />
      </Paper>

      {/* Add / Edit Patient Modal */}
      <PatientFormModal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        patientToEdit={patientToEdit}
        onSuccess={() => mutate()}
      />
    </div>
  );
}

export default PatientsListTemplate;
