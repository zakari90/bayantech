/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocalizedConstants } from "@/components/freeinUse/useLocalizedConstants";
import { centerActions } from "@/freelib/dexie/freedexieaction";
import { timeTableActions } from "@/freelib/dexie/scheduleDb";
import { generateObjectId } from "@/freelib/utils/generateObjectId";
import { useLiveQuery } from "dexie-react-hooks";
import { Clock, FileSpreadsheet, Loader2, MapPin, Trash2, User } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";
import { cn } from "@/freelib/utils";

// Slot color palette — generates a consistent pastel class based on slot name
const SLOT_COLORS = [
  "bg-indigo-500/15 text-indigo-700 border-indigo-300/50 dark:text-indigo-300 dark:border-indigo-700/50",
  "bg-emerald-500/15 text-emerald-700 border-emerald-300/50 dark:text-emerald-300 dark:border-emerald-700/50",
  "bg-violet-500/15 text-violet-700 border-violet-300/50 dark:text-violet-300 dark:border-violet-700/50",
  "bg-amber-500/15 text-amber-700 border-amber-300/50 dark:text-amber-300 dark:border-amber-700/50",
  "bg-rose-500/15 text-rose-700 border-rose-300/50 dark:text-rose-300 dark:border-rose-700/50",
  "bg-cyan-500/15 text-cyan-700 border-cyan-300/50 dark:text-cyan-300 dark:border-cyan-700/50",
  "bg-fuchsia-500/15 text-fuchsia-700 border-fuchsia-300/50 dark:text-fuchsia-300 dark:border-fuchsia-700/50",
  "bg-sky-500/15 text-sky-700 border-sky-300/50 dark:text-sky-300 dark:border-sky-700/50",
];

function getSlotColorClass(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) & 0xffff;
  }
  return SLOT_COLORS[hash % SLOT_COLORS.length];
}

interface ScheduleSlot {
  id?: string;
  day: string;
  startTime: string;
  endTime: string;
  name: string;
}

const TIME_SLOTS = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
  "22:00",
  "23:00",
  "00:00",
  "01:00",
  "02:00",
  "03:00",
  "04:00",
  "05:00",
  "06:00",
  "07:00",
];

// parseWeeklySchedule removed as teacher logic was deleted

const normalizeDayKey = (day: string): string => {
  if (!day) return "";
  const d = day.toLowerCase().trim();
  // English
  if (d === "monday" || d === "mon") return "monday";
  if (d === "tuesday" || d === "tue") return "tuesday";
  if (d === "wednesday" || d === "wed") return "wednesday";
  if (d === "thursday" || d === "thu") return "thursday";
  if (d === "friday" || d === "fri") return "friday";
  if (d === "saturday" || d === "sat") return "saturday";
  if (d === "sunday" || d === "sun") return "sunday";

  // French
  if (d === "lundi") return "monday";
  if (d === "mardi") return "tuesday";
  if (d === "mercredi") return "wednesday";
  if (d === "jeudi") return "thursday";
  if (d === "vendredi") return "friday";
  if (d === "samedi") return "saturday";
  if (d === "dimanche") return "sunday";

  // Arabic (with and without hamza)
  if (d === "الاثنين" || d === "الإثنين") return "monday";
  if (d === "الثلاثاء") return "tuesday";
  if (d === "الأربعاء" || d === "الاربعاء") return "wednesday";
  if (d === "الخميس") return "thursday";
  if (d === "الجمعة") return "friday";
  if (d === "السبت") return "saturday";
  if (d === "الأحد" || d === "الاحد") return "sunday";

  return d; // Return as is if already a key or unknown
};

// Removed isTeacherAvailable as per request to delete teacher logic

