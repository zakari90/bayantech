"use client";

import React, { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import {
  Settings,
  Save,
  Download,
  Upload,
  Database,
  Sparkles,
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
  FileSpreadsheet,
  Lock,
  KeyRound,
  Shield,
  Trash2,
  AlertTriangle,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  getSettings,
  updateSettings,
  exportDatabaseToJSON,
  importDatabaseFromJSON,
  exportMembersToCSV,
  seedSampleVillageData,
  clearAllDatabaseData,
  madToCentimes,
  centimesToMad,
} from "@/app/waterdexiedb";
import { WaterSettings } from "@/app/waterdexiedb/types";
import { AdminDeleteConfirmDialog } from "@/components/watermanagemtcomponents/AdminDeleteConfirmDialog";
import { toast } from "sonner";

export default function SettingsPage() {
  const locale = useLocale();
  const isRtl = locale === "ar";

  const [settings, setSettings] = useState<WaterSettings | null>(null);
  const [associationName, setAssociationName] = useState("");
  const [villageName, setVillageName] = useState("");
  const [phone, setPhone] = useState("");
  const [pricePerM3MAD, setPricePerM3MAD] = useState("");
  const [fixedFeeMAD, setFixedFeeMAD] = useState("");
  const [pinCode, setPinCode] = useState("1234");
  const [pinEnabled, setPinEnabled] = useState(false);
  const [readingStartDay, setReadingStartDay] = useState(24);
  const [readingEndDay, setReadingEndDay] = useState(27);
  const [verificationDay, setVerificationDay] = useState(28);
  const [creationDate, setCreationDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    async function load() {
      const s = await getSettings();
      setSettings(s);
      setAssociationName(s.associationName);
      setVillageName(s.villageName || "");
      setPhone(s.phone || "");
      setPricePerM3MAD(centimesToMad(s.pricePerM3).toFixed(2));
      setFixedFeeMAD(centimesToMad(s.fixedFee).toFixed(2));
      setPinCode(s.pinCode || "1234");
      setPinEnabled(Boolean(s.pinEnabled));
      setReadingStartDay(s.readingStartDay ?? 24);
      setReadingEndDay(s.readingEndDay ?? 27);
      setVerificationDay(s.verificationDay ?? 28);
      setCreationDate(
        s.creationDate ||
        s.createdAt?.split("T")[0] ||
        new Date().toISOString().split("T")[0]
      );
    }
    load();
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const updated = await updateSettings({
        associationName: associationName.trim(),
        villageName: villageName.trim(),
        phone: phone.trim(),
        creationDate: creationDate || undefined,
        pricePerM3: madToCentimes(parseFloat(pricePerM3MAD) || 5),
        fixedFee: madToCentimes(parseFloat(fixedFeeMAD) || 10),
        readingStartDay: Number(readingStartDay) || 24,
        readingEndDay: Number(readingEndDay) || 27,
        verificationDay: Number(verificationDay) || 28,
        pinCode: pinCode.trim() || "1234",
        pinEnabled,
      });
      setSettings(updated);
      toast.success(isRtl ? "تم حفظ إعدادات الجمعية والتعريفة بنجاح" : "Settings saved successfully");
    } catch (err) {
      toast.error(isRtl ? "حدث خطأ أثناء الحفظ" : "Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownloadBackup = async () => {
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
      toast.success(isRtl ? "تم تنزيل النسخة الاحتياطية بنجاح" : "Backup downloaded successfully");
    } catch (err) {
      toast.error(isRtl ? "فشل تنزيل النسخة الاحتياطية" : "Backup export failed");
    } finally {
      setIsExporting(false);
    }
  };

  const handleFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!confirm(isRtl ? "تنبيه: استرجاع النسخة الاحتياطية سيقوم بتعويض البيانات الحالية. هل تريد المتابعة؟" : "Warning: Restoring will overwrite existing local data. Continue?")) {
      e.target.value = "";
      return;
    }

    try {
      const text = await file.text();
      const result = await importDatabaseFromJSON(text);
      if (result.success) {
        toast.success(
          isRtl
            ? `تم استرجاع البيانات بنجاح: ${result.counts.members} منخرط، ${result.counts.readings} قراءة، ${result.counts.payments} أداء.`
            : `Restored successfully: ${result.counts.members} members, ${result.counts.readings} readings.`
        );
        window.location.reload();
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      toast.error(isRtl ? "فشل قراءة ملف النسخة الاحتياطية" : "Failed to read backup file");
    } finally {
      e.target.value = "";
    }
  };

  const handleExportCSV = async () => {
    try {
      const { blob, filename } = await exportMembersToCSV();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success(isRtl ? "تم تصدير لائحة المنخرطين بنجاح" : "Members list CSV exported");
    } catch (err) {
      toast.error(isRtl ? "فشل تصدير اللائحة" : "CSV export failed");
    }
  };

  const handleSeedDemo = async () => {
    if (confirm(isRtl ? "هل تريد تحميل بيانات قرية تجريبية نموذجية؟ (ستستبدل البيانات الحالية)" : "Load demo village data? This will overwrite current data.")) {
      try {
        await seedSampleVillageData();
        toast.success(isRtl ? "تم تجهيز بيانات قرية عين الخير بنجاح" : "Demo data ready");
        window.location.reload();
      } catch (err) {
        toast.error(isRtl ? "فشل تحميل البيانات" : "Failed to load demo");
      }
    }
  };

  const handleConfirmDeleteAll = async () => {
    try {
      await clearAllDatabaseData();
      toast.success(
        isRtl
          ? "تم حذف وتصفير جميع بيانات الجمعية بنجاح"
          : "All association data has been deleted successfully"
      );
      window.location.reload();
    } catch (err) {
      toast.error(isRtl ? "فشل حذف البيانات" : "Failed to delete database data");
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto animate-in fade-in-50 duration-300">
      {/* Title */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-foreground flex items-center gap-2">
          <Settings className="h-6 w-6 text-blue-600" />
          <span>{isRtl ? "إعدادات الجمعية والتعريفة" : "Association Settings & Tariffs"}</span>
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          {isRtl
            ? "تعديل اسم الجمعية، تعريفة استهلاك الماء بالمتر المكعب، والنسخ الاحتياطي"
            : "Configure tariffs, fixed fees, and local database backup & restore"}
        </p>
      </div>

      {/* Main Settings Form */}
      <Card className="border rounded-2xl shadow-2xs">
        <CardHeader className="pb-3 border-b">
          <CardTitle className="text-base font-bold">
            {isRtl ? "بيانات الجمعية والتعريفة المطبقة" : "Association Details & Tariffs"}
          </CardTitle>
          <CardDescription className="text-xs">
            {isRtl
              ? "يتم تطبيق هذه التعريفة على القراءات الشهرية الجديدة فقط مع الحفاظ على الفواتير القديمة."
              : "Tariff changes apply only to future readings; historical bills remain locked."}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <form onSubmit={handleSaveSettings} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="assoc-name" className="text-xs font-semibold">
                {isRtl ? "اسم الجمعية" : "Association Name"} *
              </Label>
              <Input
                id="assoc-name"
                value={associationName}
                onChange={(e) => setAssociationName(e.target.value)}
                required
                className="h-10 text-sm font-semibold"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="village" className="text-xs font-semibold">
                  {isRtl ? "اسم الدوار / القرية" : "Douar / Village"}
                </Label>
                <Input
                  id="village"
                  value={villageName}
                  onChange={(e) => setVillageName(e.target.value)}
                  placeholder={isRtl ? "دوار..." : "Village..."}
                  className="h-10 text-sm"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="phone" className="text-xs font-semibold">
                  {isRtl ? "هاتف الجمعية / أمين المال" : "Phone Number"}
                </Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="06..."
                  className="h-10 text-sm"
                />
              </div>
            </div>

            {/* Association Creation Date / Accounting Reference Date */}
            <div className="space-y-1 pt-1">
              <Label htmlFor="creation-date" className="text-xs font-semibold flex items-center justify-between">
                <span>{isRtl ? "تاريخ تأسيس الجمعية (التاريخ المرجعي للحسابات والتعريفة)" : "Creation Date (Accounting & Tariff Reference Date)"} *</span>
                <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-normal">
                  {isRtl ? "مرجع بداية الحسابات ومؤشرات الانطلاق" : "Accounting Baseline"}
                </span>
              </Label>
              <Input
                id="creation-date"
                type="date"
                value={creationDate}
                onChange={(e) => setCreationDate(e.target.value)}
                required
                className="h-10 text-sm font-semibold"
              />
              <p className="text-[10px] text-muted-foreground">
                {isRtl
                  ? "* يُعتمد هذا التاريخ كمرجع أساسي لبداية احتساب الدورات الشهرية، ومؤشرات الانطلاق للعدادات، وتاريخ سريان التعريفة المطبقة."
                  : "* Official reference baseline for starting meter indexes, billing cycles, and tariff applicability."}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="space-y-1">
                <Label htmlFor="tariff" className="text-xs font-semibold">
                  {isRtl ? "سعر المتر المكعب m³ (درهم)" : "Price per m³ (MAD)"} *
                </Label>
                <Input
                  id="tariff"
                  type="number"
                  step="0.1"
                  min="0"
                  inputMode="decimal"
                  value={pricePerM3MAD}
                  onChange={(e) => setPricePerM3MAD(e.target.value)}
                  required
                  className="h-10 text-sm font-bold text-cyan-600 dark:text-cyan-400"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="fee" className="text-xs font-semibold">
                  {isRtl ? "واجب الصيانة الشهري (درهم)" : "Fixed Monthly Fee (MAD)"} *
                </Label>
                <Input
                  id="fee"
                  type="number"
                  step="0.5"
                  min="0"
                  inputMode="decimal"
                  value={fixedFeeMAD}
                  onChange={(e) => setFixedFeeMAD(e.target.value)}
                  required
                  className="h-10 text-sm font-bold text-foreground"
                />
              </div>
            </div>

            {/* Monthly Reading Period & Verification Day */}
            <div className="p-3.5 rounded-xl border border-border/80 bg-muted/40 space-y-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                  <Calendar className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-foreground">
                    {isRtl ? "فترة أخذ قراءات العدادات ويوم المراقبة" : "Reading Period & Verification Day"}
                  </h3>
                  <p className="text-[11px] text-muted-foreground">
                    {isRtl
                      ? "تحديد أيام الجولة الشهرية لقراءة العدادات ويوم المراقبة والتحقق من الاستهلاك"
                      : "Schedule monthly meter reading days and verification day"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                {/* Reading Start Day */}
                <div className="space-y-1">
                  <Label htmlFor="reading-start" className="text-xs font-semibold">
                    {isRtl ? "بداية فترة القراءة (يوم)" : "Reading Start Day"}
                  </Label>
                  <Input
                    id="reading-start"
                    type="number"
                    min="1"
                    max="31"
                    value={readingStartDay}
                    onChange={(e) => setReadingStartDay(parseInt(e.target.value) || 1)}
                    required
                    className="h-10 text-sm font-bold text-cyan-600 dark:text-cyan-400"
                  />
                  <span className="text-[10px] text-muted-foreground">
                    {isRtl ? "الافتراضي: يوم 24" : "Default: Day 24"}
                  </span>
                </div>

                {/* Reading End Day */}
                <div className="space-y-1">
                  <Label htmlFor="reading-end" className="text-xs font-semibold">
                    {isRtl ? "نهاية فترة القراءة (يوم)" : "Reading End Day"}
                  </Label>
                  <Input
                    id="reading-end"
                    type="number"
                    min="1"
                    max="31"
                    value={readingEndDay}
                    onChange={(e) => setReadingEndDay(parseInt(e.target.value) || 1)}
                    required
                    className="h-10 text-sm font-bold text-cyan-600 dark:text-cyan-400"
                  />
                  <span className="text-[10px] text-muted-foreground">
                    {isRtl ? "الافتراضي: يوم 27 (3 أيام)" : "Default: Day 27 (3 days)"}
                  </span>
                </div>

                {/* Verification Day */}
                <div className="space-y-1">
                  <Label htmlFor="verification-day" className="text-xs font-semibold">
                    {isRtl ? "يوم المراقبة والتحقق" : "Verification Day"}
                  </Label>
                  <Input
                    id="verification-day"
                    type="number"
                    min="1"
                    max="31"
                    value={verificationDay}
                    onChange={(e) => setVerificationDay(parseInt(e.target.value) || 1)}
                    required
                    className="h-10 text-sm font-bold text-amber-600 dark:text-amber-400"
                  />
                  <span className="text-[10px] text-muted-foreground">
                    {isRtl ? "الافتراضي: يوم 28 (يوم واحد)" : "Default: Day 28 (1 day)"}
                  </span>
                </div>
              </div>

              {/* Informative Preview Banner */}
              <div className="p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 text-[11px] text-cyan-800 dark:text-cyan-300">
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="inline-block w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                  {isRtl
                    ? `فترة القراءة الافتراضية: 3 أيام من ${readingStartDay} إلى ${readingEndDay}`
                    : `Reading Period: 3 days from ${readingStartDay} to ${readingEndDay}`}
                </span>
                <span className="font-semibold sm:border-s sm:ps-2 sm:border-cyan-500/30">
                  {isRtl ? `يوم المراقبة والتحقق: ${verificationDay} شهرياً (يوم واحد)` : `Verification: Day ${verificationDay} each month (1 day)`}
                </span>
              </div>
            </div>

            {/* Security Passcode / PIN Configuration */}
            <div className="p-3.5 rounded-xl border border-border/80 bg-muted/40 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-cyan-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <div>
                    <Label htmlFor="pin-toggle" className="text-xs font-bold cursor-pointer">
                      {isRtl ? "تفعيل قفل الحماية برمز المرور (PIN)" : "Passcode Security Lock"}
                    </Label>
                    <p className="text-[11px] text-muted-foreground">
                      {isRtl
                        ? "طلب رمز سري عند فتح لوحة القيادة لحماية السجلات من التعديل العشوائي"
                        : "Require passcode upon accessing management to protect records"}
                    </p>
                  </div>
                </div>
                <Checkbox
                  id="pin-toggle"
                  checked={pinEnabled}
                  onCheckedChange={(checked) => setPinEnabled(Boolean(checked))}
                />
              </div>

              {pinEnabled && (
                <div className="pt-2 border-t border-border/50 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <div className="space-y-1 flex-1">
                    <Label htmlFor="pin-code" className="text-xs font-semibold">
                      {isRtl ? "رمز المرور السري (4 إلى 6 أرقام)" : "Passcode (4-6 digits)"}
                    </Label>
                    <Input
                      id="pin-code"
                      type="password"
                      maxLength={6}
                      value={pinCode}
                      onChange={(e) => setPinCode(e.target.value.replace(/\D/g, ""))}
                      placeholder="1234"
                      className="h-10 text-center tracking-widest text-base font-black max-w-[160px]"
                    />
                  </div>
                  <p className="text-[11px] text-muted-foreground sm:max-w-xs leading-relaxed">
                    {isRtl
                      ? "احفظ هذا الرمز جيداً. عند تسجيل الخروج، ستطلبه شاشة الدخول للدخول للوحة القيادة."
                      : "Keep this passcode safe. You will need it to login when accessing the app."}
                  </p>
                </div>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSaving}
              className="w-full h-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
            >
              <Save className="h-4 w-4 me-1.5" />
              <span>{isRtl ? "حفظ التغييرات" : "Save Changes"}</span>
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Backup and Database Tools */}
      <Card className="border rounded-2xl shadow-2xs">
        <CardHeader className="pb-3 border-b">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Database className="h-4 w-4 text-cyan-600" />
            <span>{isRtl ? "النسخ الاحتياطي واسترجاع البيانات" : "Backup & Restore"}</span>
          </CardTitle>
          <CardDescription className="text-xs">
            {isRtl
              ? "احفظ نسخة من بيانات الجمعية دورياً على هاتفك أو بطاقة الذاكرة لضمان عدم ضياعها."
              : "Export or restore database files directly on your device."}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4 space-y-3">
          {/* Download JSON Backup */}
          <Button
            variant="outline"
            onClick={handleDownloadBackup}
            disabled={isExporting}
            className="w-full h-11 rounded-xl justify-start gap-2.5 text-xs font-semibold"
          >
            <Download className="h-4 w-4 text-cyan-600" />
            <div className="text-start">
              <div>{isRtl ? "تحميل نسخة احتياطية كاملة (JSON)" : "Download Database Backup (JSON)"}</div>
              <div className="text-[10px] text-muted-foreground font-normal">
                {isRtl ? "تحميل ملف يحتوي على جميع المنخرطين، القراءات، والمصاريف" : "Includes all members, readings, and expenses"}
              </div>
            </div>
          </Button>

          {/* Import JSON Backup */}
          <div className="relative">
            <input
              type="file"
              accept=".json"
              onChange={handleFileImport}
              id="file-import-input"
              className="hidden"
            />
            <Button
              variant="outline"
              asChild
              className="w-full h-11 rounded-xl justify-start gap-2.5 text-xs font-semibold cursor-pointer"
            >
              <label htmlFor="file-import-input">
                <Upload className="h-4 w-4 text-emerald-600" />
                <div className="text-start">
                  <div>{isRtl ? "استرجاع البيانات من ملف (JSON)" : "Restore Data from File (JSON)"}</div>
                  <div className="text-[10px] text-muted-foreground font-normal">
                    {isRtl ? "اختيار ملف نسخة احتياطية سابقة لاسترجاعها" : "Select a previous backup file to restore"}
                  </div>
                </div>
              </label>
            </Button>
          </div>

          {/* Export Members CSV */}
          <Button
            variant="outline"
            onClick={handleExportCSV}
            className="w-full h-11 rounded-xl justify-start gap-2.5 text-xs font-semibold"
          >
            <FileSpreadsheet className="h-4 w-4 text-blue-600" />
            <div className="text-start">
              <div>{isRtl ? "تصدير لائحة المنخرطين والديون (Excel / CSV)" : "Export Members & Balances (CSV)"}</div>
              <div className="text-[10px] text-muted-foreground font-normal">
                {isRtl ? "جدول قابل للفتح في برنامج Excel" : "Openable directly in Microsoft Excel"}
              </div>
            </div>
          </Button>

          {/* Seed Sample Village Data */}
          <Button
            variant="secondary"
            onClick={handleSeedDemo}
            className="w-full h-11 rounded-xl justify-start gap-2.5 text-xs font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-300 hover:bg-amber-500/20"
          >
            <Sparkles className="h-4 w-4 text-amber-500" />
            <div className="text-start">
              <div>{isRtl ? "تحميل بيانات تجريبية (دوار عين الخير)" : "Load Demo Village Data"}</div>
              <div className="text-[10px] text-muted-foreground font-normal">
                {isRtl ? "لتجربة المنصة بنماذج عدادات وفواتير واقعية" : "Test with sample meters, readings, and bills"}
              </div>
            </div>
          </Button>
        </CardContent>
      </Card>

      {/* Danger Zone: Reset & Delete All Data */}
      <Card className="border border-destructive/30 rounded-2xl shadow-2xs bg-destructive/5">
        <CardHeader className="pb-3 border-b border-destructive/15">
          <CardTitle className="text-base font-bold flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-4 w-4" />
            <span>{isRtl ? "منطقة الخطر: حذف وتصفير البيانات" : "Danger Zone: Reset & Delete All Data"}</span>
          </CardTitle>
          <CardDescription className="text-xs">
            {isRtl
              ? "مسح جميع سجلات المنخرطين، القراءات، الأداءات، والمصاريف والبدء من جديد بقاعدة بيانات فارغة."
              : "Permanently delete all members, readings, payments, and expenses to start completely fresh."}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4 space-y-3">
          <Button
            variant="destructive"
            onClick={() => setIsDeleteDialogOpen(true)}
            className="w-full h-11 rounded-xl justify-start gap-2.5 text-xs font-bold"
          >
            <Trash2 className="h-4 w-4" />
            <div className="text-start">
              <div>{isRtl ? "حذف وتصفير جميع بيانات الجمعية" : "Delete All Association Data"}</div>
              <div className="text-[10px] opacity-80 font-normal">
                {isRtl ? "يتطلب إدخال رمز المشرف (admin) لتأكيد الحذف" : "Requires admin code confirmation"}
              </div>
            </div>
          </Button>
        </CardContent>
      </Card>

      {/* Admin Delete Confirmation Dialog */}
      <AdminDeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        requiredCode="admin"
        title={isRtl ? "حذف وتصفير جميع البيانات" : "Delete All Association Data"}
        description={
          isRtl
            ? "سيتم حذف جميع المنخرطين، القراءات، الأداءات، والمصاريف المخزنة محلياً نهائياً."
            : "All locally stored members, readings, payments, and expenses will be permanently wiped."
        }
        warningText={
          isRtl
            ? "تحذير أمني خطير: لا يمكن التراجع عن هذا الإجراء إطلاقاً. يرجى كتابة رمز المشرف admin في الحقل أسفله لتأكيد الحذف النهائي."
            : "Critical Warning: This action cannot be reversed. Please type the admin code admin below to confirm permanent deletion."
        }
        confirmButtonText={isRtl ? "تأكيد مسح جميع البيانات" : "Confirm Delete All"}
        onConfirm={handleConfirmDeleteAll}
      />
    </div>
  );
}
