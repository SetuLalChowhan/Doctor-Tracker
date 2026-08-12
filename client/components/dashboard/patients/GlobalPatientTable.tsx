"use client";

import React from "react";
import Link from "next/link";
import { Stethoscope, Edit, Trash2 } from "lucide-react";
import { GlobalPatientItem } from "@/api/hooks/usePatients";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import Pagination from "@/components/common/Pagination";

interface GlobalPatientTableProps {
  patients: GlobalPatientItem[];
  pagination?: {
    page: number;
    totalPages: number;
    total: number;
    limit: number;
  };
  onPageChange: (newPage: number) => void;
  onEditClick: (patient: GlobalPatientItem) => void;
  onDeleteClick: (patientId: string) => void;
}

export default function GlobalPatientTable({
  patients,
  pagination,
  onPageChange,
  onEditClick,
  onDeleteClick,
}: GlobalPatientTableProps) {
  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Patient Name</TableHead>
            <TableHead>Age / Gender</TableHead>
            <TableHead>Diagnosis Condition</TableHead>
            <TableHead>Assigned Doctor</TableHead>
            <TableHead>Contact Phone</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {patients.map((patient) => (
            <TableRow key={patient._id}>
              {/* Patient Name */}
              <TableCell className="whitespace-nowrap">
                <div className="font-bold text-slate-900 text-sm">{patient.name}</div>
                <div className="text-xs text-slate-500 font-medium font-mono">
                  {patient.email || "No email"}
                </div>
              </TableCell>

              {/* Age / Gender */}
              <TableCell className="whitespace-nowrap">
                <span className="text-xs text-slate-700 font-semibold whitespace-nowrap">
                  {patient.age} yrs • {patient.gender}
                </span>
              </TableCell>

              {/* Condition Badge */}
              <TableCell className="whitespace-nowrap">
                <span className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-800 border border-slate-200 whitespace-nowrap">
                  {patient.condition}
                </span>
              </TableCell>

              {/* Assigned Doctor */}
              <TableCell className="whitespace-nowrap">
                {patient.doctorId ? (
                  <Link href={`/doctors/${patient.doctorId._id}`}>
                    <div className="flex items-center gap-1.5 group cursor-pointer whitespace-nowrap">
                      <div className="flex h-6 w-6 items-center justify-center rounded bg-sky-50 text-sky-600 group-hover:bg-sky-600 group-hover:text-white transition-colors shrink-0">
                        <Stethoscope className="h-3.5 w-3.5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                          {patient.doctorId.name}
                        </span>
                        <span className="text-[10px] font-medium text-slate-500">
                          {patient.doctorId.specialization}
                        </span>
                      </div>
                    </div>
                  </Link>
                ) : (
                  <span className="text-xs font-semibold text-slate-400">Unassigned</span>
                )}
              </TableCell>

              {/* Phone */}
              <TableCell className="text-xs font-mono text-slate-700 font-medium whitespace-nowrap">
                {patient.phone}
              </TableCell>

              {/* Actions */}
              <TableCell className="text-right whitespace-nowrap">
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEditClick(patient)}
                    className="h-8 w-8 text-slate-500 hover:text-sky-600 hover:bg-sky-50 cursor-pointer"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDeleteClick(patient._id)}
                    className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {pagination && (
        <Pagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          total={pagination.total}
          limit={pagination.limit}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}
