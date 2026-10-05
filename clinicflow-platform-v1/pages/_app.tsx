import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { MantineProvider, createTheme } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import { useEffect } from "react";

const theme = createTheme({
  primaryColor: "teal",
  fontFamily: "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif",
  defaultRadius: "md",
});

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Fetch runtime server-side API URL config so dynamic Render host changes take effect immediately
    fetch("/api/config")
      .then((res) => res.json())
      .then((data) => {
        if (data?.apiUrl) {
          localStorage.setItem("clinicflow_api_url", data.apiUrl);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <MantineProvider theme={theme} defaultColorScheme="light">
      <Head>
        <title>ClinicFlow — Gestion Patients & Rendez-vous</title>
        <meta
          name="description"
          content="Plateforme moderne de gestion clinique, dossiers patients et planification de rendez-vous médicaux"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ModalsProvider>
        <Notifications position="top-right" zIndex={1000} />
        <Component {...pageProps} />
      </ModalsProvider>
    </MantineProvider>
  );
}
