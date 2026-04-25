"use client";

import { Button } from "@/components/ui/Button";
import { exportGuestsToCSV, downloadCSV } from "@/lib/utils/csv";
import type { GuestWithDetails } from "@/lib/types/database";

interface CSVExportButtonProps {
  guests: GuestWithDetails[];
}

export function CSVExportButton({ guests }: CSVExportButtonProps) {
  function handleExport() {
    const csv = exportGuestsToCSV(guests);
    const date = new Date().toISOString().split("T")[0];
    downloadCSV(csv, `guests-${date}.csv`);
  }

  return (
    <Button variant="outline" size="sm" onClick={handleExport}>
      Exportar CSV
    </Button>
  );
}
