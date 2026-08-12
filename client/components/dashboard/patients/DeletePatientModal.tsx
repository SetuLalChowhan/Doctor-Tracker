"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeletePatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}

export default function DeletePatientModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
}: DeletePatientModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-red-600">Remove Patient Record</DialogTitle>
          <DialogDescription>
            Are you sure you want to remove this patient record from the doctor list?
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="cursor-pointer border-slate-200"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            size="sm"
            disabled={isLoading}
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 cursor-pointer"
          >
            {isLoading ? "Removing..." : "Remove Patient"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
