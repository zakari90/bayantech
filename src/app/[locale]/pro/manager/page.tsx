// app/[locale]/manager/page.tsx
import ManagerDashboardClient from "@/components/centermanagementcomponents/manager-dashboard-client";
import OfflineNotificationBanner from "@/components/centermanagementcomponents/offline-notification-banner";

export const dynamic = "force-dynamic";

export default function ManagerPage() {
  return (
    <div>
      <OfflineNotificationBanner />
      <ManagerDashboardClient />
    </div>
  );
}
