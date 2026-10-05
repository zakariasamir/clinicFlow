import React, { useState, useEffect } from "react";
import {
  Drawer,
  Select,
  TextInput,
  Textarea,
  Button,
  Group,
  Alert,
  Text,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconAlertCircle, IconCheck, IconCalendar } from "@tabler/icons-react";
import API from "@/router";
import { AppointmentStatus } from "@/router/types";
import dayjs from "dayjs";

export interface AppointmentBookingDrawerProps {
  opened: boolean;
  onClose: () => void;
  initialPatientId?: string;
  onSuccess: () => void;
}

export function AppointmentBookingDrawer({
  opened,
  onClose,
  initialPatientId,
  onSuccess,
}: AppointmentBookingDrawerProps) {
  const [patientId, setPatientId] = useState<string | null>(initialPatientId || null);
  const [date, setDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [time, setTime] = useState("10:00");
  const [status, setStatus] = useState<AppointmentStatus>("PENDING");
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Fetch list of patients for selection dropdown
  const { patients } = API.patients.useList({ limit: 100 });

  useEffect(() => {
    if (initialPatientId) {
      setPatientId(initialPatientId);
    }
    setErrorMsg(null);
  }, [initialPatientId, opened]);

  const patientSelectData = patients.map((p) => ({
    value: p.id,
    label: `${p.fullName} (CIN: ${p.cin})`,
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId || !date || !time || !reason) {
      setErrorMsg("Veuillez sélectionner un patient, une date, une heure et un motif.");
      return;
    }

    try {
      setLoading(true);
      setErrorMsg(null);

      const combinedIso = new Date(`${date}T${time}:00`).toISOString();

      await API.appointments.create({
        patientId,
        appointmentDate: combinedIso,
        status,
        reason,
        notes: notes || null,
      });

      notifications.show({
        title: "Rendez-vous planifié",
        message: `Le rendez-vous a été enregistré pour le ${dayjs(combinedIso).format("DD/MM/YYYY à HH:mm")}.`,
        color: "teal",
        icon: <IconCheck size={16} />,
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        "Une erreur est survenue lors de la planification du rendez-vous.";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      position="right"
      size="md"
      title={
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-teal-100 text-teal-700 flex items-center justify-center">
            <IconCalendar size={18} />
          </div>
          <span className="font-bold text-slate-900 text-base">Planifier un Rendez-vous</span>
        </div>
      }
    >
      {errorMsg && (
        <Alert
          icon={<IconAlertCircle size={16} />}
          title="Attention (Règle Métier)"
          color="red"
          mb="md"
          radius="md"
        >
          {errorMsg}
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          label="Sélectionner le Patient *"
          placeholder="Rechercher par nom ou CIN..."
          data={patientSelectData}
          value={patientId}
          onChange={setPatientId}
          searchable
          required
          nothingFoundMessage="Aucun patient trouvé"
        />

        <div className="grid grid-cols-2 gap-3">
          <TextInput
            label="Date *"
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.currentTarget.value)}
          />

          <TextInput
            label="Heure *"
            type="time"
            required
            value={time}
            onChange={(e) => setTime(e.currentTarget.value)}
          />
        </div>

        <Select
          label="Statut Initial"
          data={[
            { value: "PENDING", label: "En attente (Pending)" },
            { value: "CONFIRMED", label: "Confirmé (Confirmed)" },
            { value: "CANCELLED", label: "Annulé (Cancelled)" },
          ]}
          value={status}
          onChange={(val) => setStatus(val as AppointmentStatus)}
          required
        />

        {status === "CONFIRMED" && (
          <Text size="xs" c="dimmed" className="italic bg-amber-50 p-2 rounded border border-amber-200 text-amber-800">
            ℹ️ Règle clinique : Le système rejettera automatiquement la confirmation si ce patient a déjà un autre rendez-vous confirmé dans un intervalle de 30 minutes.
          </Text>
        )}

        <TextInput
          label="Motif de consultation *"
          placeholder="ex: Suivi tension artérielle, Contrôle bilan..."
          required
          value={reason}
          onChange={(e) => setReason(e.currentTarget.value)}
        />

        <Textarea
          label="Notes cliniques complémentaires"
          placeholder="ex: Patient à jeun, ramener radios..."
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.currentTarget.value)}
        />

        <Group justify="flex-end" mt="xl">
          <Button variant="default" onClick={onClose} disabled={loading}>
            Annuler
          </Button>
          <Button type="submit" color="teal" loading={loading}>
            Confirmer la planification
          </Button>
        </Group>
      </form>
    </Drawer>
  );
}

export default AppointmentBookingDrawer;
