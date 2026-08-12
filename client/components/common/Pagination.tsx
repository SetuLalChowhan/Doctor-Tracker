import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (newPage: number) => void;
}

export default function Pagination({
  page,
  totalPages,
  total,
  limit,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const startRecord = (page - 1) * limit + 1;
  const endRecord = Math.min(page * limit, total);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 px-1 border-t border-slate-200">
      <div className="text-xs text-slate-500 font-medium">
        Showing <span className="font-extrabold text-sky-600">{startRecord}</span> to{" "}
        <span className="font-extrabold text-sky-600">{endRecord}</span> of{" "}
        <span className="font-extrabold text-sky-600">{total}</span> records
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="h-8 gap-1 text-xs border-slate-200 text-slate-700 hover:bg-slate-100 cursor-pointer disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Previous</span>
        </Button>

        <div className="text-xs font-semibold text-slate-600 px-2">
          Page <span className="font-extrabold text-sky-600">{page}</span> of{" "}
          <span className="font-extrabold text-sky-600">{totalPages}</span>
        </div>

        <Button
          variant="outline"
          size="sm"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="h-8 gap-1 text-xs border-slate-200 text-slate-700 hover:bg-slate-100 cursor-pointer disabled:opacity-40"
        >
          <span>Next</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
