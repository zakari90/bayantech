// app/[locale]/admin/page.tsx
import AdminDashboardClient from "@/components/centermanagementcomponents/admin-dashboard-client";
import OfflineNotificationBanner from "@/components/centermanagementcomponents/offline-notification-banner";
import DeleteRequestsPanel from "@/components/centermanagementcomponents/admin/DeleteRequestsPanel";

export const dynamic = "force-dynamic";

export default function AdminPage() {
  return (
    <div>
      <OfflineNotificationBanner />
      <DeleteRequestsPanel />
      <AdminDashboardClient />
    </div>
  );
}
