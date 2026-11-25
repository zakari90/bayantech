// app/admin/layout.tsx
import AdminLayoutClient from "@/components/centermanagementcomponents/freeinUse/admin-layout-client";
import DesktopAppUpsell from "@/components/centermanagementcomponents/freeinUse/DesktopAppUpsell";
import { AuthProvider } from "@/freelib/context/freeauthContext";
import { ReactNode } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default async function AdminLayout({ children }: DashboardLayoutProps) {
  return (
    <AuthProvider>
      <AdminLayoutClient>{children}</AdminLayoutClient>
      <DesktopAppUpsell />
    </AuthProvider>
  );
}
