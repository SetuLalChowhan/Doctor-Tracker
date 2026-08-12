import React from "react";
import { Stethoscope, Building2, Phone, Mail, UserPlus, CheckCircle2, Users } from "lucide-react";
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
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs flex flex-col xl:flex-row xl:items-center justify-between gap-6">
      {/* Doctor Info Section */}
      <div className="space-y-3 flex-1">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-600 text-white shrink-0">
            <Stethoscope className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                {doctor.name}
              </h1>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                <CheckCircle2 className="h-3 w-3" /> Active Physician
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="inline-flex items-center rounded bg-sky-50 px-2.5 py-0.5 text-xs font-semibold text-sky-700 border border-sky-200">
                {doctor.specialization}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-y-2 gap-x-5 text-xs text-slate-700 font-medium pt-2 border-t border-slate-100">
          <div className="flex items-center gap-1.5 font-semibold">
            <Building2 className="h-3.5 w-3.5 text-slate-400" />
            <span>{doctor.hospital}</span>
          </div>
          <div className="flex items-center gap-1.5 font-mono text-slate-700 font-medium">
            <Phone className="h-3.5 w-3.5 text-slate-400" />
            <span>{doctor.phone}</span>
          </div>
          <div className="flex items-center gap-1.5 font-mono text-slate-700 font-medium">
            <Mail className="h-3.5 w-3.5 text-slate-400" />
            <span>{doctor.email}</span>
          </div>
        </div>
      </div>

      {/* Action & Stats Container */}
      <div className="flex items-center gap-4 shrink-0 pt-3 xl:pt-0 border-t xl:border-t-0 border-slate-100 justify-between xl:justify-end">
        {/* Assigned Patients Stat Box */}
        <div className="flex items-center gap-3 rounded-xl bg-slate-50/80 border border-slate-200 px-4 py-2.5 shadow-2xs">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-100/80 text-sky-700 font-semibold shrink-0">
            <Users className="h-4.5 w-4.5" />
          </div>
          <div className="flex flex-col justify-center">
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold text-slate-900 leading-none">
                {doctor.patientCount || 0}
              </span>
              <span className="text-xs font-bold text-slate-700">
                {doctor.patientCount === 1 ? "Patient" : "Patients"}
              </span>
            </div>
            <span className="text-[11px] text-slate-500 font-medium tracking-tight">
              Enrolled Roster
            </span>
          </div>
        </div>

        {/* Primary CTA Button */}
        <Button
          onClick={onAddPatientClick}
          className="h-10 bg-sky-600 hover:bg-sky-700 text-white font-semibold shadow-xs gap-2 cursor-pointer rounded-lg px-4"
        >
          <UserPlus className="h-4 w-4" />
          <span>Enroll Patient</span>
        </Button>
      </div>
    </div>
  );
}

