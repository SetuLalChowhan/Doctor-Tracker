"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { UserPlus, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export interface AddPatientFormData {
  name: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  phone: string;
  email?: string;
  condition: string;
}

interface AddPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AddPatientFormData) => void;
  isLoading: boolean;
  doctorName?: string;
}

export default function AddPatientModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  doctorName,
}: AddPatientModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddPatientFormData>({
    defaultValues: {
      name: "",
      age: 30,
      gender: "Male",
      phone: "",
      email: "",
      condition: "",
    },
  });

  const handleFormSubmit = (data: AddPatientFormData) => {
    onSubmit({
      ...data,
      age: Number(data.age),
    });
    reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#038AF9]/10 text-[#038AF9]">
              <UserPlus className="h-4 w-4" />
            </div>
            <DialogTitle>Add Patient {doctorName ? `for ${doctorName}` : ""}</DialogTitle>
          </div>
          <DialogDescription>
            Enter patient information to assign them to this doctor.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 pt-2">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Patient Full Name *</label>
            <input
              type="text"
              placeholder="John Doe"
              {...register("name", { required: "Patient name is required" })}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-[#038AF9] focus:bg-white focus:outline-none"
            />
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Age *</label>
              <input
                type="number"
                placeholder="45"
                {...register("age", {
                  required: "Age is required",
                  min: { value: 0, message: "Age must be positive" },
                })}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-[#038AF9] focus:bg-white focus:outline-none"
              />
              {errors.age && (
                <p className="text-xs text-red-500">{errors.age.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Gender *</label>
              <select
                {...register("gender", { required: "Gender is required" })}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-[#038AF9] focus:bg-white focus:outline-none cursor-pointer"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Condition / Diagnosis *</label>
            <input
              type="text"
              placeholder="Hypertension, Asthma, Diabetes..."
              {...register("condition", { required: "Condition is required" })}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-[#038AF9] focus:bg-white focus:outline-none"
            />
            {errors.condition && (
              <p className="text-xs text-red-500">{errors.condition.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Phone *</label>
              <input
                type="text"
                placeholder="+1-555-0201"
                {...register("phone", { required: "Phone is required" })}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-[#038AF9] focus:bg-white focus:outline-none"
              />
              {errors.phone && (
                <p className="text-xs text-red-500">{errors.phone.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Email (Optional)</label>
              <input
                type="email"
                placeholder="patient@example.com"
                {...register("email")}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-[#038AF9] focus:bg-white focus:outline-none"
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
              className="bg-[#038AF9] hover:bg-[#0277dc] text-white gap-2 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Adding...</span>
                </>
              ) : (
                <span>Add Patient</span>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
