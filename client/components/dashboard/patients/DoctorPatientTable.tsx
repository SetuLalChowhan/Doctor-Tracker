import React from "react";
import { Trash2 } from "lucide-react";
import { PatientItem } from "@/api/hooks/useDoctors";
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

interface DoctorPatientTableProps {
  patients: PatientItem[];
  pagination?: {
    page: number;
    totalPages: number;
    total: number;
    limit: number;
  };
  onPageChange: (newPage: number) => void;
  onDeleteClick: (patientId: string) => void;
}

export default function DoctorPatientTable({
  patients,
  pagination,
  onPageChange,
  onDeleteClick,
}: DoctorPatientTableProps) {
  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Patient Name</TableHead>
            <TableHead>Age / Gender</TableHead>
            <TableHead>Condition</TableHead>
            <TableHead>Contact Phone</TableHead>
            <TableHead>Email</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {patients.map((patient) => (
            <TableRow key={patient._id}>
              <TableCell className="font-bold text-slate-900 text-sm whitespace-nowrap">{patient.name}</TableCell>
              <TableCell className="whitespace-nowrap">
                <span className="text-xs text-slate-700 font-semibold whitespace-nowrap">
                  {patient.age} yrs • {patient.gender}
                </span>
              </TableCell>
              <TableCell className="whitespace-nowrap">
                <span className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-800 border border-slate-200 whitespace-nowrap">
                  {patient.condition}
                </span>
              </TableCell>
              <TableCell className="text-xs font-mono text-slate-700 font-medium whitespace-nowrap">
                {patient.phone}
              </TableCell>
              <TableCell className="text-xs text-slate-500 font-mono font-medium whitespace-nowrap">
                {patient.email || "N/A"}
              </TableCell>
              <TableCell className="text-right whitespace-nowrap">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDeleteClick(patient._id)}
                  className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
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
