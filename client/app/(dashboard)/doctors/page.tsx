"use client";

import React, { useState } from "react";
import { Stethoscope, Plus, FileSpreadsheet, FileCode } from "lucide-react";
import useDoctors, { DoctorItem } from "@/api/hooks/useDoctors";
import { Button } from "@/components/ui/button";
import { TableSkeleton } from "@/components/common/Skeleton";
import ErrorState from "@/components/common/ErrorState";
import EmptyState from "@/components/common/EmptyState";
import DoctorFilters from "@/components/dashboard/doctors/DoctorFilters";
import DoctorTable from "@/components/dashboard/doctors/DoctorTable";
import AddDoctorModal, { AddDoctorFormData } from "@/components/dashboard/doctors/AddDoctorModal";
import EditDoctorModal, { EditDoctorFormData } from "@/components/dashboard/doctors/EditDoctorModal";
import DeleteDoctorModal from "@/components/dashboard/doctors/DeleteDoctorModal";
import { exportToCSV, exportToJSON } from "@/lib/exportUtils";
import { toast } from "react-toastify";

export default function DoctorsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [specializationFilter, setSpecializationFilter] = useState("");
  const [hospitalFilter, setHospitalFilter] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<DoctorItem | null>(null);
  const [deletingDoctorId, setDeletingDoctorId] = useState<string | null>(null);

  const {
    doctors,
    pagination,
    isLoading,
    isError,
    refetch,
    createDoctor,
    isCreatingDoctor,
    updateDoctor,
    isUpdatingDoctor,
    deleteDoctor,
    isDeletingDoctor,
  } = useDoctors({
    page,
    limit: 10,
    search: search.trim() || undefined,
    specialization: specializationFilter || undefined,
    hospital: hospitalFilter || undefined,
  });

  const handleAddDoctor = (data: AddDoctorFormData) => {
    createDoctor(data, {
      onSuccess: () => {
        setIsAddModalOpen(false);
      },
    });
  };

  const handleUpdateDoctor = (id: string, data: EditDoctorFormData) => {
    updateDoctor(
      { id, payload: data },
      {
        onSuccess: () => {
          setEditingDoctor(null);
        },
      }
    );
  };

  const handleDeleteDoctor = () => {
    if (deletingDoctorId) {
      deleteDoctor(deletingDoctorId, {
        onSuccess: () => {
          setDeletingDoctorId(null);
        },
      });
    }
  };

  const handleExportCSV = () => {
    if (!doctors || !doctors.length) {
      toast.info("No doctor records available to export.");
      return;
    }

    exportToCSV("Doctors_Roster", doctors, [
      { key: "name", label: "Doctor Name" },
      { key: "specialization", label: "Specialization" },
      { key: "hospital", label: "Hospital" },
      { key: "phone", label: "Phone" },
      { key: "email", label: "Email" },
      { key: "patientCount", label: "Assigned Patients Count" },
    ]);

    toast.success("Exported Doctors to CSV!");
  };

  const handleExportJSON = () => {
    if (!doctors || !doctors.length) {
      toast.info("No doctor records available to export.");
      return;
    }
    exportToJSON("Doctors_Roster", doctors);
    toast.success("Exported Doctors to JSON!");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Stethoscope className="h-6 w-6 text-sky-600 shrink-0" /> Doctor Roster Directory
          </h1>
          <p className="text-xs text-slate-600 font-medium mt-1.5">
            Search, filter, and manage clinical staff and hospital affiliations
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            className="h-10 gap-1.5 text-xs font-semibold text-slate-700 border-slate-300 hover:bg-slate-100 cursor-pointer rounded-lg px-3"
          >
            <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
            <span>Export CSV</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportJSON}
            className="h-10 gap-1.5 text-xs font-semibold text-slate-700 border-slate-300 hover:bg-slate-100 cursor-pointer rounded-lg px-3"
          >
            <FileCode className="h-4 w-4 text-indigo-600" />
            <span>Export JSON</span>
          </Button>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-sky-600 hover:bg-sky-700 text-white shadow-xs gap-2 cursor-pointer rounded-lg px-4 h-10 font-semibold text-xs"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Doctor</span>
          </Button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <DoctorFilters
        search={search}
        setSearch={(val) => {
          setSearch(val);
          setPage(1);
        }}
        specialization={specializationFilter}
        setSpecialization={(val) => {
          setSpecializationFilter(val);
          setPage(1);
        }}
        hospital={hospitalFilter}
        setHospital={(val) => {
          setHospitalFilter(val);
          setPage(1);
        }}
      />

      {/* Doctor Content */}
      {isLoading ? (
        <TableSkeleton rows={6} />
      ) : isError ? (
        <ErrorState
          title="Failed to load doctors"
          message="Could not fetch doctor records from the server."
          onRetry={refetch}
        />
      ) : !doctors || doctors.length === 0 ? (
        <EmptyState
          title="No doctors found"
          description="No doctor records matched your search or filter parameters."
          action={
            <Button
              onClick={() => setIsAddModalOpen(true)}
              size="sm"
              className="bg-sky-600 hover:bg-sky-700 text-white cursor-pointer"
            >
              Add First Doctor
            </Button>
          }
        />
      ) : (
        <DoctorTable
          doctors={doctors}
          pagination={pagination}
          onPageChange={(p) => setPage(p)}
          onEditClick={(doctor) => setEditingDoctor(doctor)}
          onDeleteClick={(id) => setDeletingDoctorId(id)}
        />
      )}

      {/* Add Doctor Dialog */}
      <AddDoctorModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddDoctor}
        isLoading={isCreatingDoctor}
      />

      {/* Edit Doctor Dialog */}
      <EditDoctorModal
        doctor={editingDoctor}
        isOpen={!!editingDoctor}
        onClose={() => setEditingDoctor(null)}
        onSubmit={handleUpdateDoctor}
        isLoading={isUpdatingDoctor}
      />

      {/* Delete Doctor Confirmation Dialog */}
      <DeleteDoctorModal
        isOpen={!!deletingDoctorId}
        onClose={() => setDeletingDoctorId(null)}
        onConfirm={handleDeleteDoctor}
        isLoading={isDeletingDoctor}
      />
    </div>
  );
}
