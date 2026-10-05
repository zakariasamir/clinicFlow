import React, { useState, useEffect } from "react";
import {
  Modal,
  TextInput,
  Textarea,
  Button,
  Group,
  Alert,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconAlertCircle, IconCheck } from "@tabler/icons-react";
import API from "@/router";
import { Patient } from "@/router/types";

export interface PatientFormModalProps {
  opened: boolean;
  onClose: () => void;
  patientToEdit?: Patient | null;
  onSuccess: () => void;
}

export function PatientFormModal({
  opened,
  onClose,
  patientToEdit,
  onSuccess,
}: PatientFormModalProps) {
  const [fullName, setFullName] = useState("");
  const [cin, setCin] = useState("");
  const [phone, setPhone] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (patientToEdit) {
      setFullName(patientToEdit.fullName);
      setCin(patientToEdit.cin);
      setPhone(patientToEdit.phone);
      setBirthDate(
        patientToEdit.birthDate
          ? new Date(patientToEdit.birthDate).toISOString().split("T")[0]
          : ""
      );
      setAddress(patientToEdit.address || "");
    } else {
      setFullName("");
      setCin("");
      setPhone("");
      setBirthDate("");
      setAddress("");
    }
    setErrorMsg(null);
  }, [patientToEdit, opened]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !cin || !phone || !birthDate) {
      setErrorMsg("Veuillez remplir tous les champs obligatoires (*)");
      return;
    }

    try {
      setLoading(true);
      setErrorMsg(null);

      if (patientToEdit) {
        await API.patients.update(patientToEdit.id, {
          fullName,
          cin: cin.toUpperCase().trim(),
          phone,
          birthDate,
          address: address || null,
        });

        notifications.show({
          title: "Patient mis à jour",
          message: `Le dossier de ${fullName} a été modifié avec succès.`,
          color: "teal",
          icon: <IconCheck size={16} />,
        });
      } else {
        await API.patients.create({
          fullName,
          cin: cin.toUpperCase().trim(),
          phone,
          birthDate,
          address: address || null,
        });

        notifications.show({
          title: "Patient enregistré",
          message: `Le patient ${fullName} (CIN: ${cin.toUpperCase()}) a été ajouté.`,
          color: "teal",
          icon: <IconCheck size={16} />,
        });
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        "Une erreur est survenue lors de l'enregistrement du patient.";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <span className="font-bold text-slate-900 text-base">
          {patientToEdit ? "Modifier le Dossier Patient" : "Créer un Nouveau Patient"}
        </span>
      }
      radius="lg"
      size="md"
    >
      {errorMsg && (
        <Alert
          icon={<IconAlertCircle size={16} />}
          title="Attention"
          color="red"
          mb="md"
          radius="md"
        >
          {errorMsg}
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <TextInput
          label="Nom complet *"
          placeholder="ex: Amine Bennani"
          required
          value={fullName}
          onChange={(e) => setFullName(e.currentTarget.value)}
        />

        <div className="grid grid-cols-2 gap-3">
          <TextInput
            label="CIN (Unique) *"
            placeholder="ex: AB102938"
            required
            value={cin}
            onChange={(e) => setCin(e.currentTarget.value.toUpperCase())}
          />

          <TextInput
            label="Téléphone *"
            placeholder="ex: +212 661-234567"
            required
            value={phone}
            onChange={(e) => setPhone(e.currentTarget.value)}
          />
        </div>

        <TextInput
          label="Date de naissance *"
          type="date"
          required
          value={birthDate}
          onChange={(e) => setBirthDate(e.currentTarget.value)}
        />

        <Textarea
          label="Adresse (Optionnelle)"
          placeholder="ex: 14 Boulevard Zerktouni, Casablanca"
          rows={2}
          value={address}
          onChange={(e) => setAddress(e.currentTarget.value)}
        />

        <Group justify="flex-end" mt="lg">
          <Button variant="default" onClick={onClose} disabled={loading}>
            Annuler
          </Button>
          <Button type="submit" color="teal" loading={loading}>
            {patientToEdit ? "Enregistrer les modifications" : "Créer le patient"}
          </Button>
        </Group>
      </form>
    </Modal>
  );
}

export default PatientFormModal;
