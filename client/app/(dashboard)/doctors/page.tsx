"use client";

import React, { useState } from "react";
import { Stethoscope, Plus } from "lucide-react";
import useDoctors from "@/api/hooks/useDoctors";
import { Button } from "@/components/ui/button";
import { TableSkeleton } from "@/components/common/Skeleton";
import ErrorState from "@/components/common/ErrorState";
import EmptyState from "@/components/common/EmptyState";
import DoctorFilters from "@/components/dashboard/doctors/DoctorFilters";
import DoctorTable from "@/components/dashboard/doctors/DoctorTable";
import AddDoctorModal, { AddDoctorFormData } from "@/components/dashboard/doctors/AddDoctorModal";
import DeleteDoctorModal from "@/components/dashboard/doctors/DeleteDoctorModal";

export default function DoctorsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [specializationFilter, setSpecializationFilter] = useState("");
  const [hospitalFilter, setHospitalFilter] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deletingDoctorId, setDeletingDoctorId] = useState<string | null>(null);

  const {
    doctors,
    pagination,
    isLoading,
    isError,
    refetch,
    createDoctor,
    isCreatingDoctor,
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

  const handleDeleteDoctor = () => {
    if (deletingDoctorId) {
      deleteDoctor(deletingDoctorId, {
        onSuccess: () => {
          setDeletingDoctorId(null);
        },
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Stethoscope className="h-6 w-6 text-[#038AF9]" /> Doctor Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Create, search, filter, and manage doctor records
          </p>
        </div>

        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-[#038AF9] hover:bg-[#0277dc] text-white shadow-sm gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Doctor</span>
        </Button>
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
              className="bg-[#038AF9] hover:bg-[#0277dc] text-white cursor-pointer"
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
          onDeleteClick={(id) => setDeletingDoctorId(id)}
        />
      )}

      {/* Add Doctor Shadcn Dialog */}
      <AddDoctorModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddDoctor}
        isLoading={isCreatingDoctor}
      />

      {/* Delete Doctor Confirmation Shadcn Dialog */}
      <DeleteDoctorModal
        isOpen={!!deletingDoctorId}
        onClose={() => setDeletingDoctorId(null)}
        onConfirm={handleDeleteDoctor}
        isLoading={isDeletingDoctor}
      />
    </div>
  );
}
