"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  Gauge,
  CreditCard,
  Droplets,
  TrendingDown,
  Wallet,
  AlertCircle,
  Users,
  MessageCircle,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  UserPlus,
  RefreshCw,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/watermanagemtcomponents/StatCard";
import { OnboardingDialog } from "@/components/watermanagemtcomponents/OnboardingDialog";
import { MemberDetailDialog } from "@/components/watermanagemtcomponents/MemberDetailDialog";
import { PaymentFormDialog } from "@/components/watermanagemtcomponents/PaymentFormDialog";
import { MemberFormDialog } from "@/components/watermanagemtcomponents/MemberFormDialog";
import { PrintableReceiptDialog } from "@/components/watermanagemtcomponents/PrintableReceiptDialog";
import {
  getSettings,
  getAllMembersSummaries,
  getExpenses,
  getPayments,
  formatCurrency,
  centimesToMad,
  generateWhatsAppReminderUrl,
  requestPersistentStorage,
  seedSampleVillageData,
} from "@/app/waterdexiedb";
import {
  MemberFinancialSummary,
  WaterSettings,
  Member,
  Payment,
} from "@/app/waterdexiedb/types";
import { toast } from "sonner";

export default function WaterAssociationDashboard() {
  const locale = useLocale();
  const isRtl = locale === "ar";

  const [settings, setSettings] = useState<WaterSettings | null>(null);
  const [summaries, setSummaries] = useState<MemberFinancialSummary[]>([]);
  const [totalExpensesCentimes, setTotalExpensesCentimes] = useState(0);
  const [totalCollectedCentimes, setTotalCollectedCentimes] = useState(0);
  const [recentPayments, setRecentPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  // Dialog States
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [selectedMemberIdForDetail, setSelectedMemberIdForDetail] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [preSelectedMemberForPayment, setPreSelectedMemberForPayment] = useState<string | undefined>(undefined);
  const [memberFormOpen, setMemberFormOpen] = useState(false);
  const [memberToEdit, setMemberToEdit] = useState<Member | null>(null);
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [receiptPayment, setReceiptPayment] = useState<Payment | null>(null);

  const loadAllData = useCallback(async () => {
    try {
      setLoading(true);
      await requestPersistentStorage();

      const [s, sums, exps, pays] = await Promise.all([
        getSettings(),
        getAllMembersSummaries(),
        getExpenses(),
        getPayments(),
      ]);

      setSettings(s);
      setSummaries(sums);

      if (!s.onboardingCompleted && sums.length === 0) {
        setOnboardingOpen(true);
      }

      const totalExp = exps.reduce((acc, e) => acc + (e.amount || 0), 0);
      setTotalExpensesCentimes(totalExp);

      const totalColl = pays.reduce((acc, p) => acc + (p.amount || 0), 0);
      setTotalCollectedCentimes(totalColl);

      setRecentPayments(pays.slice(0, 5));
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // Financial Computations
  const totalArrearsCentimes = summaries.reduce(
    (acc, s) => acc + Math.max(0, s.balance),
    0
  );
  const cashBalanceCentimes = totalCollectedCentimes - totalExpensesCentimes;

  // Filter members with debt (balance > 0), sorted descending by debt
  const membersWithArrears = summaries
    .filter((s) => s.balance > 0)
    .sort((a, b) => b.balance - a.balance);

  const handleOpenMember = (id: string) => {
    setSelectedMemberIdForDetail(id);
    setDetailOpen(true);
  };

  const handleOpenPayment = (memberId?: string) => {
    setPreSelectedMemberForPayment(memberId);
    setPaymentDialogOpen(true);
  };

  const handleWhatsAppReminder = (e: React.MouseEvent, s: MemberFinancialSummary) => {
    e.stopPropagation();
    if (!s.member.phone) {
      toast.error(isRtl ? "لا يوجد رقم هاتف مسجل لهذا المنخرط" : "No phone number registered");
      return;
    }
    const url = generateWhatsAppReminderUrl({
      phone: s.member.phone,
      memberName: s.member.name,
      meterNumber: s.member.meterNumber,
      associationName: settings?.associationName || "جمعية الماء",
      month: s.lastReading?.month || new Date().toISOString().substring(0, 7),
      consumptionM3: s.lastReading?.consumption,
      currentBillMAD: s.lastReading ? centimesToMad(s.lastReading.billAmount) : undefined,
      totalDueMAD: centimesToMad(s.balance),
      locale,
    });
    window.open(url, "_blank");
  };

  const handleOpenReceiptForPayment = (p: Payment) => {
    setReceiptPayment(p);
    setReceiptOpen(true);
  };

  const selectedMemberObj = summaries.find((s) => s.member.id === receiptPayment?.memberId)?.member;

  return (
    <div className="space-y-5 animate-in fade-in-50 duration-300">
      {/* Association Quick Welcome Banner */}
      <div className="rounded-2xl bg-linear-to-r from-blue-600 via-cyan-600 to-teal-600 p-4 sm:p-6 text-white shadow-lg shadow-cyan-900/10 relative overflow-hidden flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative z-10 space-y-1 sm:space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-[11px] font-semibold backdrop-blur-xs">
            <Droplets className="h-3.5 w-3.5" />
            <span>{settings?.villageName || (isRtl ? "تسيير شبكة الماء الصالح للشرب" : "Drinking Water Network")}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-tight">
            {settings?.associationName || (isRtl ? "جمعية مستخدمي مياه الشرب" : "Water Association")}
          </h2>
          <p className="text-xs text-white/80 max-w-lg leading-relaxed">
            {isRtl
              ? `تعريفة الماء: ${centimesToMad(settings?.pricePerM3 || 500)} درهم للمتر المكعب + ${centimesToMad(settings?.fixedFee || 1000)} درهم واجب الصيانة الشهري.`
              : `Tariff: ${centimesToMad(settings?.pricePerM3 || 500)} MAD/m³ + ${centimesToMad(settings?.fixedFee || 1000)} MAD fixed monthly fee.`}
          </p>
        </div>
        <div className="relative z-10 shrink-0">
          <Link href="/waterassociation/how-it-works">
            <Button
              variant="secondary"
              size="sm"
              className="w-full sm:w-auto h-9 px-3.5 text-xs font-bold rounded-xl bg-white/20 hover:bg-white/30 text-white border border-white/25 backdrop-blur-md shadow-sm transition-all cursor-pointer"
            >
              <HelpCircle className="h-4 w-4 me-1.5" />
              <span>{isRtl ? "دليل: كيف يعمل التطبيق؟" : "How it works guide"}</span>
            </Button>
          </Link>
        </div>
        {/* Subtle background wave decoration */}
        <div className="absolute -bottom-10 -right-10 w-44 h-44 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Two Big Primary Mobile Shortcuts */}
      <div className="grid grid-cols-2 gap-3">
        <Link href="/waterassociation/waterassociationmanager/readings" className="block group">
          <div className="h-24 sm:h-28 rounded-2xl bg-linear-to-br from-cyan-500 to-blue-600 p-3.5 sm:p-4 text-white flex flex-col justify-between shadow-md shadow-cyan-500/20 group-hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-xl bg-white/20">
                <Gauge className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold">
                {isRtl ? "شهري" : "Monthly"}
              </span>
            </div>
            <div>
              <div className="font-black text-sm sm:text-base leading-tight">
                {isRtl ? "تسجيل العدادات" : "Enter Readings"}
              </div>
              <div className="text-[11px] text-white/80 flex items-center gap-1 mt-0.5">
                <span>{isRtl ? "تسجيل استهلاك هذا الشهر" : "Record monthly usage"}</span>
                {isRtl ? <ArrowLeft size={12} /> : <ArrowRight size={12} />}
              </div>
            </div>
          </div>
        </Link>

        <div
          onClick={() => handleOpenPayment()}
          className="h-24 sm:h-28 rounded-2xl bg-linear-to-br from-emerald-500 to-teal-600 p-3.5 sm:p-4 text-white flex flex-col justify-between shadow-md shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-xl bg-white/20">
              <CreditCard className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold">
              {isRtl ? "استخلاص" : "Collect"}
            </span>
          </div>
          <div>
            <div className="font-black text-sm sm:text-base leading-tight">
              {isRtl ? "استخلاص فاتورة" : "Record Payment"}
            </div>
            <div className="text-[11px] text-white/80 flex items-center gap-1 mt-0.5">
              <span>{isRtl ? "تسجيل أداء المنخرطين" : "Collect subscriber dues"}</span>
              {isRtl ? <ArrowLeft size={12} /> : <ArrowRight size={12} />}
            </div>
          </div>
        </div>
      </div>

      {/* 4 Financial Key Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          title={isRtl ? "المداخيل المستخلصة" : "Total Collected"}
          value={formatCurrency(totalCollectedCentimes, locale)}
          subtitle={isRtl ? "مجموع استخلاصات الماء" : "Lifetime cash collected"}
          icon={Droplets}
          variant="emerald"
        />

        <StatCard
          title={isRtl ? "المصاريف الإجمالية" : "Total Expenses"}
          value={formatCurrency(totalExpensesCentimes, locale)}
          subtitle={isRtl ? "كهرباء وصيانة الشبكة" : "Electricity & repairs"}
          icon={TrendingDown}
          variant="rose"
        />

        <StatCard
          title={isRtl ? "الرصيد المالي في الصندوق" : "Cash Balance"}
          value={formatCurrency(cashBalanceCentimes, locale)}
          subtitle={isRtl ? "السيولة المتوفرة لدى الجمعية" : "Net cash in hand"}
          icon={Wallet}
          variant={cashBalanceCentimes >= 0 ? "blue" : "rose"}
        />

        <StatCard
          title={isRtl ? "مجموع ديون المنخرطين" : "Total Arrears"}
          value={formatCurrency(totalArrearsCentimes, locale)}
          subtitle={
            isRtl
              ? `${membersWithArrears.length} منخرط بذمتهم بواقي`
              : `${membersWithArrears.length} members with arrears`
          }
          icon={AlertCircle}
          variant={totalArrearsCentimes > 0 ? "amber" : "emerald"}
        />
      </div>

      {/* Main Content Split: Arrears List & Recent Collections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Column (2 Cols): Members with Unpaid Debts */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <h3 className="font-bold text-sm sm:text-base text-foreground">
                {isRtl ? "المنخرطون المتأخرون في الأداء (الديون)" : "Subscribers with Arrears"}
              </h3>
            </div>
            <Link
              href="/waterassociation/waterassociationmanager/members"
              className="text-xs text-primary font-semibold hover:underline flex items-center gap-1"
            >
              <span>{isRtl ? "عرض الجميع" : "View All"}</span>
              {isRtl ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
            </Link>
          </div>

          {membersWithArrears.length === 0 ? (
            <Card className="border-dashed p-6 text-center">
              <div className="mx-auto w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-2">
                ✓
              </div>
              <h4 className="font-bold text-sm text-foreground">
                {isRtl ? "الوضعية ممتازة! لا توجد ديون معلقة" : "Great job! No outstanding arrears"}
              </h4>
              <p className="text-xs text-muted-foreground mt-1">
                {isRtl
                  ? "جميع المنخرطين أدوا فواتير استهلاك الماء بالكامل."
                  : "All members have settled their water consumption bills."}
              </p>
            </Card>
          ) : (
            <div className="space-y-2">
              {membersWithArrears.slice(0, 6).map((item) => (
                <div
                  key={item.member.id}
                  onClick={() => handleOpenMember(item.member.id)}
                  className="p-3 sm:p-3.5 rounded-xl border bg-card hover:bg-muted/40 transition-all flex items-center justify-between gap-3 cursor-pointer shadow-2xs group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-400 font-mono font-bold flex items-center justify-center text-xs shrink-0">
                      {item.member.meterNumber}
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-sm text-foreground truncate group-hover:text-primary transition-colors">
                        {item.member.name}
                      </div>
                      <div className="text-[11px] text-muted-foreground flex items-center gap-2">
                        {item.member.sector && <span>{item.member.sector}</span>}
                        {item.member.phone && (
                          <span className="font-mono">{item.member.phone}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <div className="text-end">
                      <div className="font-black text-sm text-rose-600 dark:text-rose-400">
                        {formatCurrency(item.balance, locale)}
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        {isRtl ? "واجب الأداء" : "due"}
                      </div>
                    </div>

                    {/* Quick WhatsApp Reminder */}
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-8 w-8 rounded-lg border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/10"
                      onClick={(e) => handleWhatsAppReminder(e, item)}
                      title={isRtl ? "إرسال تذكير بالواتساب" : "WhatsApp reminder"}
                    >
                      <MessageCircle className="h-4 w-4" />
                    </Button>

                    {/* Quick Collect */}
                    <Button
                      size="sm"
                      className="h-8 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-2.5"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenPayment(item.member.id);
                      }}
                    >
                      {isRtl ? "استخلاص" : "Pay"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Recent Payments & Association Health */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <h3 className="font-bold text-sm sm:text-base text-foreground">
                {isRtl ? "آخر الاستخلاصات المسجلة" : "Recent Collections"}
              </h3>
            </div>
            <Link
              href="/waterassociation/waterassociationmanager/payments"
              className="text-xs text-primary font-semibold hover:underline flex items-center gap-1"
            >
              <span>{isRtl ? "السجل" : "Log"}</span>
              {isRtl ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
            </Link>
          </div>

          <Card className="overflow-hidden border">
            <CardContent className="p-3 divide-y divide-border">
              {recentPayments.length === 0 ? (
                <div className="text-center py-8 text-xs text-muted-foreground">
                  {isRtl ? "لا توجد أداءات مسجلة بعد" : "No recent payments"}
                </div>
              ) : (
                recentPayments.map((p) => {
                  const m = summaries.find((s) => s.member.id === p.memberId)?.member;
                  return (
                    <div
                      key={p.id}
                      className="py-2.5 flex items-center justify-between gap-2 text-xs"
                    >
                      <div>
                        <div className="font-bold text-foreground">
                          {m?.name || (isRtl ? "منخرط" : "Member")}
                        </div>
                        <div className="text-[10px] text-muted-foreground font-mono">
                          {m?.meterNumber} • {p.date}
                        </div>
                      </div>
                      <div className="text-end">
                        <div className="font-bold text-emerald-600 dark:text-emerald-400">
                          +{formatCurrency(p.amount, locale)}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleOpenReceiptForPayment(p)}
                          className="text-[10px] text-primary hover:underline cursor-pointer"
                        >
                          {isRtl ? "معاينة الوصل" : "Receipt"}
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>

          {/* Quick Add Member button */}
          <Button
            variant="outline"
            onClick={() => {
              setMemberToEdit(null);
              setMemberFormOpen(true);
            }}
            className="w-full h-11 rounded-xl border-dashed border-2 hover:bg-muted font-bold text-xs gap-2"
          >
            <UserPlus className="h-4 w-4 text-cyan-600" />
            <span>{isRtl ? "+ إضافة منخرط وعداد جديد" : "+ Add Member & Meter"}</span>
          </Button>
        </div>
      </div>

      {/* Onboarding Dialog */}
      <OnboardingDialog
        open={onboardingOpen}
        onCompleted={() => {
          setOnboardingOpen(false);
          loadAllData();
        }}
      />

      {/* Member Detail Dialog */}
      <MemberDetailDialog
        open={detailOpen}
        onOpenChange={setDetailOpen}
        memberId={selectedMemberIdForDetail}
        onEditMember={(m) => {
          setMemberToEdit(m);
          setMemberFormOpen(true);
        }}
        onRecordPayment={(id) => handleOpenPayment(id)}
        onMemberDeleted={loadAllData}
      />

      {/* Add / Edit Member Form Dialog */}
      <MemberFormDialog
        open={memberFormOpen}
        onOpenChange={setMemberFormOpen}
        memberToEdit={memberToEdit}
        onSaved={loadAllData}
      />

      {/* Payment Form Dialog */}
      <PaymentFormDialog
        open={paymentDialogOpen}
        onOpenChange={setPaymentDialogOpen}
        preSelectedMemberId={preSelectedMemberForPayment}
        onPaymentRecorded={(p) => {
          loadAllData();
        }}
        onOpenReceipt={handleOpenReceiptForPayment}
      />

      {/* Printable Receipt Dialog */}
      {receiptPayment && selectedMemberObj && (
        <PrintableReceiptDialog
          open={receiptOpen}
          onOpenChange={setReceiptOpen}
          member={selectedMemberObj}
          payment={receiptPayment}
          currentBalance={
            summaries.find((s) => s.member.id === receiptPayment.memberId)?.balance || 0
          }
        />
      )}
    </div>
  );
}