export default function FreeTimetableManagement({
  centerId,
  refreshKey,
  onScheduleChangeAction,
  readOnly = false,
}: {
  centerId?: string;
  refreshKey?: number;
  onScheduleChangeAction?: () => void;
  readOnly?: boolean;
}) {
  // Translate using the 'TimetableManagement' namespace
  const t = useTranslations("TimetableManagement");
  const { daysOfWeek } = useLocalizedConstants();
  // Allow editing for guests locally, or restrict to admin if desired.
  // For now, let's allow everyone to edit since it's local-only data.
  const effectiveReadOnly = readOnly;

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{
    day: string;
    startTime: string;
    endTime: string;
  } | null>(null);

  const [newEntry, setNewEntry] = useState({
    name: "",
  });

  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [selectedScheduleDetails, setSelectedScheduleDetails] =
    useState<ScheduleSlot | null>(null);

  const isSubmittingRef = useRef(false);

  const queryData = useLiveQuery(async () => {
    try {
      // Allow guests to see the schedule even if not logged in

      // ✅ Fetch from local DB
      const [allSchedules, allCenters] = await Promise.all([
        timeTableActions.getAll(),
        centerActions.getAll(),
      ]);

      // 2. Filter schedules (simplified for local mode)
      const filteredSchedules = allSchedules;

      // ✅ Transform schedules to match ScheduleSlot interface
      const scheduleSlots: ScheduleSlot[] = filteredSchedules.map((s: any) => ({
        id: s.id,
        day: normalizeDayKey(s.day),
        startTime: s.startTime,
        endTime: s.endTime,
        name: s.name || s.title || "N/A",
      }));

      return {
        schedule: scheduleSlots,
      };
    } catch (err) {
      console.error("Failed to fetch timetable data:", err);
      return null;
    }
  }, [centerId, refreshKey]);

  const schedule = queryData?.schedule || [];
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSlotClick = (dayKey: string, startTime: string) => {
    if (readOnly) return;
    const endTimeIndex = TIME_SLOTS.indexOf(startTime) + 1;
    const endTime = TIME_SLOTS[endTimeIndex] || "18:00";

    setSelectedSlot({ day: dayKey, startTime, endTime });

    setNewEntry({
      name: "",
    });

    setError("");
    setIsDialogOpen(true);
  };

  const [conflictingScheduleIds, setConflictingScheduleIds] = useState<
    string[]
  >([]);

  const handleAddSchedule = async (force = false) => {
    if (isSubmittingRef.current) return;

    if (!selectedSlot) {
      setError(t("errorFillAllFields"));
      return;
    }

    // Allow guests to add to their local schedule

    isSubmittingRef.current = true;
    setIsSaving(true);
    try {
      // ✅ Check for conflicts in local DB
      const allSchedules = await timeTableActions.getAll();
      const activeSchedules = allSchedules;

      // Check for any conflict in the same slot (same day, same time)
      const slotConflict = activeSchedules.find(
        (s: any) =>
          normalizeDayKey(s.day) === normalizeDayKey(selectedSlot.day) &&
          s.startTime === selectedSlot.startTime &&
          (centerId ? s.centerId === centerId : true),
      );

      if (slotConflict && !force) {
        setConflictingScheduleIds([slotConflict.id!].filter(Boolean));
        setError(t("roomConflict") + " " + t("overwritePrompt")); // Keep roomConflict translation key or use a new one
        setIsSaving(false);
        return;
      }

      // ✅ If force is true, delete conflicting schedules first
      if (force && conflictingScheduleIds.length > 0) {
        for (const id of conflictingScheduleIds) {
          await timeTableActions.delete(id);
        }
        setConflictingScheduleIds([]);
      }

      // ✅ Create schedule in local DB
      const now = Date.now();
      const scheduleId = generateObjectId();
      const newSchedule = {
        id: scheduleId,
        day: normalizeDayKey(selectedSlot.day),
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
        name: newEntry.name,
        centerId: centerId || undefined,
        createdAt: now,
        updatedAt: now,
      };

      await timeTableActions.save(newSchedule);

      setIsDialogOpen(false);
      setNewEntry({ name: "" });
      setError("");
      setConflictingScheduleIds([]); // Clear conflicts
      onScheduleChangeAction?.();
    } catch (err) {
      setError(t("errorAddSchedule"));
    } finally {
      setIsSaving(false);
      isSubmittingRef.current = false;
    }
  };

  const handleDeleteSchedule = async (scheduleId: string) => {
    try {
      await timeTableActions.delete(scheduleId);
      onScheduleChangeAction?.();
    } catch (err) {
      setError(t("errorDeleteSchedule"));
    }
  };

  const handleExportExcel = async () => {
    try {
      // Dynamically import ExcelJS only when needed (~1MB, not needed on initial load)
      const ExcelJS = (await import("exceljs")).default;
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Timetable");

      // Set columns
      const headerRow = ["Time", ...daysOfWeek.map((day: any) => day.label)];
      worksheet.addRow(headerRow);

      // Apply styling to header
      const firstRow = worksheet.getRow(1);
      firstRow.font = { bold: true };
      firstRow.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFE0E0E0" },
      };
      firstRow.alignment = { horizontal: "center", vertical: "middle" };

      // Add data rows
      TIME_SLOTS.slice(0, -1).forEach((time, index) => {
        const timeLabel = `${time} - ${TIME_SLOTS[index + 1]}`;
        const rowData = [timeLabel];

        daysOfWeek.forEach((day: any) => {
          const slots = getSlotsByDayAndTime(day.key, time);
          if (slots.length > 0) {
            const cellText = slots
              .map((slot: any) => {
                return `${slot.name || "N/A"}`;
              })
              .join("\n");
            rowData.push(cellText);
          } else {
            rowData.push("");
          }
        });

        const addedRow = worksheet.addRow(rowData);
        addedRow.alignment = { wrapText: true, vertical: "top" };
      });

      // Simple column widths
      worksheet.columns.forEach((col, idx) => {
        col.width = idx === 0 ? 15 : 25;
      });

      // Add borders
      worksheet.eachRow((row) => {
        row.eachCell((cell) => {
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
        });
      });

      // Write to buffer and download
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Timetable_${new Date().toISOString().split("T")[0]}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError("Failed to export Excel file");
    }
  };

  const handleViewDetails = (slot: ScheduleSlot) => {
    setSelectedScheduleDetails(slot);
    setIsDetailsDialogOpen(true);
  };

  const filteredSchedule = schedule;

  const getSlotsByDayAndTime = (dayKey: string, time: string) => {
    return filteredSchedule.filter(
      (s: any) =>
        normalizeDayKey(s.day) === normalizeDayKey(dayKey) &&
        s.startTime === time,
    );
  };

  // Show loading while data is fetching
  if (queryData === undefined) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <>
      {/* Print-only global style injected once */}
      <style>{`
        @media print {
          body > *:not(#timetable-print-root) { display: none !important; }
          #timetable-print-root { display: block !important; }
          .no-print { display: none !important; }
          .print-grid { break-inside: avoid; }
        }
      `}</style>

      <div id="timetable-print-root" className="space-y-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 no-print">
        <div>
          <h2 className="text-2xl font-bold">{t("title")}</h2>
          <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="default"
            onClick={handleExportExcel}
            className="flex items-center gap-2"
          >
            <FileSpreadsheet className="h-4 w-4" />
            {t("exportExcel")}
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            {conflictingScheduleIds.length > 0 && (
              <Button
                variant="destructive"
                size="sm"
                className="ml-4 bg-red-700 hover:bg-red-800"
                onClick={() => handleAddSchedule(true)} // Force overwrite
              >
                {t("overwrite") || "Overwrite"}
              </Button>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Timetable Grid */}
      <Card>
        <CardHeader>
          <CardTitle>{t("weeklySchedule")}</CardTitle>
          <CardDescription>
            {effectiveReadOnly
              ? t("weeklyScheduleReadOnly") || "Weekly Schedule (Read Only)"
              : t("weeklyScheduleDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="max-h-[70vh] overflow-auto relative border rounded-lg">
            <div className="min-w-[1200px] p-2">
              {/* Header Row */}
              <div className="grid grid-cols-8 gap-2 mb-2 sticky top-0 z-30 bg-background/95 backdrop-blur-xs pt-2 pb-2 border-b">
                {/* Time column header — sticks to the start edge (right in RTL, left in LTR) */}
                <div className="font-semibold text-sm text-muted-foreground p-2 border rounded-md sticky start-0 ltr:left-0 rtl:right-0 bg-background z-40 shadow-xs">
                  {t("time")}
                </div>
                {daysOfWeek.map((day: any) => (
                  <div
                    key={day.key}
                    className="font-semibold text-sm text-center p-2 bg-primary/10 rounded-md"
                  >
                    {day.label}
                  </div>
                ))}
              </div>

              {/* Time Slots */}
              <div className="space-y-2">
                {TIME_SLOTS.slice(0, -1).map((time, timeIndex) => (
                  <div key={time} className="grid grid-cols-8 gap-2">
                    {/* Time label — sticks to the start edge in both LTR and RTL */}
                    <div className="flex items-center justify-center text-sm font-medium text-muted-foreground p-2 border rounded-md sticky start-0 ltr:left-0 rtl:right-0 bg-background z-10">
                      <Clock className="h-3 w-3 me-1" />
                      {time} - {TIME_SLOTS[timeIndex + 1]}
                    </div>

                    {/* Day  */}
                    {daysOfWeek.map((day: any) => {
                      const slots = getSlotsByDayAndTime(day.key, time);

                      return (
                        <div
                          key={`${day.key}-${time}`}
                          onClick={() =>
                            !effectiveReadOnly && handleSlotClick(day.key, time)
                          }
                          className={cn(
                            "min-h-[100px] p-2 border-2 rounded-md transition-all",
                            !effectiveReadOnly && "cursor-pointer hover:border-primary hover:bg-primary/5",
                            slots.length === 0 && "bg-muted/30",
                          )}
                        >
                          <div className="space-y-1">
                            {slots.map((slot, idx) => (
                              <div
                                key={slot.id || idx}
                                className={cn(
                                  "p-2 border-2 rounded-lg text-xs space-y-2 group relative shadow-sm cursor-pointer transition-opacity hover:opacity-80",
                                  getSlotColorClass(slot.name),
                                )}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewDetails(slot);
                                }}
                              >
                                <div className="flex justify-between items-start">
                                  <Badge
                                    variant="secondary"
                                    className="text-xs font-semibold px-2 py-1 border-0 bg-transparent text-inherit"
                                  >
                                    {slot.name}
                                  </Badge>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Schedule Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("addClassSchedule")}</DialogTitle>
            <DialogDescription>
              {selectedSlot && (
                <>
                  {daysOfWeek.find((d: any) => d.key === selectedSlot.day)
                    ?.label || selectedSlot.day}
                  , {selectedSlot.startTime} - {selectedSlot.endTime}
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          {error && (
            <Alert variant="destructive">
              <AlertDescription className="flex items-center justify-between">
                <span>{error}</span>
                {conflictingScheduleIds.length > 0 && (
                  <Button
                    variant="destructive"
                    size="sm"
                    className="ml-4 bg-red-700 hover:bg-red-800"
                    onClick={() => handleAddSchedule(true)} // Force overwrite
                  >
                    {t("overwrite") || "Overwrite"}
                  </Button>
                )}
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{t("registerName") || "Register Name"}</Label>
              <Input
                value={newEntry.name}
                onChange={(e) =>
                  setNewEntry((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder={
                  t("registerNamePlaceholder") || "Enter Register Name"
                }
              />
            </div>


          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isSaving}
            >
              {t("cancel")}
            </Button>
            <Button
              onClick={() => handleAddSchedule(false)}
              disabled={isSaving}
            >
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t("addToSchedule")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {t("scheduleDetails") || "Schedule Details"}
            </DialogTitle>
            <DialogDescription>
              {selectedScheduleDetails && (
                <>
                  {daysOfWeek.find(
                    (d: any) =>
                      d.key === normalizeDayKey(selectedScheduleDetails.day),
                  )?.label || selectedScheduleDetails.day}
                  , {selectedScheduleDetails.startTime} -{" "}
                  {selectedScheduleDetails.endTime}
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          {selectedScheduleDetails && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-semibold">
                  {t("registerName") || "Register Name"}
                </Label>
                <div className="p-3 bg-muted rounded-md capitalize">
                  <span>{selectedScheduleDetails.name}</span>
                </div>
              </div>



              <div className="space-y-2">
                <Label className="text-sm font-semibold">{t("time")}</Label>
                <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {selectedScheduleDetails.startTime} -{" "}
                    {selectedScheduleDetails.endTime}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold">
                  {t("day") || "Day"}
                </Label>
                <div className="p-3 bg-muted rounded-md">
                  <span>
                    {daysOfWeek.find(
                      (d: any) =>
                        d.key === normalizeDayKey(selectedScheduleDetails.day),
                    )?.label || selectedScheduleDetails.day}
                  </span>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex justify-between items-center w-full sm:justify-between">
            {!effectiveReadOnly && selectedScheduleDetails?.id && (
              <Button
                variant="destructive"
                onClick={() => {
                  if (selectedScheduleDetails.id) {
                    handleDeleteSchedule(selectedScheduleDetails.id);
                    setIsDetailsDialogOpen(false);
                  }
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {t("delete") || "Delete"}
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => setIsDetailsDialogOpen(false)}
            >
              {t("close") || "Close"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  </>
);
}
