"use client";

import React from "react";
import { AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteDoctorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}

export default function DeleteDoctorModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
}: DeleteDoctorModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="space-y-3 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-50 text-red-600 border border-red-100 shrink-0">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-slate-900">
                Delete Doctor Record
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500 mt-1 leading-relaxed">
                Are you sure you want to delete this doctor? All associated patient records assigned under this doctor will be permanently removed.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 mt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="cursor-pointer border-slate-200 text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            size="sm"
            disabled={isLoading}
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 text-white font-medium shadow-sm cursor-pointer px-4"
          >
            {isLoading ? "Deleting..." : "Delete Doctor"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

