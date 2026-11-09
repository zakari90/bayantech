"use client";

import React, { useState } from "react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Receipt,
  FileSpreadsheet,
  Settings,
  Download,
  Sparkles,
  ShieldCheck,
  HelpCircle,
  TrendingDown,
  LogOut,
} from "lucide-react";
import { toast } from "sonner";
import { exportDatabaseToJSON } from "@/app/waterdexiedb/repositories/backupRepo";
import { seedSampleVillageData } from "@/app/waterdexiedb/sampleData";
import { getSettings } from "@/app/waterdexiedb/repositories/settingsRepo";
import { logoutSession } from "@/app/waterdexiedb/auth";
import { useRouter } from "@/i18n/navigation";

interface MoreMenuSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MoreMenuSheet({ open, onOpenChange }: MoreMenuSheetProps) {
  const locale = useLocale();
  const isRtl = locale === "ar";
  const router = useRouter();
  const [isExporting, setIsExporting] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);

  const handleBackup = async () => {
    try {
      setIsExporting(true);
      const { blob, filename } = await exportDatabaseToJSON();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success(isRtl ? "تم تحميل نسخة احتياطية من قاعدة البيانات بنجاح" : "Database backup downloaded successfully");
      onOpenChange(false);
    } catch (err) {
      toast.error(isRtl ? "حدث خطأ أثناء تصدير النسخة الاحتياطية" : "Backup export failed");
    } finally {
      setIsExporting(false);
    }
  };

  const handleSeedDemo = async () => {
    if (confirm(isRtl ? "هل تريد تحميل بيانات تجريبية لدوار نموذجي لاختبار التطبيق؟" : "Load sample village data to test the platform?")) {
      try {
        setIsSeeding(true);
        await seedSampleVillageData();
        toast.success(isRtl ? "تم تحميل بيانات دوار عين الخير بنجاح!" : "Sample village data loaded successfully!");
        onOpenChange(false);
        window.location.reload();
      } catch (err) {
        toast.error(isRtl ? "فشل تحميل البيانات التجريبية" : "Failed to load sample data");
      } finally {
        setIsSeeding(false);
      }
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side={isRtl ? "right" : "left"} className="w-80 sm:w-96 p-0 flex flex-col justify-between">
        <div className="p-6">
          <SheetHeader className="text-start pb-4 border-b">
            <SheetTitle className="text-lg font-bold flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-cyan-500"></span>
              {isRtl ? "قائمة الخيارات والمصاريف" : "Menu & Expenses"}
            </SheetTitle>
            <SheetDescription className="text-xs">
              {isRtl ? "الوصول السريع إلى مصاريف الجمعية والتقارير والإعدادات" : "Quick access to expenses, GA reports, and configuration"}
            </SheetDescription>
          </SheetHeader>

          {/* Navigation Links */}
          <div className="py-4 space-y-2">
            <Link
              href="/waterassociation/waterassociationmanager/expenses"
              onClick={() => onOpenChange(false)}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/80 transition-colors border border-transparent hover:border-border text-foreground"
            >
              <div className="p-2 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400">
                <TrendingDown className="h-5 w-5" />
              </div>
              <div className="flex-1 text-start">
                <div className="text-sm font-semibold">{isRtl ? "مصاريف الجمعية" : "Association Expenses"}</div>
                <div className="text-xs text-muted-foreground">{isRtl ? "كهرباء المضخة، الإصلاحات، الصيانة" : "Electricity, pump repairs, maintenance"}</div>
              </div>
            </Link>

            <Link
              href="/waterassociation/waterassociationmanager/reports"
              onClick={() => onOpenChange(false)}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/80 transition-colors border border-transparent hover:border-border text-foreground"
            >
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <FileSpreadsheet className="h-5 w-5" />
              </div>
              <div className="flex-1 text-start">
                <div className="text-sm font-semibold">{isRtl ? "تقرير الجمع العام السنوي" : "General Assembly Report"}</div>
                <div className="text-xs text-muted-foreground">{isRtl ? "المداخيل، المصاريف، الفائض، وبواقي الديون" : "Income, expenses, net surplus, arrears"}</div>
              </div>
            </Link>

            <Link
              href="/waterassociation/waterassociationmanager/settings"
              onClick={() => onOpenChange(false)}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/80 transition-colors border border-transparent hover:border-border text-foreground"
            >
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <Settings className="h-5 w-5" />
              </div>
              <div className="flex-1 text-start">
                <div className="text-sm font-semibold">{isRtl ? "إعدادات الجمعية والتعريفة" : "Settings & Tariffs"}</div>
                <div className="text-xs text-muted-foreground">{isRtl ? "سعر المتر المكعب، واجب الصيانة، الاسترجاع" : "Price/m³, monthly fee, JSON backup"}</div>
              </div>
            </Link>

            <Link
              href="/waterassociation/how-it-works"
              onClick={() => onOpenChange(false)}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-cyan-500/10 transition-colors border border-cyan-500/20 text-foreground bg-cyan-500/5"
            >
              <div className="p-2 rounded-lg bg-cyan-500/15 text-cyan-600 dark:text-cyan-400">
                <HelpCircle className="h-5 w-5" />
              </div>
              <div className="flex-1 text-start">
                <div className="text-sm font-bold text-cyan-700 dark:text-cyan-300 flex items-center gap-1.5">
                  <span>{isRtl ? "كيف يعمل التطبيق؟ (دليل مبسط)" : "How the App Works (Guide)"}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 font-semibold">{isRtl ? "جديد" : "New"}</span>
                </div>
                <div className="text-xs text-muted-foreground">{isRtl ? "شرح مبسط لدورة تسيير الماء وزر التسجيل" : "Simple guide to water management & registration"}</div>
              </div>
            </Link>
          </div>

          <div className="pt-2 border-t space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start gap-2.5 h-11 rounded-xl text-xs font-medium"
              onClick={handleBackup}
              disabled={isExporting}
            >
              <Download className="h-4 w-4 text-cyan-600" />
              <span>{isRtl ? "تنزيل نسخة احتياطية (JSON)" : "Download Database Backup"}</span>
            </Button>

            <Button
              variant="secondary"
              className="w-full justify-start gap-2.5 h-11 rounded-xl text-xs font-medium bg-amber-500/10 text-amber-700 dark:text-amber-300 hover:bg-amber-500/20"
              onClick={handleSeedDemo}
              disabled={isSeeding}
            >
              <Sparkles className="h-4 w-4 text-amber-500" />
              <span>{isRtl ? "تحميل بيانات تجريبية للاختبار" : "Load Demo Village Data"}</span>
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-start gap-2.5 h-11 rounded-xl text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-500/10"
              onClick={() => {
                logoutSession();
                onOpenChange(false);
                router.replace("/waterassociation/login");
              }}
            >
              <LogOut className="h-4 w-4" />
              <span>{isRtl ? "قفل التطبيق وتأمين الجلسة" : "Lock App / Logout"}</span>
            </Button>
          </div>
        </div>

        {/* Footer info */}
        <div className="p-4 border-t bg-muted/30 text-center">
          <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground font-medium">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span>{isRtl ? "تخزين آمن ومشفر داخل الهاتف" : "Safe offline phone storage"}</span>
          </div>
          <p className="text-[10px] text-muted-foreground/70 mt-1">Water Association Manager v1.0</p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
