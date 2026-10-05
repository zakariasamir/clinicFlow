import React, { useEffect, useState } from "react";
import Link from "next/router";
import { useRouter } from "next/router";
import {
  IconStethoscope,
  IconLayoutDashboard,
  IconUsers,
  IconCalendar,
  IconLogout,
  IconShieldCheck,
  IconUser,
} from "@tabler/icons-react";
import authApi from "@/router/auth";
import { User } from "@/router/types";
import { MainAuthWrapper } from "./MainAuthWrapper";

export interface MainPlatformLayoutProps {
  children: React.ReactNode;
}

export function MainPlatformLayout({ children }: MainPlatformLayoutProps) {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const user = authApi.getCurrentUser();
    setCurrentUser(user);
  }, []);

  const handleLogout = () => {
    authApi.logout();
  };

  const navLinks = [
    {
      label: "Tableau de bord",
      href: "/",
      icon: <IconLayoutDashboard size={18} stroke={1.8} />,
      isActive: router.pathname === "/" || router.pathname === "/dashboard",
    },
    {
      label: "Patients",
      href: "/patients",
      icon: <IconUsers size={18} stroke={1.8} />,
      isActive: router.pathname.startsWith("/patients"),
    },
    {
      label: "Rendez-vous",
      href: "/appointments",
      icon: <IconCalendar size={18} stroke={1.8} />,
      isActive: router.pathname.startsWith("/appointments"),
    },
  ];

  return (
    <MainAuthWrapper>
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
        {/* Top Clinical Header */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Brand Logo & Clinical Title */}
              <div className="flex items-center gap-8">
                <button
                  onClick={() => router.push("/")}
                  className="flex items-center gap-2.5 focus:outline-hidden"
                >
                  <div className="w-9 h-9 rounded-lg bg-teal-600 flex items-center justify-center text-white shadow-xs">
                    <IconStethoscope size={22} stroke={2.2} />
                  </div>
                  <div className="text-left">
                    <span className="text-lg font-bold tracking-tight text-slate-900 block leading-tight">
                      Clinic<span className="text-teal-600">Flow</span>
                    </span>
                    <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-600 block">
                      Gestion Clinique
                    </span>
                  </div>
                </button>

                {/* Primary Navigation Tabs */}
                <nav className="hidden md:flex items-center gap-1">
                  {navLinks.map((item) => (
                    <button
                      key={item.href}
                      onClick={() => router.push(item.href)}
                      className={`flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-md transition-colors ${
                        item.isActive
                          ? "bg-teal-50 text-teal-700 font-semibold"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                      }`}
                    >
                      {item.icon}
                      {item.label}
                    </button>
                  ))}
                </nav>
              </div>

              {/* User Profile & Logout */}
              <div className="flex items-center gap-4">
                {currentUser && (
                  <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 bg-slate-100/80 rounded-full border border-slate-200 text-xs text-slate-700">
                    <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold">
                      <IconUser size={14} />
                    </div>
                    <span className="font-semibold text-slate-800">{currentUser.fullName}</span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        currentUser.role === "ADMIN"
                          ? "bg-indigo-100 text-indigo-700 border border-indigo-200"
                          : "bg-teal-100 text-teal-700 border border-teal-200"
                      }`}
                    >
                      {currentUser.role}
                    </span>
                  </div>
                )}

                <button
                  onClick={handleLogout}
                  title="Déconnexion"
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors border border-slate-200"
                >
                  <IconLogout size={16} />
                  <span className="hidden sm:inline">Quitter</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>

        {/* Clinical Operations Footer */}
        <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-600">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>ClinicFlow © 2026 — Système de Gestion de Cabinet Médical</span>
            <span className="text-slate-600 font-medium">Architecture Modulaire & PERN</span>
          </div>
        </footer>
      </div>
    </MainAuthWrapper>
  );
}

export default MainPlatformLayout;
