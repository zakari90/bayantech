"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useLocale } from "next-intl";
import {
  Gauge,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Search,
  Save,
  Check,
  TrendingUp,
  Clock,
  AlertCircle,
  ShieldAlert,
  Info,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  getMembers,
  getReadingsForMonth,
  getPreviousIndexForMember,
  saveOrUpdateReading,
  getSettings,
  getAllMembersSummaries,
  formatCurrency,
  centimesToMad,
  calculateConsumption,
  calculateBillAmount,
} from "@/app/waterdexiedb";
import { Member, Reading, WaterSettings } from "@/app/waterdexiedb/types";
import { toast } from "sonner";

interface MeterRowState {
  member: Member;
  previousIndex: number;
  fromPreviousReading: boolean;
  previousReadingMonth?: string;
  monthsElapsed: number;
  unpaidBalanceCentimes: number;
  existingReading?: Reading;
  currentIndexInput: string;
  consumption: number;
  billAmountCentimes: number;
  isInvalid: boolean; // if new index < previous index
  isSaved: boolean;
}

interface ConfirmationTarget {
  member: Member;
  row: MeterRowState;
  newIndex: number;
  reasons: string[];
}

export default function MonthlyReadingsPage() {
  const locale = useLocale();
  const isRtl = locale === "ar";

  // Selected Month formatted as "YYYY-MM"
  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  });

  const [settings, setSettings] = useState<WaterSettings | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [readingsMap, setReadingsMap] = useState<Map<string, Reading>>(new Map());
  const [rows, setRows] = useState<MeterRowState[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Dialog state for confirming out-of-period or irregular readings
  const [confirmTarget, setConfirmTarget] = useState<ConfirmationTarget | null>(null);
  const [suppressLateSessionWarning, setSuppressLateSessionWarning] = useState<boolean>(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [allMembers, monthReadings, setts, summaries] = await Promise.all([
        getMembers(true), // active members
        getReadingsForMonth(selectedMonth),
        getSettings(),
        getAllMembersSummaries(),
      ]);

      setSettings(setts);
      setMembers(allMembers);

      const balanceMap = new Map<string, number>();
      for (const s of summaries) {
        if (s.balance > 0) {
          balanceMap.set(s.member.id, s.balance);
        }
      }

      const rMap = new Map<string, Reading>();
      for (const r of monthReadings) {
        rMap.set(r.memberId, r);
      }
      setReadingsMap(rMap);

      // Compute row states with previous index resolution and gap detection
      const rowPromises = allMembers.map(async (m) => {
        const existing = rMap.get(m.id);
        const { previousIndex, fromPreviousReading, previousReadingMonth, monthsElapsed } =
          await getPreviousIndexForMember(m, selectedMonth);

        const currentVal = existing ? String(existing.index) : "";
        const numericCurrent = existing ? existing.index : previousIndex;

        const { consumption, isInvalid } = existing
          ? { consumption: existing.consumption, isInvalid: false }
          : calculateConsumption(numericCurrent, previousIndex);

        const bill = existing
          ? existing.billAmount
          : calculateBillAmount(consumption, setts.pricePerM3, setts.fixedFee);

        return {
          member: m,
          previousIndex,
          fromPreviousReading,
          previousReadingMonth,
          monthsElapsed: monthsElapsed || 1,
          unpaidBalanceCentimes: balanceMap.get(m.id) || 0,
          existingReading: existing,
          currentIndexInput: currentVal,
          consumption,
          billAmountCentimes: bill,
          isInvalid: existing ? false : false,
          isSaved: !!existing,
        } as MeterRowState;
      });

      const resolvedRows = await Promise.all(rowPromises);
      setRows(resolvedRows);
    } catch (err) {
      console.error(err);
      toast.error(isRtl ? "فشل تحميل قراءات الشهر" : "Failed to load readings");
    } finally {
      setLoading(false);
    }
  }, [selectedMonth, isRtl]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle Input Change for a member
  const handleInputChange = (memberId: string, val: string) => {
    setRows((prev) =>
      prev.map((row) => {
        if (row.member.id !== memberId) return row;

        if (val.trim() === "") {
          return {
            ...row,
            currentIndexInput: "",
            consumption: 0,
            billAmountCentimes: 0,
            isInvalid: false,
            isSaved: false,
          };
        }

        const numVal = parseFloat(val);
        const { consumption, isInvalid } = calculateConsumption(
          isNaN(numVal) ? row.previousIndex : numVal,
          row.previousIndex
        );

        const bill = calculateBillAmount(
          consumption,
          settings?.pricePerM3 || 500,
          settings?.fixedFee || 1000
        );

        return {
          ...row,
          currentIndexInput: val,
          consumption,
          billAmountCentimes: bill,
          isInvalid,
          isSaved: false,
        };
      })
    );
  };

  // Schedule & Period Analysis
  const now = new Date();
  const currentYearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const currentDay = now.getDate();
  const startDay = settings?.readingStartDay ?? 24;
  const endDay = settings?.readingEndDay ?? 27;
  const verifDay = settings?.verificationDay ?? 28;

  const isCurrentMonth = selectedMonth === currentYearMonth;
  const isPastMonth = selectedMonth < currentYearMonth;
  const isFutureMonth = selectedMonth > currentYearMonth;

  const isReadingPeriodPassed = isPastMonth || (isCurrentMonth && currentDay > endDay);
  const isReadingPeriodActive = isCurrentMonth && currentDay >= startDay && currentDay <= endDay;
  const isVerificationDay = isCurrentMonth && currentDay === verifDay;

  // Trigger Save with Period & Consistency Verification
  const handleTriggerSave = (memberId: string) => {
    const row = rows.find((r) => r.member.id === memberId);
    if (!row || row.currentIndexInput.trim() === "") return;

    const num = parseFloat(row.currentIndexInput);
    if (isNaN(num)) return;

    // Skip if already saved with the exact same value
    if (row.existingReading && row.existingReading.index === num && row.isSaved) {
      return;
    }

    // Determine warning reasons that require confirmation
    const reasons: string[] = [];

    // Reason 1: Index is smaller than previous
    if (num < row.previousIndex) {
      reasons.push(
        isRtl
          ? `الرقم المدخل (${num}) أصغر من قراءة العداد السابقة (${row.previousIndex} m³)`
          : `Entered index (${num}) is lower than previous index (${row.previousIndex} m³)`
      );
    }

    // Reason 2: Skipped Month / Irregular period gap (> 1 month elapsed)
    if (row.monthsElapsed > 1) {
      reasons.push(
        isRtl
          ? `انقطاع القراءات: انقضت ${row.monthsElapsed} أشهر منذ آخر قراءة (${row.previousReadingMonth ? `شهر ${row.previousReadingMonth}` : "تاريخ التسجيل"}). الاستهلاك الحالي يغطي أكثر من فترة شهرية واحدة.`
          : `Period gap: ${row.monthsElapsed} months elapsed since last reading (${row.previousReadingMonth || "start"}). Current consumption spans multiple periods.`
      );
    }

    // Reason 3: Reading taken outside the official 24-27 period
    if (isReadingPeriodPassed && !suppressLateSessionWarning) {
      reasons.push(
        isRtl
          ? `انتهت الفترة الرسمية للقراءات (المحددة من يوم ${startDay} إلى ${endDay}). القراءة المسجلة الآن تعتبر خارج الفترة المقررة.`
          : `Official reading period (${startDay}-${endDay}) has ended. This reading is recorded outside the scheduled window.`
      );
    }

    // Reason 4: Retroactive entry for past month
    if (isPastMonth && !suppressLateSessionWarning) {
      reasons.push(
        isRtl
          ? `أنت تقوم بتسجيل قراءة بأثر رجعي لشهر سابق (${selectedMonth})`
          : `Retroactive reading entry for a past month (${selectedMonth})`
      );
    }

    // If warnings exist, open the Confirmation Prompt!
    if (reasons.length > 0) {
      setConfirmTarget({
        member: row.member,
        row,
        newIndex: num,
        reasons,
      });
      return;
    }

    // Otherwise save immediately
    executeSave(row, num, false);
  };

  // Perform actual database write
  const executeSave = async (row: MeterRowState, num: number, wasConfirmed: boolean) => {
    try {
      const isLate = isReadingPeriodPassed || row.monthsElapsed > 1;
      const note = isLate
        ? `تم التسجيل بتاريخ ${new Date().toLocaleDateString(locale === "ar" ? "ar-MA" : "fr-FR")}${row.monthsElapsed > 1 ? ` (فترة متأخرة ${row.monthsElapsed} أشهر)` : ""}`
        : undefined;

      const saved = await saveOrUpdateReading({
        member: row.member,
        month: selectedMonth,
        index: num,
        notes: note,
      });

      setRows((prev) =>
        prev.map((r) =>
          r.member.id === row.member.id
            ? { ...r, existingReading: saved, isSaved: true }
            : r
        )
      );

      toast.success(
        isRtl
          ? `تم حفظ قراءة ${row.member.name} (${saved.consumption} m³ = ${centimesToMad(saved.billAmount)} درهم)`
          : `Saved reading for ${row.member.name}`
      );
    } catch (err) {
      toast.error(isRtl ? "حدث خطأ أثناء الحفظ" : "Save failed");
    } finally {
      setConfirmTarget(null);
    }
  };

  // Filtered rows for fast search
  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (r) =>
        r.member.name.toLowerCase().includes(q) ||
        r.member.meterNumber.toLowerCase().includes(q) ||
        (r.member.sector && r.member.sector.toLowerCase().includes(q))
    );
  }, [rows, search]);

  // Progress metrics
  const completedCount = rows.filter((r) => r.existingReading !== undefined || r.isSaved).length;
  const totalCount = rows.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const totalMonthVolume = rows.reduce((acc, r) => acc + (r.existingReading?.consumption || 0), 0);
  const totalMonthBilled = rows.reduce((acc, r) => acc + (r.existingReading?.billAmount || 0), 0);
  const gapCount = rows.filter((r) => r.monthsElapsed > 1).length;
  const arrearsCount = rows.filter((r) => r.unpaidBalanceCentimes > 0).length;

  return (
    <div className="space-y-4 animate-in fade-in-50 duration-300">
      {/* Month Selector Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-card border shadow-2xs">
        <div>
          <div className="text-xs text-muted-foreground font-semibold flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-cyan-600" />
            <span>{isRtl ? "فترة استهلاك الماء" : "Billing Period"}</span>
            {settings?.creationDate && (
              <span className="text-[10px] text-muted-foreground/80 font-normal">
                ({isRtl ? `تاريخ التأسيس: ${settings.creationDate}` : `Founded: ${settings.creationDate}`})
              </span>
            )}
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-foreground mt-0.5">
            {selectedMonth}
          </h1>
        </div>
      </div>

      {/* Monthly Reading Period & Timing Status Banner */}
      {settings && (
        <div
          className={`px-4 py-3 rounded-2xl border shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs transition-colors ${
            isReadingPeriodPassed
              ? "bg-amber-500/10 border-amber-500/30 text-amber-900 dark:text-amber-200"
              : isVerificationDay
              ? "bg-amber-500/15 border-amber-500/40 text-amber-900 dark:text-amber-200"
              : isReadingPeriodActive
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-900 dark:text-emerald-200"
              : "bg-card border-border text-foreground"
          }`}
        >
          <div className="flex items-start sm:items-center gap-2.5">
            <div
              className={`p-2 rounded-xl shrink-0 ${
                isReadingPeriodPassed
                  ? "bg-amber-500/20 text-amber-700 dark:text-amber-300"
                  : isVerificationDay
                  ? "bg-amber-500/20 text-amber-700 dark:text-amber-300"
                  : isReadingPeriodActive
                  ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300"
                  : "bg-cyan-500/15 text-cyan-700 dark:text-cyan-300"
              }`}
            >
              {isReadingPeriodPassed ? (
                <AlertTriangle className="h-4 w-4" />
              ) : (
                <Calendar className="h-4 w-4" />
              )}
            </div>

            <div>
              <span className="font-bold text-sm block">
                {isVerificationDay
                  ? isRtl
                    ? "🔍 اليوم هو يوم المراقبة والتحقق من العدادات والمطابقة (يوم 28)"
                    : "Verification Day in progress (28th)"
                  : isReadingPeriodActive
                  ? isRtl
                    ? "🟢 جارية الآن فترة القراءة الشهرية الرسمية للعدادات"
                    : "Reading period active"
                  : isReadingPeriodPassed
                  ? isRtl
                    ? "⚠️ تنبيه: انتهت الفترة الرسمية للقراءات (24-27)"
                    : "Official reading period (24-27) has ended"
                  : isRtl
                  ? `فترة القراءة الشهرية تبدأ يوم ${startDay} من كل شهر`
                  : `Monthly reading begins on day ${startDay}`}
              </span>

              <span className="text-[11px] opacity-90 block mt-0.5">
                {isReadingPeriodPassed
                  ? isRtl
                    ? `انقضت فترة القراءة المقررة (من يوم ${startDay} إلى ${endDay}). القراءات المدخلة الآن متأخرة وتتطلب تأكيداً لضمان احتساب نفس الفترة لكل منخرط.`
                    : `The scheduled period (${startDay}-${endDay}) has passed. Readings entered now will require confirmation to ensure consistent billing intervals.`
                  : isRtl
                  ? `فترة القراءة: من يوم ${startDay} إلى ${endDay} (3 أيام) • يوم المراقبة: ${verifDay} من كل شهر`
                  : `Reading: Day ${startDay} to ${endDay} (3 days) • Verification: Day ${verifDay}`}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 self-start sm:self-auto">
            <Badge
              variant="outline"
              className="text-[10px] font-semibold border-cyan-500/30 text-cyan-700 dark:text-cyan-300 bg-cyan-500/10 py-0.5"
            >
              {isRtl ? `فترة القراءة: ${startDay}-${endDay}` : `Reading: ${startDay}-${endDay}`}
            </Badge>

            <Badge
              variant="outline"
              className="text-[10px] font-semibold border-amber-500/30 text-amber-700 dark:text-amber-300 bg-amber-500/10 py-0.5"
            >
              {isRtl ? `المراقبة: يوم ${verifDay}` : `Verification: Day ${verifDay}`}
            </Badge>

            {gapCount > 0 && (
              <Badge
                variant="outline"
                className="text-[10px] font-semibold border-amber-500/40 text-amber-700 dark:text-amber-300 bg-amber-500/15 py-0.5"
              >
                {isRtl ? `${gapCount} عداد به انقطاع` : `${gapCount} with period gaps`}
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Progress & Live Month Statistics */}
      <Card className="border shadow-2xs">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-foreground">
                {isRtl ? "نسبة إدخال العدادات:" : "Progress:"}
              </span>
              <span className="font-mono font-bold text-cyan-600 dark:text-cyan-400">
                {completedCount} / {totalCount}
              </span>
            </div>
            <span className="font-bold text-muted-foreground">{progressPercent}%</span>
          </div>

          <Progress value={progressPercent} className="h-2.5 rounded-full" />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 border-t text-xs">
            <div>
              <span className="text-muted-foreground text-[11px]">
                {isRtl ? "مجموع استهلاك الشهر:" : "Total Consumption:"}
              </span>
              <span className="font-bold text-foreground block font-mono">
                {totalMonthVolume} m³
              </span>
            </div>

            <div>
              <span className="text-muted-foreground text-[11px]">
                {isRtl ? "مجموع فواتير الشهر:" : "Total Month Billed:"}
              </span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 block font-mono">
                {formatCurrency(totalMonthBilled, locale)}
              </span>
            </div>

            <div>
              <span className="text-muted-foreground text-[11px]">
                {isRtl ? "عدادات ذات فترات منقطعة:" : "Period Gaps:"}
              </span>
              <span className="font-bold text-amber-600 dark:text-amber-400 block font-mono">
                {gapCount} {isRtl ? "عداد" : "meters"}
              </span>
            </div>

            <div className="text-end">
              <span className="text-muted-foreground text-[11px]">
                {isRtl ? "منخرطون بديون سابقة:" : "Members with Arrears:"}
              </span>
              <span className="font-bold text-rose-600 dark:text-rose-400 block font-mono">
                {arrearsCount} {isRtl ? "منخرط" : "members"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search Input for Meter sequence */}
      <div className="relative">
        <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={isRtl ? "ابحث برقم العداد أو اسم المنخرط..." : "Filter by meter no or subscriber..."}
          className="ps-9 h-10 rounded-xl text-xs bg-card"
        />
      </div>

      {/* Meter Reading Rows */}
      {filteredRows.length === 0 ? (
        <div className="p-8 text-center border-2 border-dashed rounded-2xl bg-card">
          <Gauge className="h-10 w-10 mx-auto text-muted-foreground/50 mb-2" />
          <p className="text-xs text-muted-foreground">
            {isRtl ? "لا توجد عدادات مطابقة" : "No matching meters"}
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredRows.map((row) => (
            <div
              key={row.member.id}
              className={`p-3 sm:p-4 rounded-2xl border transition-all ${
                row.isSaved
                  ? "bg-card border-border"
                  : row.isInvalid
                  ? "bg-rose-500/5 border-rose-500/30"
                  : row.monthsElapsed > 1
                  ? "bg-amber-500/5 border-amber-500/30"
                  : "bg-card border-border/80"
              }`}
            >
              {/* Row Header: Member Name, Meter Number, Badges */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="h-9 w-9 rounded-xl bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 font-mono font-bold flex items-center justify-center text-xs shrink-0">
                    {row.member.meterNumber}
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-sm text-foreground truncate">
                      {row.member.name}
                    </div>
                    <div className="text-[11px] text-muted-foreground flex items-center gap-2">
                      <span>
                        {isRtl ? "السابق:" : "Prev:"}{" "}
                        <span className="font-mono font-semibold">{row.previousIndex} m³</span>
                      </span>
                      {row.previousReadingMonth && (
                        <span className="text-[10px] text-muted-foreground/80">
                          ({row.previousReadingMonth})
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Status Badges & Alerts */}
                <div className="flex flex-wrap items-center gap-1.5 self-start sm:self-auto">
                  {/* Period Gap Alert Badge */}
                  {row.monthsElapsed > 1 && (
                    <Badge
                      variant="outline"
                      className="bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30 text-[10px] py-0.5 font-medium flex items-center gap-1"
                      title={
                        isRtl
                          ? `انقضت ${row.monthsElapsed} أشهر منذ آخر قراءة مسجلة`
                          : `${row.monthsElapsed} months elapsed since last reading`
                      }
                    >
                      <AlertTriangle className="h-3 w-3 shrink-0" />
                      <span>{isRtl ? `انقطاع (+${row.monthsElapsed} أشهر)` : `Gap (+${row.monthsElapsed} mos)`}</span>
                    </Badge>
                  )}

                  {/* Unpaid Prior Arrears Badge */}
                  {row.unpaidBalanceCentimes > 0 && (
                    <Badge
                      variant="outline"
                      className="bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/30 text-[10px] py-0.5 font-medium flex items-center gap-1"
                      title={isRtl ? "ديون سابقة مستحقة على المنخرط" : "Previous unpaid balance"}
                    >
                      <Clock className="h-3 w-3 shrink-0" />
                      <span>
                        {isRtl ? `متأخرات: ${formatCurrency(row.unpaidBalanceCentimes, locale)}` : `Arrears: ${formatCurrency(row.unpaidBalanceCentimes, locale)}`}
                      </span>
                    </Badge>
                  )}

                  {/* Saved Status Badge */}
                  {row.isSaved ? (
                    <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-[11px] py-0.5">
                      <Check className="h-3 w-3 me-1" />
                      <span>{isRtl ? "مسجل" : "Saved"}</span>
                    </Badge>
                  ) : (
                    <span className="text-[11px] text-muted-foreground">
                      {isRtl ? "في الانتظار" : "Pending"}
                    </span>
                  )}
                </div>
              </div>

              {/* Input & Live Consumption Grid */}
              <div className="grid grid-cols-12 gap-2 items-center pt-2 border-t border-border/50">
                {/* Input for new index */}
                <div className="col-span-5 sm:col-span-4">
                  <div className="relative">
                    <Input
                      type="number"
                      step="1"
                      min="0"
                      inputMode="decimal"
                      value={row.currentIndexInput}
                      onChange={(e) => handleInputChange(row.member.id, e.target.value)}
                      onBlur={() => handleTriggerSave(row.member.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          (e.target as HTMLInputElement).blur();
                        }
                      }}
                      placeholder={String(row.previousIndex)}
                      className={`h-11 font-mono text-base font-bold text-center rounded-xl transition-colors ${
                        row.isInvalid
                          ? "border-rose-500 text-rose-600 focus-visible:ring-rose-500"
                          : row.monthsElapsed > 1
                          ? "border-amber-500/70 text-amber-700 dark:text-amber-300 focus-visible:ring-amber-500"
                          : "border-primary/50 text-foreground"
                      }`}
                    />
                  </div>
                </div>

                {/* Consumption m³ */}
                <div className="col-span-3 sm:col-span-3 text-center">
                  <span className="text-[10px] text-muted-foreground block">
                    {isRtl ? "الاستهلاك" : "Usage"}
                  </span>
                  <span className="font-bold text-sm font-mono text-cyan-600 dark:text-cyan-400">
                    {row.consumption} m³
                  </span>
                </div>

                {/* Bill Amount in MAD */}
                <div className="col-span-4 sm:col-span-3 text-end sm:text-center">
                  <span className="text-[10px] text-muted-foreground block">
                    {isRtl ? "الفاتورة" : "Bill"}
                  </span>
                  <span className="font-bold text-sm text-foreground font-mono">
                    {formatCurrency(row.billAmountCentimes, locale)}
                  </span>
                </div>

                {/* Direct Save Action Button for Desktop & Mobile */}
                <div className="col-span-12 sm:col-span-2 flex justify-end pt-1 sm:pt-0">
                  <Button
                    size="sm"
                    variant={row.isSaved ? "outline" : "default"}
                    onClick={() => handleTriggerSave(row.member.id)}
                    disabled={!row.currentIndexInput.trim()}
                    className={`w-full sm:w-auto h-9 px-3 rounded-xl text-xs font-semibold cursor-pointer ${
                      row.isSaved
                        ? "border-border text-muted-foreground hover:bg-muted"
                        : "bg-cyan-600 hover:bg-cyan-700 text-white shadow-xs"
                    }`}
                  >
                    {row.isSaved ? (
                      <>
                        <Check className="h-3.5 w-3.5 me-1 text-emerald-500" />
                        <span>{isRtl ? "مُحفظ" : "Saved"}</span>
                      </>
                    ) : (
                      <>
                        <Save className="h-3.5 w-3.5 me-1" />
                        <span>{isRtl ? "حفظ" : "Save"}</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Lower index warning message below row */}
              {row.isInvalid && (
                <div className="mt-2 text-[11px] text-rose-600 dark:text-rose-400 flex items-center gap-1 font-semibold">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  <span>
                    {isRtl
                      ? "القراءة المدخلة أصغر من قراءة العداد السابقة!"
                      : "New index is lower than previous reading!"}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Prompt Dialog for Out-of-Period or Irregular Readings */}
      <AlertDialog
        open={!!confirmTarget}
        onOpenChange={(open) => {
          if (!open) setConfirmTarget(null);
        }}
      >
        <AlertDialogContent className="max-w-md rounded-3xl p-5 border-border shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-base font-bold">
              <AlertTriangle className="h-5 w-5 shrink-0" />
              <span>{isRtl ? "تأكيد تسجيل قراءة خارج الفترة المقررة" : "Confirm Out-of-Period Reading"}</span>
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-muted-foreground text-start">
              {isRtl
                ? "تم رصد تنبيه يخص الفترة الزمنية أو انتظام القراءة لهذا المنخرط. يرجى مراجعة التفاصيل قبل الاعتماد في السجل:"
                : "A timing or interval anomaly was detected for this member. Please review details before confirming:"}
            </AlertDialogDescription>
          </AlertDialogHeader>

          {confirmTarget && (
            <div className="space-y-3 py-2 text-xs">
              {/* Member Card */}
              <div className="p-3 rounded-2xl bg-muted/60 border border-border/80 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-foreground text-sm">{confirmTarget.member.name}</div>
                  <div className="text-muted-foreground font-mono mt-0.5">
                    {isRtl ? "عداد رقم:" : "Meter #:"} {confirmTarget.member.meterNumber}
                  </div>
                </div>
                <div className="text-end">
                  <div className="text-[11px] text-muted-foreground">{isRtl ? "القراءة السابقة:" : "Previous:"}</div>
                  <div className="font-mono font-bold text-foreground text-sm">
                    {confirmTarget.row.previousIndex} m³
                  </div>
                </div>
              </div>

              {/* Live Preview: New Index, Consumption, Bill */}
              <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-cyan-500/5 border border-cyan-500/20 text-center">
                <div>
                  <span className="text-[10px] text-muted-foreground block">{isRtl ? "القراءة المدخلة" : "New Index"}</span>
                  <span className="font-mono font-bold text-sm text-cyan-700 dark:text-cyan-400">
                    {confirmTarget.newIndex} m³
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-muted-foreground block">{isRtl ? "الاستهلاك" : "Consumption"}</span>
                  <span className="font-mono font-bold text-sm text-foreground">
                    {Math.max(0, confirmTarget.newIndex - confirmTarget.row.previousIndex)} m³
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-muted-foreground block">{isRtl ? "الفاتورة المقدرة" : "Bill Amount"}</span>
                  <span className="font-mono font-bold text-sm text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(
                      calculateBillAmount(
                        Math.max(0, confirmTarget.newIndex - confirmTarget.row.previousIndex),
                        settings?.pricePerM3 || 500,
                        settings?.fixedFee || 1000
                      ),
                      locale
                    )}
                  </span>
                </div>
              </div>

              {/* Warning Reasons List */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-foreground flex items-center gap-1">
                  <ShieldAlert className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                  <span>{isRtl ? "أسباب التنبيه:" : "Alert Reasons:"}</span>
                </span>
                <div className="space-y-1">
                  {confirmTarget.reasons.map((reason, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-800 dark:text-amber-300 text-[11px] font-medium leading-relaxed"
                    >
                      ⚠️ {reason}
                    </div>
                  ))}
                </div>
              </div>

              {/* Unpaid Arrears Notice if applicable */}
              {confirmTarget.row.unpaidBalanceCentimes > 0 && (
                <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-700 dark:text-rose-300 text-[11px] flex items-center gap-2 font-medium">
                  <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                  <span>
                    {isRtl
                      ? `تذكير بالأداء: هذا المنخرط عليه متأخرات سابقة بقيمة ${formatCurrency(confirmTarget.row.unpaidBalanceCentimes, locale)} لم تؤدَّ بعد.`
                      : `Payment reminder: This subscriber owes previous arrears of ${formatCurrency(confirmTarget.row.unpaidBalanceCentimes, locale)}.`}
                  </span>
                </div>
              )}

              {/* Checkbox to remember late period warning for the rest of this session */}
              {isReadingPeriodPassed && (
                <div className="pt-1 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="suppress-late"
                    checked={suppressLateSessionWarning}
                    onChange={(e) => setSuppressLateSessionWarning(e.target.checked)}
                    className="h-4 w-4 rounded border-border text-cyan-600 focus:ring-cyan-500 cursor-pointer"
                  />
                  <label htmlFor="suppress-late" className="text-[11px] text-muted-foreground cursor-pointer select-none">
                    {isRtl
                      ? "تأكيد واعتماد القراءات المتأخرة لباقي العدادات في هذه الجلسة"
                      : "Acknowledge late readings for the rest of this session"}
                  </label>
                </div>
              )}
            </div>
          )}

          <AlertDialogFooter className="gap-2 sm:gap-0 pt-2">
            <AlertDialogCancel className="h-10 rounded-xl text-xs font-semibold cursor-pointer">
              {isRtl ? "إلغاء / تصحيح الرقم" : "Cancel / Edit"}
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={() => {
                if (confirmTarget) {
                  executeSave(confirmTarget.row, confirmTarget.newIndex, true);
                }
              }}
              className="h-10 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs cursor-pointer"
            >
              {isRtl ? "تأكيد وحفظ القراءة" : "Confirm & Save Reading"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
