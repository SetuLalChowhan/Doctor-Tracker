"use client";

import React, { useState, useEffect } from "react";
import {
  UseFormRegister,
  UseFormSetValue,
  UseFormClearErrors,
} from "react-hook-form";
import { Plus, ListFilter, CheckCircle2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SelectOrCustomInputProps {
  label: string;
  placeholder: string;
  customPlaceholder: string;
  options: string[];
  name: string;
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  clearErrors: UseFormClearErrors<any>;
  error?: string;
  resetTrigger?: boolean;
  value?: string;
}

export default function SelectOrCustomInput({
  label,
  placeholder,
  customPlaceholder,
  options,
  name,
  register,
  setValue,
  clearErrors,
  error,
  resetTrigger,
  value,
}: SelectOrCustomInputProps) {
  const [isCustom, setIsCustom] = useState(false);
  const [duplicateNotice, setDuplicateNotice] = useState<string | null>(null);
  const [selectedValue, setSelectedValue] = useState(value || "");
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  // Sync internal state with external value and resetTrigger
  useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value);
      if (options.length > 0 && value && !options.includes(value)) {
        setIsCustom(true);
      }
    }
  }, [value, options]);

  useEffect(() => {
    setIsCustom(false);
    setDuplicateNotice(null);
    setSelectedValue("");
    clearErrors(name);
  }, [resetTrigger, clearErrors, name]);

  // Auto-focus custom input when switching to custom mode
  useEffect(() => {
    if (isCustom) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 60);
      return () => clearTimeout(timer);
    }
  }, [isCustom]);

  const handleSelectValueChange = (val: string) => {
    if (val === "__custom__") {
      setIsCustom(true);
      setSelectedValue("");
      setValue(name, "");
      clearErrors(name);
      setDuplicateNotice(null);
    } else {
      setIsCustom(false);
      setSelectedValue(val);
      setValue(name, val);
      if (val) clearErrors(name);
      setDuplicateNotice(null);
    }
  };

  const handleCustomInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const trimmed = val.trim();
    setValue(name, val);
    if (val) clearErrors(name);

    if (!trimmed) {
      setDuplicateNotice(null);
      return;
    }

    const existingMatch = options.find(
      (item) => item.toLowerCase() === trimmed.toLowerCase()
    );

    if (existingMatch) {
      setDuplicateNotice(`"${existingMatch}" already exists in options list.`);
    } else {
      setDuplicateNotice(null);
    }
  };

  const toggleCustomMode = () => {
    if (isCustom) {
      setIsCustom(false);
      setSelectedValue("");
      setValue(name, "");
      clearErrors(name);
      setDuplicateNotice(null);
    } else {
      setIsCustom(true);
      setSelectedValue("");
      setValue(name, "");
      clearErrors(name);
      setDuplicateNotice(null);
    }
  };

  const { ref: registerRef, ...registerProps } = register(name, {
    required: `${label.replace("*", "").trim()} is required`,
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <label className="block text-xs font-extrabold text-slate-800">
          {label}
        </label>
        <button
          type="button"
          onClick={toggleCustomMode}
          className="text-[11px] font-bold text-sky-600 hover:underline flex items-center gap-1 cursor-pointer"
        >
          {isCustom ? (
            <>
              <ListFilter className="h-3 w-3" /> Select from list
            </>
          ) : (
            <>
              <Plus className="h-3 w-3" /> Add Custom
            </>
          )}
        </button>
      </div>

      {!isCustom ? (
        <Select
          value={selectedValue || ""}
          onValueChange={handleSelectValueChange}
        >
          <SelectTrigger className="w-full h-11 border-slate-300 font-bold text-xs">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((opt) => (
              <SelectItem key={opt} value={opt}>
                {opt}
              </SelectItem>
            ))}
            <SelectItem value="__custom__" className="text-sky-600 font-bold">
              + Add Custom...
            </SelectItem>
          </SelectContent>
        </Select>
      ) : (
        <div>
          <input
            type="text"
            {...registerProps}
            ref={(e) => {
              registerRef(e);
              inputRef.current = e;
            }}
            placeholder={customPlaceholder}
            onChange={handleCustomInput}
            className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-3 text-xs font-semibold text-slate-900 placeholder-slate-400 focus:border-sky-600 focus:ring-1 focus:ring-sky-600 focus:outline-none"
          />
          {duplicateNotice && (
            <p className="text-[11px] font-bold text-amber-600 mt-1 flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-amber-600" />
              <span>{duplicateNotice}</span>
            </p>
          )}
        </div>
      )}

      {error && <p className="text-xs font-bold text-red-500 mt-1">{error}</p>}
    </div>
  );
}
