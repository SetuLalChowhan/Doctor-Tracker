"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, X, Activity, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import useAuth from "@/api/hooks/useAuth";

export interface SubLink {
  id: number;
  path: string;
  text: string;
}

export interface SidebarItem {
  id: number;
  text: string;
  path?: string;
  activePaths?: string[] | string;
  icon?: React.ReactNode;
  sublink?: SubLink[];
}

interface SideBarProps {
  sidebar: SidebarItem[];
  open: boolean;
  setOpen: (open: boolean) => void;
}

const SideBar: React.FC<SideBarProps> = ({ sidebar, open, setOpen }) => {
  const pathname = usePathname();
  const [openGroups, setOpenGroups] = useState<Record<number, boolean>>({});
  const { logout, isLoggingOut } = useAuth();

  useEffect(() => {
    sidebar.forEach((item) => {
      if (item.sublink?.some((sub) => pathname === sub.path)) {
        setOpenGroups((prev) => ({ ...prev, [item.id]: true }));
      }
    });
  }, [pathname, sidebar]);

  const isActive = (paths?: string[] | string) => {
    if (!paths) return false;
    const pathArray = Array.isArray(paths) ? paths : [paths];
    return pathArray.some((path) => pathname === path || pathname.startsWith(path + "/"));
  };

  const toggleGroup = (id: number) => {
    setOpenGroups((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 xl:hidden",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setOpen(false)}
      />

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-slate-900 text-slate-100 transition-transform duration-300 ease-in-out xl:static xl:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between px-5 border-b border-slate-800">
          <Link
            href="/dashboard"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 font-bold text-lg text-white tracking-tight"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-600 text-white">
              <Activity className="h-4 w-4" />
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="font-bold text-sm leading-none text-white">Doctor Tracker</span>
              <span className="text-[10px] font-medium text-slate-400 leading-none">
                Clinical Administration
              </span>
            </div>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 xl:hidden text-slate-400 hover:text-white"
            onClick={() => setOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-6">
          <nav className="space-y-1.5">
            {sidebar.map((item) => {
              const hasSublinks = item.sublink && item.sublink.length > 0;
              const isGroupOpen = !!openGroups[item.id];
              const active =
                isActive(item.activePaths || item.path) ||
                (hasSublinks && item.sublink!.some((sub) => pathname === sub.path));

              if (hasSublinks) {
                return (
                  <div key={item.id} className="space-y-1">
                    <button
                      onClick={() => toggleGroup(item.id)}
                      className={cn(
                        "w-full flex items-center justify-between rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors cursor-pointer text-left",
                        active
                          ? "bg-[#038AF9]/15 text-[#038AF9] font-semibold"
                          : "text-slate-300 hover:bg-slate-800 hover:text-white"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        {item.icon && (
                          <span className={cn("shrink-0", active ? "text-[#038AF9]" : "text-slate-400")}>
                            {item.icon}
                          </span>
                        )}
                        <span>{item.text}</span>
                      </div>
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 shrink-0 transition-transform duration-200 text-slate-400",
                          isGroupOpen && "rotate-180"
                        )}
                      />
                    </button>

                    <div
                      className={cn(
                        "overflow-hidden transition-all duration-200 pl-9 pr-2 space-y-1",
                        isGroupOpen ? "max-h-40 opacity-100 py-1" : "max-h-0 opacity-0 py-0"
                      )}
                    >
                      {item.sublink!.map((sub) => {
                        const subActive = pathname === sub.path;
                        return (
                          <Link
                            key={sub.id}
                            href={sub.path}
                            onClick={() => setOpen(false)}
                            className={cn(
                              "block rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                              subActive
                                ? "bg-[#038AF9] text-white font-bold"
                                : "text-slate-400 hover:bg-slate-800 hover:text-white"
                            )}
                          >
                            {sub.text}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                );
              }

              return (
                <div key={item.id}>
                  <Link
                    href={item.path || "/"}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors",
                      active
                        ? "bg-[#038AF9] text-white shadow-sm font-semibold"
                        : "text-slate-300 hover:bg-slate-800 hover:text-white"
                    )}
                  >
                    {item.icon && (
                      <span className={cn("shrink-0", active ? "text-white" : "text-slate-400")}>
                        {item.icon}
                      </span>
                    )}
                    <span>{item.text}</span>
                  </Link>
                </div>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800 mt-auto">
          <Button
            variant="ghost"
            disabled={isLoggingOut}
            className="w-full justify-start gap-3 text-slate-400 hover:text-red-400 hover:bg-red-500/10 cursor-pointer"
            onClick={() => logout()}
          >
            <LogOut className="h-4 w-4" />
            <span>{isLoggingOut ? "Logging out..." : "Log Out"}</span>
          </Button>
        </div>
      </aside>
    </>
  );
};

export default SideBar;