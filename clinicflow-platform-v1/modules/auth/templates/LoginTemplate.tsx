import React, { useState } from "react";
import { useRouter } from "next/router";
import {
  TextInput,
  PasswordInput,
  Button,
  Paper,
  Title,
  Text,
  Alert,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  IconStethoscope,
  IconAlertCircle,
  IconCheck,
  IconLock,
  IconMail,
} from "@tabler/icons-react";
import authApi from "@/router/auth";

export function LoginTemplate() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage("Veuillez renseigner votre email et mot de passe");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await authApi.login({ email, password });

      notifications.show({
        title: "Connexion réussie",
        message: `Bienvenue, ${res.user.fullName}`,
        color: "teal",
        icon: <IconCheck size={16} />,
      });

      router.push("/");
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        "Échec de la connexion. Vérifiez vos identifiants.";
      setErrorMessage(msg);
      notifications.show({
        title: "Erreur d'authentification",
        message: msg,
        color: "red",
        icon: <IconAlertCircle size={16} />,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-teal-600 text-white shadow-md mb-4">
          <IconStethoscope size={32} stroke={2.2} />
        </div>
        <Title order={2} className="text-2xl font-bold tracking-tight text-slate-900">
          Clinic<span className="text-teal-600">Flow</span>
        </Title>
        <Text c="dimmed" size="sm" className="mt-1">
          Portail Médical Sécurisé — Gestion Patients & Rendez-vous
        </Text>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <Paper withBorder shadow="sm" p="xl" radius="lg" className="bg-white">
          {errorMessage && (
            <Alert
              icon={<IconAlertCircle size={16} />}
              title="Erreur"
              color="red"
              radius="md"
              mb="md"
            >
              {errorMessage}
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <TextInput
              label="Adresse Email"
              placeholder="admin@clinicflow.local"
              required
              leftSection={<IconMail size={16} className="text-slate-400" />}
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
              disabled={loading}
            />

            <PasswordInput
              label="Mot de passe"
              placeholder="••••••••"
              required
              leftSection={<IconLock size={16} className="text-slate-400" />}
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
              disabled={loading}
            />

            <Button
              type="submit"
              fullWidth
              color="teal"
              size="md"
              loading={loading}
              className="mt-4"
            >
              Se connecter
            </Button>
          </form>

          {/* Test Evaluation Quick-Credentials */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <Text size="xs" fw={600} c="dimmed" className="uppercase tracking-wider mb-2 text-center">
              Comptes de test (Évaluation Tython)
            </Text>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleFillDemo("admin@clinicflow.local", "Admin@123456")}
                className="text-left p-2.5 rounded-lg border border-slate-200 hover:border-teal-500 hover:bg-teal-50/50 transition-colors"
              >
                <div className="text-xs font-semibold text-slate-800">Admin (Directeur)</div>
                <div className="text-[11px] text-slate-500 font-mono">admin@clinicflow.local</div>
              </button>

              <button
                type="button"
                onClick={() => handleFillDemo("dr.yasmine@clinicflow.local", "Staff@123456")}
                className="text-left p-2.5 rounded-lg border border-slate-200 hover:border-teal-500 hover:bg-teal-50/50 transition-colors"
              >
                <div className="text-xs font-semibold text-slate-800">Staff (Médecin)</div>
                <div className="text-[11px] text-slate-500 font-mono">dr.yasmine@clinicflow.local</div>
              </button>
            </div>
          </div>
        </Paper>
      </div>
    </div>
  );
}

export default LoginTemplate;
