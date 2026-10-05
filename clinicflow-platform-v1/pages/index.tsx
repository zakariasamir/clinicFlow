import Head from "next/head";
import MainPlatformLayout from "@/layouts/MainPlatformLayout";
import DashboardTemplate from "@/modules/dashboard/templates/DashboardTemplate";

export default function DashboardPage() {
  return (
    <MainPlatformLayout>
      <Head>
        <title>Tableau de Bord — ClinicFlow</title>
      </Head>
      <DashboardTemplate />
    </MainPlatformLayout>
  );
}
