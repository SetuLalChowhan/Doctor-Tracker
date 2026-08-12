"use client";

import React, { useState, useEffect } from "react";
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
import SelectOrCustomInput from "@/components/common/SelectOrCustomInput";
import { DoctorItem, useDoctorOptions } from "@/api/hooks/useDoctors";

export interface EditDoctorFormData {
  name: string;
  specialization: string;
  hospital: string;
  phone: string;
  email: string;
}

interface EditDoctorModalProps {
  doctor: DoctorItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: string, data: EditDoctorFormData) => void;
  isLoading: boolean;
}

export default function EditDoctorModal({
  doctor,
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}: EditDoctorModalProps) {
  const { data: metaOptions } = useDoctorOptions();

  const [specList, setSpecList] = useState<string[]>([]);
  const [hospList, setHospList] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<EditDoctorFormData>();

  useEffect(() => {
    if (metaOptions) {
      setSpecList(metaOptions.specializations);
      setHospList(metaOptions.hospitals);
    }
  }, [metaOptions]);

  useEffect(() => {
    if (doctor && isOpen) {
      reset({
        name: doctor.name,
        specialization: doctor.specialization,
        hospital: doctor.hospital,
        phone: doctor.phone,
        email: doctor.email,
      });
    }
  }, [doctor, isOpen, reset]);

  const handleFormSubmit = (data: EditDoctorFormData) => {
    if (doctor) {
      onSubmit(doctor._id, {
        name: data.name.trim(),
        specialization: data.specialization.trim(),
        hospital: data.hospital.trim(),
        phone: data.phone.trim(),
        email: data.email.trim(),
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-50 text-sky-600">
              <Stethoscope className="h-4 w-4" />
            </div>
            <DialogTitle>Edit Doctor Profile</DialogTitle>
          </div>
          <DialogDescription>
            Update clinical information and hospital assignments.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="space-y-4 pt-2"
        >
          {/* Doctor Name */}
          <div>
            <label className="block text-xs font-extrabold text-slate-800 mb-3">
              Doctor Name *
            </label>
            <input
              type="text"
              placeholder="Dr. Sarah Jenkins"
              {...register("name", { required: "Doctor name is required" })}
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-900 placeholder-slate-400 focus:border-sky-600 focus:ring-1 focus:ring-sky-600 focus:outline-none"
            />
            {errors.name && (
              <p className="text-xs font-bold text-red-500 mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Specialization */}
          <SelectOrCustomInput
            label="Specialization *"
            placeholder="Select Specialization..."
            customPlaceholder="Type new specialization..."
            options={specList}
            name="specialization"
            register={register}
            setValue={setValue}
            clearErrors={clearErrors}
            error={errors.specialization?.message}
            resetTrigger={!isOpen}
          />

          {/* Hospital */}
          <SelectOrCustomInput
            label="Hospital / Clinic *"
            placeholder="Select Hospital..."
            customPlaceholder="Type hospital or clinic name..."
            options={hospList}
            name="hospital"
            register={register}
            setValue={setValue}
            clearErrors={clearErrors}
            error={errors.hospital?.message}
            resetTrigger={!isOpen}
          />

          {/* Phone & Email */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-extrabold text-slate-800 mb-3">
                Phone *
              </label>
              <input
                type="text"
                placeholder="+1-555-0101"
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
                Email *
              </label>
              <input
                type="email"
                placeholder="doctor@hospital.org"
                {...register("email", {
                  required: "Email is required",
                  pattern: { value: /\S+@\S+\.\S+/, message: "Invalid email" },
                })}
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-900 placeholder-slate-400 focus:border-sky-600 focus:ring-1 focus:ring-sky-600 focus:outline-none"
              />
              {errors.email && (
                <p className="text-xs font-bold text-red-500 mt-1">
                  {errors.email.message}
                </p>
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
              className="bg-sky-600 hover:bg-sky-700 text-white gap-2 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Updating...</span>
                </>
              ) : (
                <span>Update Doctor</span>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
