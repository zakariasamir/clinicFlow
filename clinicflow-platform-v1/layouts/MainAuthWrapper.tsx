import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Loader } from "@mantine/core";

export interface MainAuthWrapperProps {
  children: React.ReactNode;
}

export function MainAuthWrapper({ children }: MainAuthWrapperProps) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // If on public login route, skip check
    if (router.pathname === "/login") {
      setIsAuthenticated(true);
      return;
    }

    const token = localStorage.getItem("clinicflow_token");
    if (!token) {
      router.replace("/login");
    } else {
      setIsAuthenticated(true);
    }
  }, [router, router.pathname]);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="flex items-center gap-3 text-teal-700">
          <Loader size="md" color="teal" />
          <span className="text-sm font-medium text-slate-600">Chargement de la session clinique...</span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export default MainAuthWrapper;
