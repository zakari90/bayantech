"use client";

import AdminQuickActions from "@/components/centermanagementcomponents/adminQuickActions";
import AdminRevenueChart from "@/components/centermanagementcomponents/adminrevenue-chart";
import AdminStatsCards from "@/components/centermanagementcomponents/adminStatsCards";
import CentersOverview from "@/components/centermanagementcomponents/centersOverview";
import EnrollmentChart from "@/components/centermanagementcomponents/enrollement-chart";
import ManagersList from "@/components/centermanagementcomponents/managersList";
import { DeleteAllDataButton } from "@/components/centermanagementcomponents/masterDelete";
import SystemActivityLog from "@/components/centermanagementcomponents/systemActivitylog";
import TopSubjects from "@/components/centermanagementcomponents/top-subjects";
import { InstallAppButton } from "@/components/install-app-button";
import { useTranslations } from "next-intl";
import PageHeader from "./page-header";

export default function AdminDashboardClient() {
  const t = useTranslations("Dashboard");

  return (
    <>

      <div className="container mx-auto p-4 sm:p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <PageHeader title={t("title")} subtitle={t("subtitle")} />
        <AdminStatsCards />

        {/* Quick Actions */}
        <AdminQuickActions />

        {/* Revenue Chart */}
        <section>
          <AdminRevenueChart />
        </section>

        {/* Centers Overview */}
        <section>
          <CentersOverview />
        </section>

        {/* Charts Section */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          <EnrollmentChart />
          <TopSubjects />
        </div>

        {/* Managers & Activity */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          <ManagersList />
          <SystemActivityLog />
        </div>

        {/* Actions Zone */}
        <div className="flex flex-wrap items-center gap-4">
          <DeleteAllDataButton />
          <InstallAppButton />
        </div>
      </div>
    </>
  );
}
