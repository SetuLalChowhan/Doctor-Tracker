import React, { useState, useEffect } from "react";
import { Search, Filter, RotateCcw } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

import { useDoctorOptions } from "@/api/hooks/useDoctors";

interface DoctorFiltersProps {
  search: string;
  setSearch: (value: string) => void;
  specialization: string;
  setSpecialization: (value: string) => void;
  hospital: string;
  setHospital: (value: string) => void;
}

const DEFAULT_SPECIALIZATIONS = [
  "Cardiology",
  "Neurology",
  "Pediatrics",
  "Orthopedics",
  "General Medicine",
  "Dermatology",
  "Oncology",
  "Psychiatry",
];

const DEFAULT_HOSPITALS = [
  "Metro Health Hospital",
  "St. Jude Medical Center",
  "City Children's Hospital",
  "General Memorial Hospital",
];

export default function DoctorFilters({
  search,
  setSearch,
  specialization,
  setSpecialization,
  hospital,
  setHospital,
}: DoctorFiltersProps) {
  const { data: metaOptions } = useDoctorOptions();

  // Local state for instant typing + 300ms debounced parent update
  const [localSearch, setLocalSearch] = useState(search);

  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (localSearch !== search) {
        setSearch(localSearch);
      }
    }, 300);
    return () => clearTimeout(handler);
  }, [localSearch, search, setSearch]);

  const specializations =
    metaOptions?.specializations || DEFAULT_SPECIALIZATIONS;
  const hospitals = metaOptions?.hospitals || DEFAULT_HOSPITALS;

  const hasActiveFilters = search || specialization || hospital || localSearch;

  const handleResetFilters = () => {
    setLocalSearch("");
    setSearch("");
    setSpecialization("");
    setHospital("");
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs flex flex-col lg:flex-row items-center gap-3">
      {/* Search Input */}
      <div className="relative flex-1 w-full">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search doctors by name, specialization, or hospital..."
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          className="w-full h-11 rounded-lg border border-slate-300 bg-white pl-10 pr-4 text-xs font-semibold text-slate-900 placeholder-slate-400 focus:border-sky-600 focus:ring-1 focus:ring-sky-600 focus:outline-none transition-colors"
        />
      </div>

      {/* Filter Dropdowns */}
      <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto justify-between lg:justify-end">
        <div className="flex items-center gap-1.5 text-xs text-slate-900 font-extrabold shrink-0">
          <Filter className="h-4 w-4 text-slate-700" /> Filters:
        </div>

        {/* Specialization Shadcn Select Dropdown */}
        <div className="w-full sm:w-48">
          <Select
            value={specialization || "all"}
            onValueChange={(val) => setSpecialization(val === "all" ? "" : val)}
          >
            <SelectTrigger className="w-full h-11">
              <SelectValue placeholder="All Specializations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Specializations</SelectItem>
              {specializations.map((spec) => (
                <SelectItem key={spec} value={spec}>
                  {spec}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Hospital Shadcn Select Dropdown */}
        <div className="w-full sm:w-52">
          <Select
            value={hospital || "all"}
            onValueChange={(val) => setHospital(val === "all" ? "" : val)}
          >
            <SelectTrigger className="w-full h-11">
              <SelectValue placeholder="All Hospitals" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Hospitals</SelectItem>
              {hospitals.map((hosp) => (
                <SelectItem key={hosp} value={hosp}>
                  {hosp}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Reset Filter Button */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleResetFilters}
            className="h-10 px-3 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 gap-1.5 font-bold cursor-pointer rounded-xl"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset</span>
          </Button>
        )}
      </div>
    </div>
  );
}
