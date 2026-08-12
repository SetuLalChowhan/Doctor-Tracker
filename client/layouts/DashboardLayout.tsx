"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import DashNavbar from "@/components/dashboard/common/DashNavbar";
import SideBar, { type SidebarItem } from "@/components/dashboard/common/SideBar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { LayoutDashboard, Stethoscope, Users } from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  const sideBarItems: SidebarItem[] = [
    {
      id: 1,
      icon: <LayoutDashboard className="h-5 w-5" />,
      text: "Dashboard",
      path: "/dashboard",
      activePaths: ["/dashboard"],
    },
    {
      id: 2,
      icon: <Stethoscope className="h-5 w-5" />,
      text: "Doctors",
      path: "/doctors",
      activePaths: ["/doctors"],
    },
    {
      id: 3,
      icon: <Users className="h-5 w-5" />,
      text: "Patients",
      path: "/patients",
      activePaths: ["/patients"],
    },
  ];

  return (
    <ProtectedRoute>
      <div className="flex h-screen min-h-screen w-full bg-slate-50 text-slate-900 overflow-hidden">
        <SideBar open={open} setOpen={setOpen} sidebar={sideBarItems} />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <DashNavbar open={open} setOpen={setOpen} />
          <main className="flex-1 overflow-y-auto py-6 section-padding-x bg-slate-50">
            <div className="w-full space-y-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default DashboardLayout;