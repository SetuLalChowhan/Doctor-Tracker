import React from "react";
import { Stethoscope, Users, UserCheck, Activity } from "lucide-react";

interface MetricCardsProps {
  totalDoctors: number;
  totalPatients: number;
  avgPatientsPerDoctor: string;
  conditionCount: number;
}

export default function MetricCards({
  totalDoctors,
  totalPatients,
  avgPatientsPerDoctor,
  conditionCount,
}: MetricCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Total Doctors */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wide text-slate-700">
            Active Doctors
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-50 text-sky-700">
            <Stethoscope className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-2.5 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-slate-900">{totalDoctors}</span>
          <span className="text-xs font-semibold text-slate-600">physicians</span>
        </div>
      </div>

      {/* Total Patients */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wide text-slate-700">
            Total Patients
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
            <Users className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-2.5 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-slate-900">{totalPatients}</span>
          <span className="text-xs font-semibold text-slate-600">enrolled</span>
        </div>
      </div>

      {/* Patients Per Doctor Ratio */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wide text-slate-700">
            Patient / Doctor Load
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700">
            <UserCheck className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-2.5 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-slate-900">{avgPatientsPerDoctor}</span>
          <span className="text-xs font-semibold text-slate-600">ratio</span>
        </div>
      </div>

      {/* Condition Categories */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wide text-slate-700">
            Diagnosed Conditions
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-purple-700">
            <Activity className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-2.5 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-slate-900">{conditionCount}</span>
          <span className="text-xs font-semibold text-slate-600">categories</span>
        </div>
      </div>
    </div>
  );
}


