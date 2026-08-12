import React from "react";
import { Stethoscope, Building2, Phone, Mail, UserPlus } from "lucide-react";
import { DoctorItem } from "@/api/hooks/useDoctors";
import { Button } from "@/components/ui/button";

interface DoctorHeaderCardProps {
  doctor: DoctorItem;
  onAddPatientClick: () => void;
}

export default function DoctorHeaderCard({
  doctor,
  onAddPatientClick,
}: DoctorHeaderCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div className="space-y-2">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#038AF9] text-white font-bold">
            <Stethoscope className="h-5 w-5 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">{doctor.name}</h1>
            <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-[#038AF9]">
              {doctor.specialization}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-1">
          <div className="flex items-center gap-1.5">
            <Building2 className="h-3.5 w-3.5 text-slate-400" />
            <span>{doctor.hospital}</span>
          </div>
          <div className="flex items-center gap-1.5 font-mono">
            <Phone className="h-3.5 w-3.5 text-slate-400" />
            <span>{doctor.phone}</span>
          </div>
          <div className="flex items-center gap-1.5 font-mono">
            <Mail className="h-3.5 w-3.5 text-slate-400" />
            <span>{doctor.email}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <div className="text-right hidden md:block">
          <div className="text-2xl font-extrabold text-slate-900">
            {doctor.patientCount || 0}
          </div>
          <div className="text-xs text-slate-500 font-medium">Assigned Patients</div>
        </div>

        <Button
          onClick={onAddPatientClick}
          className="bg-[#038AF9] hover:bg-[#0277dc] text-white gap-2 cursor-pointer shadow-sm"
        >
          <UserPlus className="h-4 w-4" />
          <span>Add Patient</span>
        </Button>
      </div>
    </div>
  );
}
