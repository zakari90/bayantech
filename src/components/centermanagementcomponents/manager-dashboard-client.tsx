/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

// import { AutoSyncProvider } from "@/components/AutoSyncProvider";
import EnrollmentChart from "@/components/centermanagementcomponents/enrollement-chart";
import ManagerRevenueChart from "@/components/centermanagementcomponents/managerrevenue-chart";
import ManagerStatsCards from "@/components/centermanagementcomponents/managerStateCards";
import PageHeader from "@/components/centermanagementcomponents/page-header";
import QuickActions from "@/components/centermanagementcomponents/quickActions";
import ReceiptsSummary from "@/components/centermanagementcomponents/receiptSummary";
import TopSubjects from "@/components/centermanagementcomponents/top-subjects";
import { useTranslations } from "next-intl";

export default function ManagerDashboardClient() {
  const t = useTranslations("Dashboard");

  return (
    <>
      <div className="container mx-auto p-4 sm:p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <PageHeader title={t("title")} subtitle={t("subtitle")} />

        {/* Key Performance Indicators */}
        <section>
          <ManagerStatsCards />
        </section>

        {/* Quick Actions - temporarily disabled */}
        {/* <section>
          <QuickActions />
        </section> */}

        {/* Charts Section */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          <ManagerRevenueChart />
          <EnrollmentChart />
        </div>

        {/* Financial Summary & Top Subjects */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          <ReceiptsSummary />
          <TopSubjects />
        </div>

        {/* Data Synchronization (Hidden/Background) */}
        {/* <SyncHandler /> */}
      </div>
    </>
  );
}
