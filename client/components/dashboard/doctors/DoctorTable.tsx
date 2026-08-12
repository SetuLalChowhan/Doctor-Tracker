import React from "react";
import Link from "next/link";
import { Building2, Users, Edit, Trash2 } from "lucide-react";
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
  onEditClick: (doctor: DoctorItem) => void;
  onDeleteClick: (id: string) => void;
}

export default function DoctorTable({
  doctors,
  pagination,
  onPageChange,
  onEditClick,
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
              <TableCell className="whitespace-nowrap">
                <div className="font-bold text-slate-900 text-sm">{doctor.name}</div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">{doctor.email}</div>
              </TableCell>
              <TableCell className="whitespace-nowrap">
                <span className="inline-flex items-center rounded-md bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-700 border border-sky-200 whitespace-nowrap">
                  {doctor.specialization}
                </span>
              </TableCell>
              <TableCell className="whitespace-nowrap">
                <div className="flex items-center gap-1.5 text-slate-800 font-medium text-xs whitespace-nowrap">
                  <Building2 className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <span>{doctor.hospital}</span>
                </div>
              </TableCell>
              <TableCell className="text-xs text-slate-700 font-mono font-medium whitespace-nowrap">
                {doctor.phone}
              </TableCell>
              <TableCell className="whitespace-nowrap">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200 whitespace-nowrap">
                  <Users className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                  <span>{doctor.patientCount || 0} patients</span>
                </span>
              </TableCell>
              <TableCell className="text-right whitespace-nowrap">
                <div className="flex items-center justify-end gap-1">
                  <Link href={`/doctors/${doctor._id}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 gap-1.5 text-xs font-semibold text-sky-700 border-slate-300 hover:bg-sky-50 cursor-pointer"
                    >
                      <Users className="h-3.5 w-3.5" />
                      <span>View Roster</span>
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEditClick(doctor)}
                    className="h-8 w-8 text-slate-500 hover:text-sky-600 hover:bg-sky-50 cursor-pointer"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
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
