import React from "react";
import { Search, Filter } from "lucide-react";

interface DoctorFiltersProps {
  search: string;
  setSearch: (value: string) => void;
  specialization: string;
  setSpecialization: (value: string) => void;
  hospital: string;
  setHospital: (value: string) => void;
}

export default function DoctorFilters({
  search,
  setSearch,
  specialization,
  setSpecialization,
  hospital,
  setHospital,
}: DoctorFiltersProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col md:flex-row items-center gap-3">
      <div className="relative flex-1 w-full">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search doctors by name, specialization, or hospital..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-[#038AF9] focus:bg-white focus:outline-none transition-colors"
        />
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold shrink-0">
          <Filter className="h-3.5 w-3.5" /> Filters:
        </div>

        <input
          type="text"
          placeholder="Filter Specialization"
          value={specialization}
          onChange={(e) => setSpecialization(e.target.value)}
          className="w-full md:w-44 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-[#038AF9] focus:bg-white focus:outline-none"
        />

        <input
          type="text"
          placeholder="Filter Hospital"
          value={hospital}
          onChange={(e) => setHospital(e.target.value)}
          className="w-full md:w-44 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-[#038AF9] focus:bg-white focus:outline-none"
        />
      </div>
    </div>
  );
}
