"use client";

import React, { useState } from "react";
import { Users, Download, FileSpreadsheet, FileCode } from "lucide-react";
import {
  usePatients,
  useUpdatePatient,
  useDeleteGlobalPatient,
  GlobalPatientItem,
  UpdatePatientData,
} from "@/api/hooks/usePatients";
import { Button } from "@/components/ui/button";
import { TableSkeleton } from "@/components/common/Skeleton";
import ErrorState from "@/components/common/ErrorState";
import EmptyState from "@/components/common/EmptyState";
import PatientFilters from "@/components/dashboard/patients/PatientFilters";
import GlobalPatientTable from "@/components/dashboard/patients/GlobalPatientTable";
import EditPatientModal from "@/components/dashboard/patients/EditPatientModal";
import DeletePatientModal from "@/components/dashboard/patients/DeletePatientModal";
import { exportToCSV, exportToJSON } from "@/lib/exportUtils";
import { toast } from "react-toastify";

export default function GlobalPatientsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [conditionFilter, setConditionFilter] = useState("");
  const [doctorFilter, setDoctorFilter] = useState("");
  const [genderFilter, setGenderFilter] = useState("");

  const [editingPatient, setEditingPatient] = useState<GlobalPatientItem | null>(null);
  const [deletingPatientId, setDeletingPatientId] = useState<string | null>(null);

  const { patients, pagination, isLoading, isError, refetch } = usePatients({
    page,
    limit: 10,
    search: search.trim() || undefined,
    condition: conditionFilter || undefined,
    doctorId: doctorFilter || undefined,
    gender: genderFilter || undefined,
  });

  const updatePatientMutation = useUpdatePatient();
  const deletePatientMutation = useDeleteGlobalPatient();

  const handleUpdatePatient = (id: string, data: UpdatePatientData) => {
    updatePatientMutation.mutate(
      { id, data },
      {
        onSuccess: () => {
          toast.success("Patient updated successfully!");
          setEditingPatient(null);
        },
        onError: (err: any) => {
          toast.error(err.response?.data?.message || "Failed to update patient.");
        },
      }
    );
  };

  const handleDeletePatient = () => {
    if (deletingPatientId) {
      deletePatientMutation.mutate(deletingPatientId, {
        onSuccess: () => {
          toast.success("Patient deleted successfully.");
          setDeletingPatientId(null);
        },
        onError: (err: any) => {
          toast.error(err.response?.data?.message || "Failed to delete patient.");
        },
      });
    }
  };

  const handleExportCSV = () => {
    if (!patients || !patients.length) {
      toast.info("No patient records available to export.");
      return;
    }

    const exportRows = patients.map((p) => ({
      name: p.name,
      age: p.age,
      gender: p.gender,
      condition: p.condition,
      phone: p.phone,
      email: p.email || "",
      doctorName: typeof p.doctorId === "object" ? p.doctorId?.name : "",
      doctorSpecialization: typeof p.doctorId === "object" ? p.doctorId?.specialization : "",
      hospital: typeof p.doctorId === "object" ? p.doctorId?.hospital : "",
    }));

    exportToCSV("Patients_Directory", exportRows, [
      { key: "name", label: "Patient Name" },
      { key: "age", label: "Age" },
      { key: "gender", label: "Gender" },
      { key: "condition", label: "Diagnosis Condition" },
      { key: "phone", label: "Phone" },
      { key: "email", label: "Email" },
      { key: "doctorName", label: "Assigned Doctor" },
      { key: "doctorSpecialization", label: "Specialization" },
      { key: "hospital", label: "Hospital" },
    ]);

    toast.success("Exported Patients to CSV!");
  };

  const handleExportJSON = () => {
    if (!patients || !patients.length) {
      toast.info("No patient records available to export.");
      return;
    }
    exportToJSON("Patients_Directory", patients);
    toast.success("Exported Patients to JSON!");
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Users className="h-6 w-6 text-sky-600 shrink-0" /> Global Patients Directory
          </h1>
          <p className="text-xs text-slate-600 font-medium mt-1.5">
            Search, filter, edit, and export registered patient records across doctors
          </p>
        </div>

        {/* Data Export Action Buttons */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            className="h-9 gap-1.5 text-xs font-semibold text-slate-700 border-slate-300 hover:bg-slate-100 cursor-pointer rounded-lg"
          >
            <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
            <span>Export CSV</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportJSON}
            className="h-9 gap-1.5 text-xs font-semibold text-slate-700 border-slate-300 hover:bg-slate-100 cursor-pointer rounded-lg"
          >
            <FileCode className="h-4 w-4 text-indigo-600" />
            <span>Export JSON</span>
          </Button>
        </div>
      </div>

      {/* Patient Filter Controls */}
      <PatientFilters
        search={search}
        setSearch={(val) => {
          setSearch(val);
          setPage(1);
        }}
        condition={conditionFilter}
        setCondition={(val) => {
          setConditionFilter(val);
          setPage(1);
        }}
        doctorId={doctorFilter}
        setDoctorId={(val) => {
          setDoctorFilter(val);
          setPage(1);
        }}
        gender={genderFilter}
        setGender={(val) => {
          setGenderFilter(val);
          setPage(1);
        }}
      />

      {/* Main Table Content */}
      {isLoading ? (
        <TableSkeleton rows={8} />
      ) : isError ? (
        <ErrorState
          title="Failed to load patients"
          message="Could not retrieve patient records from the backend API."
          onRetry={refetch}
        />
      ) : patients.length === 0 ? (
        <EmptyState
          title="No patients found"
          description={
            search || conditionFilter || doctorFilter || genderFilter
              ? "No patient records matched your active filter criteria."
              : "No patient records have been added yet."
          }
        />
      ) : (
        <GlobalPatientTable
          patients={patients}
          pagination={pagination}
          onPageChange={setPage}
          onEditClick={(patient) => setEditingPatient(patient)}
          onDeleteClick={(id) => setDeletingPatientId(id)}
        />
      )}

      {/* Edit Patient Modal */}
      <EditPatientModal
        patient={editingPatient}
        isOpen={!!editingPatient}
        onClose={() => setEditingPatient(null)}
        onSubmit={handleUpdatePatient}
        isLoading={updatePatientMutation.isPending}
      />

      {/* Delete Patient Confirmation Modal */}
      <DeletePatientModal
        isOpen={!!deletingPatientId}
        onClose={() => setDeletingPatientId(null)}
        onConfirm={handleDeletePatient}
        isLoading={deletePatientMutation.isPending}
      />
    </div>
  );
}
