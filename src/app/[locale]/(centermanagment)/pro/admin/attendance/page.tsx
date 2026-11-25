"use client";

import { Suspense, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { AttendanceModule } from "./components/AttendanceModule";
import ProTimeTableManagement from "./components/ProTimeTableManagement";

function AttendancePageContent() {
  const tAttendance = useTranslations("AttendanceRegister");
  const tTimetable = useTranslations("TimetableManagement");
  const searchParams = useSearchParams();

  const tabParam = searchParams.get("tab") || "schedule";
  const [activeTab, setActiveTab] = useState(tabParam);
  const [hasVisitedAttendance, setHasVisitedAttendance] = useState(
    tabParam === "attendance",
  );
  const [hasVisitedSchedule, setHasVisitedSchedule] = useState(
    tabParam === "schedule",
  );
  const [refreshKey, setRefreshKey] = useState(0);

  const handleScheduleChange = () => {
    setRefreshKey((prev: number) => prev + 1);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === "attendance") setHasVisitedAttendance(true);
    if (value === "schedule") setHasVisitedSchedule(true);

    const url = new URL(window.location.href);
    url.searchParams.set("tab", value);
    window.history.replaceState(null, "", url.toString());
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 space-y-6">
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="flex w-full sm:w-auto max-w-[500px] items-center">
          <TabsTrigger value="schedule" className="gap-2 cursor-pointer">
            {tTimetable("title") || "Schedule Management"}
          </TabsTrigger>
          <TabsTrigger value="attendance" className="gap-2 cursor-pointer">
            {tAttendance("title") || "Attendance Register"}
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="schedule"
          forceMount
          className={cn("mt-0", activeTab !== "schedule" && "hidden")}
        >
          {hasVisitedSchedule && (
            <ProTimeTableManagement
              refreshKey={refreshKey}
              onScheduleChangeAction={handleScheduleChange}
            />
          )}
        </TabsContent>

        <TabsContent
          value="attendance"
          forceMount
          className={cn("mt-0", activeTab !== "attendance" && "hidden")}
        >
          {hasVisitedAttendance && <AttendanceModule />}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function AttendancePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <AttendancePageContent />
    </Suspense>
  );
}
