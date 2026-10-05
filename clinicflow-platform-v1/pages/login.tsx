import Head from "next/head";
import { LoginTemplate } from "@/modules/auth/templates/LoginTemplate";

export default function LoginPage() {
  return (
    <>
      <Head>
        <title>Connexion — ClinicFlow</title>
      </Head>
      <LoginTemplate />
    </>
  );
}
