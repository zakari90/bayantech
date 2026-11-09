"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useLocale } from "next-intl";
import {
  FileSpreadsheet,
  Download,
  Printer,
  Calendar,
  Droplets,
  TrendingUp,
  TrendingDown,
  Wallet,
  AlertCircle,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getSettings,
  getPayments,
  getExpenses,
  getAllMembersSummaries,
  exportFinancialReportToCSV,
  formatCurrency,
  centimesToMad,
} from "@/app/waterdexiedb";
import {
  WaterSettings,
  Payment,
  Expense,
  MemberFinancialSummary,
  ExpenseCategory,
} from "@/app/waterdexiedb/types";
import { toast } from "sonner";

export default function GeneralAssemblyReportsPage() {
  const locale = useLocale();
  const isRtl = locale === "ar";

  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [settings, setSettings] = useState<WaterSettings | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [summaries, setSummaries] = useState<MemberFinancialSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [s, pays, exps, sums] = await Promise.all([
        getSettings(),
        getPayments(),
        getExpenses(),
        getAllMembersSummaries(),
      ]);
      setSettings(s);
      setPayments(pays);
      setExpenses(exps);
      setSummaries(sums);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Filter by year
  const yearStr = String(selectedYear);
  const yearPayments = useMemo(() => payments.filter((p) => p.date.startsWith(yearStr)), [payments, yearStr]);
  const yearExpenses = useMemo(() => expenses.filter((e) => e.date.startsWith(yearStr)), [expenses, yearStr]);

  const totalCollected = yearPayments.reduce((acc, p) => acc + p.amount, 0);
  const totalExpenses = yearExpenses.reduce((acc, e) => acc + e.amount, 0);
  const netSurplus = totalCollected - totalExpenses;
  const totalArrears = summaries.reduce((acc, s) => acc + Math.max(0, s.balance), 0);

  // Category breakdown
  const categoryTotals: Record<ExpenseCategory, number> = {
    electricity: yearExpenses.filter((e) => e.category === "electricity").reduce((a, b) => a + b.amount, 0),
    repairs: yearExpenses.filter((e) => e.category === "repairs").reduce((a, b) => a + b.amount, 0),
    pump: yearExpenses.filter((e) => e.category === "pump").reduce((a, b) => a + b.amount, 0),
    admin: yearExpenses.filter((e) => e.category === "admin").reduce((a, b) => a + b.amount, 0),
    other: yearExpenses.filter((e) => e.category === "other").reduce((a, b) => a + b.amount, 0),
  };

  const handleExportCSV = async () => {
    try {
      const { blob, filename } = await exportFinancialReportToCSV(selectedYear);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success(isRtl ? "تم تحميل التقرير المالي بصيغة CSV بنجاح" : "Financial CSV downloaded");
    } catch (err) {
      toast.error(isRtl ? "فشل تصدير التقرير" : "CSV export failed");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-5 animate-in fade-in-50 duration-300">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 print:hidden">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-foreground flex items-center gap-2">
            <FileSpreadsheet className="h-6 w-6 text-emerald-600" />
            <span>{isRtl ? "التقرير المالي للجمع العام السنوي" : "General Assembly Financial Report"}</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {isRtl
              ? "كشف شامل للمداخيل، المصاريف، الفائض المالي، وبواقي استهلاك الماء"
              : "Annual financial statement for the association assembly"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Year selector */}
          <Select
            value={String(selectedYear)}
            onValueChange={(val) => setSelectedYear(Number(val))}
          >
            <SelectTrigger className="h-10 w-28 text-xs font-bold bg-card">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[currentYear - 2, currentYear - 1, currentYear, currentYear + 1].map((y) => (
                <SelectItem key={y} value={String(y)}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            onClick={handleExportCSV}
            className="h-10 rounded-xl text-xs gap-1.5 font-bold"
          >
            <Download className="h-4 w-4 text-emerald-600" />
            <span className="hidden sm:inline">{isRtl ? "تصدير Excel" : "Export CSV"}</span>
          </Button>

          <Button
            onClick={handlePrint}
            className="h-10 rounded-xl bg-primary text-primary-foreground text-xs gap-1.5 font-bold"
          >
            <Printer className="h-4 w-4" />
            <span>{isRtl ? "طباعة التقرير" : "Print Report"}</span>
          </Button>
        </div>
      </div>

      {/* Official GA Report Card (Printable Sheet) */}
      <Card className="border-2 rounded-2xl bg-card shadow-sm p-5 sm:p-8 space-y-6 print:border-none print:shadow-none print:p-0">
        {/* Report Official Header */}
        <div className="text-center border-b pb-4 space-y-1">
          <div className="text-xs font-semibold text-muted-foreground">
            {isRtl ? "المملكة المغربية" : "Kingdom of Morocco"}
          </div>
          <h2 className="text-lg sm:text-xl font-black text-foreground">
            {settings?.associationName || (isRtl ? "جمعية مستخدمي مياه الشرب" : "Water Association")}
          </h2>
          {settings?.villageName && (
            <div className="text-xs text-muted-foreground">{settings.villageName}</div>
          )}
          <div className="pt-2">
            <span className="inline-block px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 font-bold text-sm">
              {isRtl ? `التقرير المالي السنوي لسنة ${selectedYear}` : `Annual Financial Statement - ${selectedYear}`}
            </span>
          </div>
          <div className="text-[11px] text-muted-foreground/80 mt-1">
            {isRtl
              ? `تاريخ استخراج التقرير: ${new Date().toLocaleDateString("ar-MA")}`
              : `Generated on: ${new Date().toLocaleDateString("en-US")}`}
          </div>
        </div>

        {/* 4 Summary KPIs in Box */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl border bg-muted/20 text-center">
            <span className="text-[11px] text-muted-foreground block">
              {isRtl ? "مجموع المداخيل المستخلصة" : "Total Collections"}
            </span>
            <span className="text-lg font-black text-emerald-600 dark:text-emerald-400 mt-0.5 block">
              {formatCurrency(totalCollected, locale)}
            </span>
          </div>

          <div className="p-3.5 rounded-xl border bg-muted/20 text-center">
            <span className="text-[11px] text-muted-foreground block">
              {isRtl ? "مجموع المصاريف والنفقات" : "Total Expenses"}
            </span>
            <span className="text-lg font-black text-rose-600 dark:text-rose-400 mt-0.5 block">
              {formatCurrency(totalExpenses, locale)}
            </span>
          </div>

          <div className="p-3.5 rounded-xl border bg-muted/20 text-center">
            <span className="text-[11px] text-muted-foreground block">
              {isRtl ? "الرصيد المالي المتبقي (الفائض)" : "Net Surplus / Deficit"}
            </span>
            <span
              className={`text-lg font-black mt-0.5 block ${
                netSurplus >= 0 ? "text-blue-600 dark:text-cyan-400" : "text-rose-600"
              }`}
            >
              {formatCurrency(netSurplus, locale)}
            </span>
          </div>

          <div className="p-3.5 rounded-xl border bg-muted/20 text-center">
            <span className="text-[11px] text-muted-foreground block">
              {isRtl ? "مجموع البواقي غير المستخلصة" : "Total Arrears Owed"}
            </span>
            <span className="text-lg font-black text-amber-600 dark:text-amber-400 mt-0.5 block">
              {formatCurrency(totalArrears, locale)}
            </span>
          </div>
        </div>

        {/* Expenses by Category Breakdown Table */}
        <div className="space-y-3">
          <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
            <TrendingDown className="h-4 w-4 text-rose-600" />
            <span>{isRtl ? "بيان المصاريف والنفقات حسب الأصناف" : "Expenses Breakdown by Category"}</span>
          </h3>

          <div className="rounded-xl border overflow-hidden text-xs">
            <table className="w-full text-start divide-y divide-border">
              <thead className="bg-muted/40 font-semibold text-muted-foreground">
                <tr>
                  <th className="py-2.5 px-3 text-start">{isRtl ? "صنف المصروف" : "Category"}</th>
                  <th className="py-2.5 px-3 text-end">{isRtl ? "المبلغ (درهم)" : "Amount (MAD)"}</th>
                  <th className="py-2.5 px-3 text-end">{isRtl ? "النسبة المئوية" : "Percentage"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="py-2.5 px-3 font-medium">{isRtl ? "فاتورة كهرباء مضخة البئر (ONE)" : "Pump Electricity"}</td>
                  <td className="py-2.5 px-3 text-end font-bold">{formatCurrency(categoryTotals.electricity, locale)}</td>
                  <td className="py-2.5 px-3 text-end text-muted-foreground">
                    {totalExpenses > 0 ? Math.round((categoryTotals.electricity / totalExpenses) * 100) : 0}%
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-medium">{isRtl ? "أشغال وإصلاحات شبكة التوزيع" : "Distribution Repairs"}</td>
                  <td className="py-2.5 px-3 text-end font-bold">{formatCurrency(categoryTotals.repairs, locale)}</td>
                  <td className="py-2.5 px-3 text-end text-muted-foreground">
                    {totalExpenses > 0 ? Math.round((categoryTotals.repairs / totalExpenses) * 100) : 0}%
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-medium">{isRtl ? "صيانة وتجهيزات المضخة والبئر" : "Pump & Well Maintenance"}</td>
                  <td className="py-2.5 px-3 text-end font-bold">{formatCurrency(categoryTotals.pump, locale)}</td>
                  <td className="py-2.5 px-3 text-end text-muted-foreground">
                    {totalExpenses > 0 ? Math.round((categoryTotals.pump / totalExpenses) * 100) : 0}%
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-medium">{isRtl ? "مصاريف إدارية ومكتبية" : "Administrative & Supplies"}</td>
                  <td className="py-2.5 px-3 text-end font-bold">{formatCurrency(categoryTotals.admin, locale)}</td>
                  <td className="py-2.5 px-3 text-end text-muted-foreground">
                    {totalExpenses > 0 ? Math.round((categoryTotals.admin / totalExpenses) * 100) : 0}%
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-medium">{isRtl ? "مصاريف أخرى مختلفة" : "Other"}</td>
                  <td className="py-2.5 px-3 text-end font-bold">{formatCurrency(categoryTotals.other, locale)}</td>
                  <td className="py-2.5 px-3 text-end text-muted-foreground">
                    {totalExpenses > 0 ? Math.round((categoryTotals.other / totalExpenses) * 100) : 0}%
                  </td>
                </tr>
              </tbody>
              <tfoot className="bg-muted/40 font-bold border-t">
                <tr>
                  <td className="py-2.5 px-3">{isRtl ? "المجموع العام للمصاريف" : "Total Expenses"}</td>
                  <td className="py-2.5 px-3 text-end text-rose-600 dark:text-rose-400 font-black">
                    {formatCurrency(totalExpenses, locale)}
                  </td>
                  <td className="py-2.5 px-3 text-end">100%</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Arrears List Table */}
        <div className="space-y-3">
          <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-amber-500" />
            <span>{isRtl ? "لائحة البواقي غير المستخلصة (ديون المنخرطين)" : "Subscribers with Outstanding Arrears"}</span>
          </h3>

          <div className="rounded-xl border overflow-hidden text-xs">
            <table className="w-full text-start divide-y divide-border">
              <thead className="bg-muted/40 font-semibold text-muted-foreground">
                <tr>
                  <th className="py-2 px-3 text-start">{isRtl ? "المنخرط" : "Subscriber"}</th>
                  <th className="py-2 px-3 text-start">{isRtl ? "رقم العداد" : "Meter"}</th>
                  <th className="py-2 px-3 text-end">{isRtl ? "مجموع الفواتير" : "Billed"}</th>
                  <th className="py-2 px-3 text-end">{isRtl ? "المؤدى" : "Paid"}</th>
                  <th className="py-2 px-3 text-end">{isRtl ? "الباقي بذمته" : "Due"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {summaries.filter((s) => s.balance > 0).length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-4 text-center text-muted-foreground">
                      {isRtl ? "لا توجد أي ديون معلقة على المنخرطين" : "No outstanding arrears"}
                    </td>
                  </tr>
                ) : (
                  summaries
                    .filter((s) => s.balance > 0)
                    .map((s) => (
                      <tr key={s.member.id}>
                        <td className="py-2 px-3 font-semibold">{s.member.name}</td>
                        <td className="py-2 px-3 font-mono text-muted-foreground">{s.member.meterNumber}</td>
                        <td className="py-2 px-3 text-end">{formatCurrency(s.totalBilled, locale)}</td>
                        <td className="py-2 px-3 text-end text-emerald-600">{formatCurrency(s.totalPaid, locale)}</td>
                        <td className="py-2 px-3 text-end font-bold text-rose-600">{formatCurrency(s.balance, locale)}</td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Official Signatures box for GA */}
        <div className="pt-6 border-t grid grid-cols-3 gap-4 text-center text-xs">
          <div>
            <div className="font-bold">{isRtl ? "رئيس الجمعية" : "President"}</div>
            <div className="h-16"></div>
          </div>
          <div>
            <div className="font-bold">{isRtl ? "الكاتب العام" : "General Secretary"}</div>
            <div className="h-16"></div>
          </div>
          <div>
            <div className="font-bold">{isRtl ? "أمين المال" : "Treasurer"}</div>
            <div className="h-16"></div>
          </div>
        </div>
      </Card>
    </div>
  );
}
