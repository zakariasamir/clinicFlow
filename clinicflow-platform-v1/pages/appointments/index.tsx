import Head from "next/head";
import MainPlatformLayout from "@/layouts/MainPlatformLayout";
import AppointmentsScheduleTemplate from "@/modules/appointment/templates/AppointmentsScheduleTemplate";

export default function AppointmentsPage() {
  return (
    <MainPlatformLayout>
      <Head>
        <title>Planning des Rendez-vous — ClinicFlow</title>
      </Head>
      <AppointmentsScheduleTemplate />
    </MainPlatformLayout>
  );
}
