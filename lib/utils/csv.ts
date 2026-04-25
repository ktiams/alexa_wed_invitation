import type { GuestWithDetails } from "@/lib/types/database";

export function exportGuestsToCSV(guests: GuestWithDetails[]): string {
  const headers = [
    "Name",
    "Email",
    "Phone",
    "Attendance",
    "Companion",
    "Adults Only Acknowledged",
    "Dress Code Acknowledged",
    "Message Status",
    "Gift Status",
    "Admin Notes",
    "Created At",
  ];

  const rows = guests.map((g) => {
    const latestMessage = g.guest_messages?.[0];
    const latestGift = g.gift_transactions?.[0];

    return [
      g.full_name,
      g.email ?? "",
      g.phone ?? "",
      g.attendance_status,
      g.plus_one_name ?? "",
      g.adults_only_acknowledged ? "Yes" : "No",
      g.dress_code_acknowledged ? "Yes" : "No",
      latestMessage
        ? latestMessage.is_approved
          ? "Approved"
          : "Pending"
        : "None",
      latestGift?.status ?? "None",
      g.admin_notes ?? "",
      new Date(g.created_at).toLocaleString(),
    ].map((v) => `"${String(v).replace(/"/g, '""')}"`);
  });

  return [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
}

export function downloadCSV(content: string, filename: string): void {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
