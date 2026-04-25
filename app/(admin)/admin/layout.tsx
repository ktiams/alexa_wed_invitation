import { AdminSidebar } from "@/components/admin/AdminSidebar";

export const dynamic = "force-dynamic";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-cream md:flex">
      <AdminSidebar />
      <div className="min-w-0 flex-1">
        <div className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 sm:py-6 md:px-8 md:py-8">
          {children}
        </div>
      </div>
    </div>
  );
}
