"use client";

import React from "react";
import { Menu, LogOut, User } from "lucide-react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useAuth from "@/api/hooks/useAuth";

interface DashNavbarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const DashNavbar: React.FC<DashNavbarProps> = ({ open, setOpen }) => {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const getPageTitle = () => {
    if (pathname === "/dashboard") return "Dashboard";
    if (pathname.startsWith("/doctors")) return "Doctors";
    if (pathname.startsWith("/patients")) return "Patients";
    const segment = pathname.split("/").pop() || "";
    return segment.charAt(0).toUpperCase() + segment.slice(1).replace("-", " ");
  };

  const getInitials = (name?: string) => {
    if (!name) return "A";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <header className="flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white section-padding-x shrink-0">
      <div className="flex items-center gap-4 min-w-0">
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 shrink-0 xl:hidden text-slate-600 hover:text-slate-900 cursor-pointer"
          onClick={() => setOpen(!open)}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Sidebar</span>
        </Button>
        <h1 className="text-xl font-bold text-slate-900 truncate tracking-tight">
          {getPageTitle()}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative flex items-center gap-2.5 h-10 rounded-full p-1 hover:bg-slate-100 cursor-pointer"
            >
              <Avatar className="h-9 w-9 rounded-full border border-slate-200 shadow-sm">
                <AvatarFallback className="bg-[#038AF9] text-white text-xs font-bold rounded-full">
                  {getInitials(user?.name)}
                </AvatarFallback>
              </Avatar>
              <div className="hidden sm:flex flex-col items-start text-left">
                <span className="text-xs font-bold text-slate-900 leading-tight">
                  {user?.name || "System Admin"}
                </span>
                <span className="text-[11px] text-slate-500 leading-tight">
                  {user?.email || "admin@doctortracker.com"}
                </span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 p-1 bg-white border border-slate-200 shadow-lg rounded-xl">
            <DropdownMenuLabel className="p-3 flex flex-col gap-0.5">
              <span className="font-bold text-sm text-slate-900 leading-none">
                {user?.name || "System Admin"}
              </span>
              <span className="text-xs text-slate-500 leading-none truncate">
                {user?.email || "admin@doctortracker.com"}
              </span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => logout()}
              className="flex items-center gap-2 p-2.5 text-red-600 focus:text-red-700 focus:bg-red-50 cursor-pointer rounded-lg font-medium text-xs"
            >
              <LogOut className="h-4 w-4" />
              <span>Log Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default DashNavbar;