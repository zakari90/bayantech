// app/admin/layout.tsx
import AdminLayoutClient from "@/components/freeinUse/admin-layout-client";
import DesktopAppUpsell from "@/components/freeinUse/DesktopAppUpsell";
import { ReactNode } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default async function AdminLayout({ children }: DashboardLayoutProps) {
  return (
    <>
      <AdminLayoutClient>{children}</AdminLayoutClient>
      <DesktopAppUpsell />
    </>
  );
}
