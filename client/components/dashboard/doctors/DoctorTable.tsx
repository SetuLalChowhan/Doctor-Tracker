import React from "react";
import Link from "next/link";
import { Building2, Users, Trash2 } from "lucide-react";
import { DoctorItem } from "@/api/hooks/useDoctors";
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

interface DoctorTableProps {
  doctors: DoctorItem[];
  pagination?: {
    page: number;
    totalPages: number;
    total: number;
    limit: number;
  };
  onPageChange: (newPage: number) => void;
  onDeleteClick: (id: string) => void;
}

export default function DoctorTable({
  doctors,
  pagination,
  onPageChange,
  onDeleteClick,
}: DoctorTableProps) {
  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Doctor</TableHead>
            <TableHead>Specialization</TableHead>
            <TableHead>Hospital</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Patients</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {doctors.map((doctor) => (
            <TableRow key={doctor._id}>
              <TableCell>
                <div className="font-bold text-slate-900">{doctor.name}</div>
                <div className="text-xs text-slate-400 font-normal">{doctor.email}</div>
              </TableCell>
              <TableCell>
                <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-[#038AF9]">
                  {doctor.specialization}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1.5 text-slate-700">
                  <Building2 className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <span>{doctor.hospital}</span>
                </div>
              </TableCell>
              <TableCell className="text-xs text-slate-600 font-mono">
                {doctor.phone}
              </TableCell>
              <TableCell>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
                  <Users className="h-3 w-3 text-slate-500" />
                  {doctor.patientCount || 0} patients
                </span>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Link href={`/doctors/${doctor._id}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 gap-1.5 text-xs text-[#038AF9] border-blue-200 hover:bg-blue-50 cursor-pointer"
                    >
                      <Users className="h-3.5 w-3.5" />
                      <span>Patients</span>
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDeleteClick(doctor._id)}
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
