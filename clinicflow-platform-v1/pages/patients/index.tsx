import Head from "next/head";
import MainPlatformLayout from "@/layouts/MainPlatformLayout";
import PatientsListTemplate from "@/modules/patient/templates/PatientsListTemplate";

export default function PatientsPage() {
  return (
    <MainPlatformLayout>
      <Head>
        <title>Gestion des Patients — ClinicFlow</title>
      </Head>
      <PatientsListTemplate />
    </MainPlatformLayout>
  );
}
