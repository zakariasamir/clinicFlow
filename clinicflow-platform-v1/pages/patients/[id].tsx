import Head from "next/head";
import { useRouter } from "next/router";
import MainPlatformLayout from "@/layouts/MainPlatformLayout";
import PatientDetailTemplate from "@/modules/patient/templates/PatientDetailTemplate";

export default function PatientDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  return (
    <MainPlatformLayout>
      <Head>
        <title>Dossier Patient — ClinicFlow</title>
      </Head>
      {id ? <PatientDetailTemplate patientId={id as string} /> : null}
    </MainPlatformLayout>
  );
}
