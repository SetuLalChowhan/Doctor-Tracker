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
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Total Doctors
          </span>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#038AF9]/10 text-[#038AF9]">
            <Stethoscope className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-slate-900">{totalDoctors}</span>
          <span className="text-xs font-medium text-slate-500">active doctors</span>
        </div>
      </div>

      {/* Total Patients */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Total Patients
          </span>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
            <Users className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-slate-900">{totalPatients}</span>
          <span className="text-xs font-medium text-slate-500">registered patients</span>
        </div>
      </div>

      {/* Patients Per Doctor Ratio */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Avg Patients / Doctor
          </span>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
            <UserCheck className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-slate-900">
            {avgPatientsPerDoctor}
          </span>
          <span className="text-xs font-medium text-slate-500">ratio</span>
        </div>
      </div>

      {/* Condition Categories */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Tracked Conditions
          </span>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
            <Activity className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-slate-900">{conditionCount}</span>
          <span className="text-xs font-medium text-slate-500">categories</span>
        </div>
      </div>
    </div>
  );
}
