"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { ArrowLeft, Users, Search } from "lucide-react";
import { useDoctorDetails } from "@/api/hooks/useDoctors";
import { Button } from "@/components/ui/button";
import { TableSkeleton, CardSkeleton } from "@/components/common/Skeleton";
import ErrorState from "@/components/common/ErrorState";
import EmptyState from "@/components/common/EmptyState";
import DoctorHeaderCard from "@/components/dashboard/patients/DoctorHeaderCard";
import DoctorPatientTable from "@/components/dashboard/patients/DoctorPatientTable";
import AddPatientModal, { AddPatientFormData } from "@/components/dashboard/patients/AddPatientModal";
import DeletePatientModal from "@/components/dashboard/patients/DeletePatientModal";

export default function DoctorPatientsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const doctorId = resolvedParams.id;

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [localSearch, setLocalSearch] = useState("");
  const [conditionFilter, setConditionFilter] = useState("");
  const [isAddPatientModalOpen, setIsAddPatientModalOpen] = useState(false);
  const [deletingPatientId, setDeletingPatientId] = useState<string | null>(null);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      if (localSearch !== search) {
        setSearch(localSearch);
        setPage(1);
      }
    }, 300);
    return () => clearTimeout(handler);
  }, [localSearch, search]);

  const {
    doctor,
    isLoadingDoctor,
    isDoctorError,
    patients,
    pagination,
    isLoadingPatients,
    isPatientsError,
    refetchPatients,
    addPatient,
    isAddingPatient,
    deletePatient,
    isDeletingPatient,
  } = useDoctorDetails(doctorId, {
    page,
    limit: 10,
    search: search.trim() || undefined,
    condition: conditionFilter || undefined,
  });

  const handleAddPatient = (data: AddPatientFormData) => {
    addPatient(data, {
      onSuccess: () => {
        setIsAddPatientModalOpen(false);
      },
    });
  };

  const handleDeletePatient = () => {
    if (deletingPatientId) {
      deletePatient(deletingPatientId, {
        onSuccess: () => {
          setDeletingPatientId(null);
        },
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <div>
        <Link href="/doctors">
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Doctors List</span>
          </Button>
        </Link>
      </div>

      {/* Selected Doctor Summary Card */}
      {isLoadingDoctor ? (
        <CardSkeleton />
      ) : isDoctorError || !doctor ? (
        <ErrorState
          title="Doctor record not found"
          message="Could not retrieve doctor details."
        />
      ) : (
        <DoctorHeaderCard
          doctor={doctor}
          onAddPatientClick={() => setIsAddPatientModalOpen(true)}
        />
      )}

      {/* Patient List Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Users className="h-4 w-4 text-sky-600" /> Assigned Patient Roster
          </h2>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search patient name or condition..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="w-full h-11 rounded-xl border border-slate-300 bg-white pl-9 pr-3 text-xs font-semibold text-slate-900 placeholder-slate-400 focus:border-sky-600 focus:ring-1 focus:ring-sky-600 focus:outline-none"
              />
            </div>

            <input
              type="text"
              placeholder="Filter condition"
              value={conditionFilter}
              onChange={(e) => {
                setConditionFilter(e.target.value);
                setPage(1);
              }}
              className="w-36 h-11 rounded-xl border border-slate-300 bg-white px-3 text-xs font-semibold text-slate-900 placeholder-slate-400 focus:border-sky-600 focus:ring-1 focus:ring-sky-600 focus:outline-none"
            />
          </div>
        </div>

        {/* Patient Table Content */}
        {isLoadingPatients ? (
          <TableSkeleton rows={5} />
        ) : isPatientsError ? (
          <ErrorState
            title="Failed to load patient records"
            message="Could not fetch patients for this doctor."
            onRetry={refetchPatients}
          />
        ) : !patients || patients.length === 0 ? (
          <EmptyState
            title="No patients under this doctor"
            description="Add a new patient record to assign them to this doctor."
            action={
              <Button
                onClick={() => setIsAddPatientModalOpen(true)}
                size="sm"
                className="bg-[#038AF9] hover:bg-[#0277dc] text-white cursor-pointer"
              >
                Add Patient Now
              </Button>
            }
          />
        ) : (
          <DoctorPatientTable
            patients={patients}
            pagination={pagination}
            onPageChange={(p) => setPage(p)}
            onDeleteClick={(pId) => setDeletingPatientId(pId)}
          />
        )}
      </div>

      {/* Add Patient Shadcn Dialog */}
      <AddPatientModal
        isOpen={isAddPatientModalOpen}
        onClose={() => setIsAddPatientModalOpen(false)}
        onSubmit={handleAddPatient}
        isLoading={isAddingPatient}
        doctorName={doctor?.name}
      />

      {/* Delete Patient Confirmation Shadcn Dialog */}
      <DeletePatientModal
        isOpen={!!deletingPatientId}
        onClose={() => setDeletingPatientId(null)}
        onConfirm={handleDeletePatient}
        isLoading={isDeletingPatient}
      />
    </div>
  );
}
