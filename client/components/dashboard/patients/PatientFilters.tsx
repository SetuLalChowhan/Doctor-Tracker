"use client";

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
import { useDoctors } from "@/api/hooks/useDoctors";

interface PatientFiltersProps {
  search: string;
  setSearch: (value: string) => void;
  condition: string;
  setCondition: (value: string) => void;
  doctorId?: string;
  setDoctorId?: (value: string) => void;
  gender: string;
  setGender: (value: string) => void;
  showDoctorFilter?: boolean;
}

const PRESET_CONDITIONS = [
  "Hypertension",
  "Coronary Artery Disease",
  "Migraine",
  "Asthma",
  "Osteoarthritis",
  "Diabetes",
  "General Checkup",
];

export default function PatientFilters({
  search,
  setSearch,
  condition,
  setCondition,
  doctorId = "",
  setDoctorId,
  gender,
  setGender,
  showDoctorFilter = true,
}: PatientFiltersProps) {
  const { doctors } = useDoctors({ limit: 100 });

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

  const hasActiveFilters = search || condition || doctorId || gender || localSearch;

  const handleResetFilters = () => {
    setLocalSearch("");
    setSearch("");
    setCondition("");
    setDoctorId?.("");
    setGender("");
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs flex flex-col lg:flex-row items-center gap-3">
      {/* Search Input */}
      <div className="relative flex-1 w-full">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search patients by name, diagnosis, phone, or email..."
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          className="w-full h-11 rounded-lg border border-slate-300 bg-white pl-10 pr-4 text-xs font-semibold text-slate-900 placeholder-slate-400 focus:border-sky-600 focus:ring-1 focus:ring-sky-600 focus:outline-none transition-colors"
        />
      </div>

      {/* Filter Dropdowns */}
      <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto justify-between lg:justify-end">
        <div className="flex items-center gap-1.5 text-xs text-slate-700 font-bold shrink-0">
          <Filter className="h-4 w-4 text-slate-500" /> Filters:
        </div>

        {/* Condition Filter */}
        <div className="w-full sm:w-44">
          <Select
            value={condition || "all"}
            onValueChange={(val) => setCondition(val === "all" ? "" : val)}
          >
            <SelectTrigger className="w-full h-11">
              <SelectValue placeholder="All Conditions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Conditions</SelectItem>
              {PRESET_CONDITIONS.map((cond) => (
                <SelectItem key={cond} value={cond}>
                  {cond}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Doctor Filter */}
        {showDoctorFilter && setDoctorId && (
          <div className="w-full sm:w-48">
            <Select
              value={doctorId || "all"}
              onValueChange={(val) => setDoctorId(val === "all" ? "" : val)}
            >
              <SelectTrigger className="w-full h-11">
                <SelectValue placeholder="All Doctors" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Doctors</SelectItem>
                {doctors?.map((doc) => (
                  <SelectItem key={doc._id} value={doc._id}>
                    {doc.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Gender Filter */}
        <div className="w-full sm:w-36">
          <Select
            value={gender || "all"}
            onValueChange={(val) => setGender(val === "all" ? "" : val)}
          >
            <SelectTrigger className="w-full h-11">
              <SelectValue placeholder="All Genders" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Genders</SelectItem>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Reset Filter Button */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleResetFilters}
            className="h-10 px-3 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 gap-1.5 font-bold cursor-pointer rounded-lg"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset</span>
          </Button>
        )}
      </div>
    </div>
  );
}
