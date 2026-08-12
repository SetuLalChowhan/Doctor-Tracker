"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { User, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { GlobalPatientItem, UpdatePatientData } from "@/api/hooks/usePatients";
import { useDoctors } from "@/api/hooks/useDoctors";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EditPatientModalProps {
  patient: GlobalPatientItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: string, data: UpdatePatientData) => void;
  isLoading: boolean;
}

export default function EditPatientModal({
  patient,
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}: EditPatientModalProps) {
  const { doctors } = useDoctors({ limit: 100 });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UpdatePatientData>();

  const selectedGender = watch("gender");
  const selectedDoctorId = watch("doctorId");

  useEffect(() => {
    if (patient && isOpen) {
      reset({
        name: patient.name,
        age: patient.age,
        gender: patient.gender,
        condition: patient.condition,
        phone: patient.phone,
        email: patient.email || "",
        doctorId:
          typeof patient.doctorId === "object"
            ? patient.doctorId?._id
            : patient.doctorId,
      });
    }
  }, [patient, isOpen, reset]);

  const handleFormSubmit = (data: UpdatePatientData) => {
    if (patient) {
      onSubmit(patient._id, {
        name: data.name?.trim(),
        age: Number(data.age),
        gender: data.gender,
        condition: data.condition?.trim(),
        phone: data.phone?.trim(),
        email: data.email?.trim() || undefined,
        doctorId: data.doctorId,
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-50 text-sky-600">
              <User className="h-4 w-4" />
            </div>
            <DialogTitle>Edit Patient Record</DialogTitle>
          </div>
          <DialogDescription>
            Update diagnosis, contact information, and physician assignment.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="space-y-4 pt-2"
        >
          {/* Patient Full Name */}
          <div>
            <label className="block text-xs font-extrabold text-slate-800 mb-3">
              Patient Full Name *
            </label>
            <input
              type="text"
              placeholder="John Doe"
              {...register("name", { required: "Patient name is required" })}
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-900 placeholder-slate-400 focus:border-sky-600 focus:ring-1 focus:ring-sky-600 focus:outline-none"
            />
            {errors.name && (
              <p className="text-xs font-bold text-red-500 mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Age & Gender */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-extrabold text-slate-800 mb-3">
                Age *
              </label>
              <input
                type="number"
                placeholder="45"
                {...register("age", {
                  required: "Age is required",
                  min: { value: 0, message: "Age must be positive" },
                })}
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-900 placeholder-slate-400 focus:border-sky-600 focus:ring-1 focus:ring-sky-600 focus:outline-none"
              />
              {errors.age && (
                <p className="text-xs font-bold text-red-500 mt-1">
                  {errors.age.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-800 mb-3">
                Gender *
              </label>
              <Select
                value={selectedGender}
                onValueChange={(val: "Male" | "Female" | "Other") =>
                  setValue("gender", val, { shouldValidate: true })
                }
              >
                <SelectTrigger className="w-full h-11 border-slate-300 font-bold text-xs">
                  <SelectValue placeholder="Select Gender..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Condition */}
          <div>
            <label className="block text-xs font-extrabold text-slate-800 mb-3">
              Condition / Diagnosis *
            </label>
            <input
              type="text"
              placeholder="Hypertension, Asthma..."
              {...register("condition", { required: "Condition is required" })}
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-3 text-xs font-semibold text-slate-900 placeholder-slate-400 focus:border-sky-600 focus:ring-1 focus:ring-sky-600 focus:outline-none"
            />
            {errors.condition && (
              <p className="text-xs font-bold text-red-500 mt-1">
                {errors.condition.message}
              </p>
            )}
          </div>

          {/* Assigned Physician */}
          <div>
            <label className="block text-xs font-extrabold text-slate-800 mb-3">
              Assigned Physician *
            </label>
            <Select
              value={selectedDoctorId || ""}
              onValueChange={(val) =>
                setValue("doctorId", val, { shouldValidate: true })
              }
            >
              <SelectTrigger className="w-full h-11 border-slate-300 font-bold text-xs">
                <SelectValue placeholder="Select Doctor..." />
              </SelectTrigger>
              <SelectContent>
                {doctors?.map((doc) => (
                  <SelectItem key={doc._id} value={doc._id}>
                    {doc.name} — {doc.specialization} ({doc.hospital})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.doctorId && (
              <p className="text-xs font-bold text-red-500 mt-1">
                {errors.doctorId.message}
              </p>
            )}
          </div>

          {/* Phone & Email */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-extrabold text-slate-800 mb-3">
                Phone *
              </label>
              <input
                type="text"
                placeholder="+1-555-0201"
                {...register("phone", { required: "Phone is required" })}
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-900 placeholder-slate-400 focus:border-sky-600 focus:ring-1 focus:ring-sky-600 focus:outline-none"
              />
              {errors.phone && (
                <p className="text-xs font-bold text-red-500 mt-1">
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-800 mb-3">
                Email (Optional)
              </label>
              <input
                type="email"
                placeholder="patient@example.com"
                {...register("email")}
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-900 placeholder-slate-400 focus:border-sky-600 focus:ring-1 focus:ring-sky-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="cursor-pointer border-slate-200"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isLoading}
              className="bg-sky-600 hover:bg-sky-700 text-white gap-2 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Updating...</span>
                </>
              ) : (
                <span>Update Patient</span>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
