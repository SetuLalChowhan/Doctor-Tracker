"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { Stethoscope, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export interface AddDoctorFormData {
  name: string;
  specialization: string;
  hospital: string;
  phone: string;
  email: string;
}

interface AddDoctorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AddDoctorFormData) => void;
  isLoading: boolean;
}

export default function AddDoctorModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}: AddDoctorModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddDoctorFormData>({
    defaultValues: {
      name: "",
      specialization: "",
      hospital: "",
      phone: "",
      email: "",
    },
  });

  const handleFormSubmit = (data: AddDoctorFormData) => {
    onSubmit(data);
    reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#038AF9]/10 text-[#038AF9]">
              <Stethoscope className="h-4 w-4" />
            </div>
            <DialogTitle>Add New Doctor</DialogTitle>
          </div>
          <DialogDescription>
            Enter doctor information to add a new record to the database.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 pt-2">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Doctor Name *</label>
            <input
              type="text"
              placeholder="Dr. Sarah Jenkins"
              {...register("name", { required: "Doctor name is required" })}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-[#038AF9] focus:bg-white focus:outline-none"
            />
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Specialization *</label>
            <input
              type="text"
              placeholder="Cardiology, Neurology, Pediatrics..."
              {...register("specialization", { required: "Specialization is required" })}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-[#038AF9] focus:bg-white focus:outline-none"
            />
            {errors.specialization && (
              <p className="text-xs text-red-500">{errors.specialization.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Hospital / Clinic *</label>
            <input
              type="text"
              placeholder="Metro Health Hospital"
              {...register("hospital", { required: "Hospital is required" })}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-[#038AF9] focus:bg-white focus:outline-none"
            />
            {errors.hospital && (
              <p className="text-xs text-red-500">{errors.hospital.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Phone *</label>
              <input
                type="text"
                placeholder="+1-555-0101"
                {...register("phone", { required: "Phone is required" })}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-[#038AF9] focus:bg-white focus:outline-none"
              />
              {errors.phone && (
                <p className="text-xs text-red-500">{errors.phone.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Email *</label>
              <input
                type="email"
                placeholder="doctor@hospital.org"
                {...register("email", {
                  required: "Email is required",
                  pattern: { value: /\S+@\S+\.\S+/, message: "Invalid email" },
                })}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-[#038AF9] focus:bg-white focus:outline-none"
              />
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email.message}</p>
              )}
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
              className="bg-[#038AF9] hover:bg-[#0277dc] text-white gap-2 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save Doctor</span>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
