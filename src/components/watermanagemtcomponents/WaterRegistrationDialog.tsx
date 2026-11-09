"use client";

import React, { useState } from "react";
import { useLocale } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Droplets,
  Building2,
  MapPin,
  User,
  Phone,
  Coins,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Lock,
  KeyRound,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";
import { updateSettings } from "@/app/waterdexiedb/repositories/settingsRepo";
import { madToCentimes } from "@/app/waterdexiedb/billing";
import { seedSampleVillageData } from "@/app/waterdexiedb/sampleData";
import { setAuthenticatedSession } from "@/app/waterdexiedb/auth";

interface WaterRegistrationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function WaterRegistrationDialog({
  open,
  onOpenChange,
  onSuccess,
}: WaterRegistrationDialogProps) {
  const locale = useLocale();
  const isRtl = locale === "ar";
  const router = useRouter();

  // Wizard Step: 1 = Admin Account & Passcode, 2 = Association Details & Tariffs
  const [step, setStep] = useState<1 | 2>(1);

  const [formData, setFormData] = useState({
    // Step 1: Admin Account
    adminName: "",
    adminPin: "",
    confirmPin: "",
    // Step 2: Association Details
    associationName: "",
    villageName: "",
    phone: "",
    pricePerM3MAD: "5.00",
    fixedFeeMAD: "10.00",
    readingStartDay: "24",
    readingEndDay: "27",
    verificationDay: "28",
    creationDate: new Date().toISOString().split("T")[0],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);

  // Validate Step 1 before moving to Step 2
  const handleProceedToStep2 = (e: React.FormEvent) => {
    e.preventDefault();

    const pin = formData.adminPin.trim();
    if (pin.length < 4 || pin.length > 6) {
      toast.error(
        isRtl
          ? "يجب أن يتكون رمز المرور من 4 إلى 6 أرقام"
          : "Passcode must be between 4 and 6 digits"
      );
      return;
    }

    if (!/^\d+$/.test(pin)) {
      toast.error(
        isRtl ? "رمز المرور يجب أن يحتوي على أرقام فقط" : "Passcode must contain digits only"
      );
      return;
    }

    if (pin !== formData.confirmPin.trim()) {
      toast.error(
        isRtl ? "رمزا المرور غير متطابقين، يرجى التأكد" : "Passcodes do not match"
      );
      return;
    }

    setStep(2);
  };

  // Submit complete registration on Step 2
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.associationName.trim()) {
      toast.error(isRtl ? "يرجى كتابة اسم الجمعية" : "Please enter the association name");
      return;
    }

    try {
      setIsSubmitting(true);
      await updateSettings({
        associationName: formData.associationName.trim(),
        villageName: formData.villageName.trim() || undefined,
        phone: formData.phone.trim() || undefined,
        pricePerM3: madToCentimes(parseFloat(formData.pricePerM3MAD) || 5),
        fixedFee: madToCentimes(parseFloat(formData.fixedFeeMAD) || 10),
        readingStartDay: parseInt(formData.readingStartDay) || 24,
        readingEndDay: parseInt(formData.readingEndDay) || 27,
        verificationDay: parseInt(formData.verificationDay) || 28,
        creationDate: formData.creationDate || new Date().toISOString().split("T")[0],
        pinCode: formData.adminPin.trim(),
        pinEnabled: true,
        onboardingCompleted: true,
      });

      // Grant authenticated session for this browser session
      setAuthenticatedSession();

      toast.success(
        isRtl
          ? "🎉 تم إنشاء حساب المشرف وتسجيل الجمعية بنجاح! مرحباً بكم."
          : "🎉 Admin account & Association created successfully! Welcome."
      );

      onOpenChange(false);
      onSuccess?.();
      router.push("/waterassociation/waterassociationmanager");
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(isRtl ? "حدث خطأ أثناء حفظ التسجيل" : "Failed to complete registration");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoRegistration = async () => {
    try {
      setIsSeeding(true);
      await seedSampleVillageData();
      setAuthenticatedSession();

      toast.success(
        isRtl
          ? "✨ تم تجهيز جمعية نموذجية (دوار أيت بوعزة) برمز المرور الافتراضي (1234)!"
          : "✨ Demo village association ready with default passcode (1234)!"
      );
      onOpenChange(false);
      onSuccess?.();
      router.push("/waterassociation/waterassociationmanager");
    } catch (error) {
      console.error("Demo load error:", error);
      toast.error(isRtl ? "فشل تحميل البيانات التجريبية" : "Failed to load demo data");
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-0 overflow-hidden rounded-3xl border-border/60 shadow-2xl">
        {/* Header Banner */}
        <div className="relative bg-linear-to-br from-cyan-600 via-blue-600 to-indigo-700 text-white p-6 pb-6">
          <div className="absolute top-0 end-0 -mt-8 -me-8 w-36 h-36 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md text-white shadow-inner">
              <Droplets className="h-6 w-6 fill-white/20" />
            </div>
            <div>
              <DialogTitle className="text-xl font-black text-white tracking-tight">
                {isRtl ? "إعداد المنظومة الرقمية للجمعية" : "Association Digital Setup"}
              </DialogTitle>
              <DialogDescription className="text-xs text-white/80 font-medium mt-0.5">
                {step === 1
                  ? isRtl
                    ? "الخطوة 1 من 2: إنشاء حساب المسؤول وتعيين رمز المرور (PIN)"
                    : "Step 1 of 2: Create Administrator Account & Passcode"
                  : isRtl
                    ? "الخطوة 2 من 2: بيانات الجمعية والتعريفة المطبقة"
                    : "Step 2 of 2: Association Details & Water Tariffs"}
              </DialogDescription>
            </div>
          </div>

          {/* Stepper indicator tabs */}
          <div className="mt-4 flex items-center gap-2">
            <div
              className={`flex-1 h-1.5 rounded-full transition-all ${
                step >= 1 ? "bg-white" : "bg-white/30"
              }`}
            />
            <div
              className={`flex-1 h-1.5 rounded-full transition-all ${
                step === 2 ? "bg-white" : "bg-white/30"
              }`}
            />
          </div>
        </div>

        {/* STEP 1: Admin Account & Passcode Setup */}
        {step === 1 && (
          <form onSubmit={handleProceedToStep2} className="p-6 space-y-4">
            <div className="space-y-3">
              {/* Security Banner Note */}
              <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/25 flex items-start gap-2.5">
                <ShieldCheck className="h-4 w-4 text-blue-600 dark:text-cyan-400 shrink-0 mt-0.5" />
                <p className="text-xs text-foreground/90 leading-relaxed font-medium">
                  {isRtl
                    ? "يتم تأمين التطبيق برمز مرور سري لحماية سجلات المنخرطين، القراءات، والمداخيل المالية من التعديل العشوائي."
                    : "Your manager dashboard will be protected by this secret passcode to keep meter records and financial data secure."}
                </p>
              </div>

              {/* Admin Manager Name */}
              <div className="space-y-1.5">
                <Label htmlFor="reg-admin-name" className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                  <span>{isRtl ? "اسم المسؤول / أمين المال" : "Administrator / Treasurer Name"}</span>
                </Label>
                <Input
                  id="reg-admin-name"
                  value={formData.adminName}
                  onChange={(e) => setFormData({ ...formData, adminName: e.target.value })}
                  placeholder={isRtl ? "مثال: ذ. محمد (أمين مال الجمعية)" : "e.g. Mohamed (Treasurer)"}
                  className="h-11 rounded-xl text-sm"
                  autoFocus
                />
              </div>

              {/* Admin PIN inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="space-y-1.5">
                  <Label htmlFor="reg-admin-pin" className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <Lock className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
                    <span>{isRtl ? "رمز المرور السري (4-6 أرقام) *" : "Secret Passcode (4-6 digits) *"}</span>
                  </Label>
                  <Input
                    id="reg-admin-pin"
                    type="password"
                    inputMode="numeric"
                    maxLength={6}
                    required
                    value={formData.adminPin}
                    onChange={(e) =>
                      setFormData({ ...formData, adminPin: e.target.value.replace(/\D/g, "") })
                    }
                    placeholder="••••"
                    className="h-11 rounded-xl text-center text-lg font-mono tracking-widest font-black"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="reg-confirm-pin" className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <KeyRound className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>{isRtl ? "تأكيد رمز المرور *" : "Confirm Passcode *"}</span>
                  </Label>
                  <Input
                    id="reg-confirm-pin"
                    type="password"
                    inputMode="numeric"
                    maxLength={6}
                    required
                    value={formData.confirmPin}
                    onChange={(e) =>
                      setFormData({ ...formData, confirmPin: e.target.value.replace(/\D/g, "") })
                    }
                    placeholder="••••"
                    className="h-11 rounded-xl text-center text-lg font-mono tracking-widest font-black"
                  />
                </div>
              </div>
            </div>

            {/* Step 1 Actions */}
            <div className="pt-2 space-y-2.5">
              <Button
                type="submit"
                className="w-full h-12 rounded-xl bg-linear-to-r from-cyan-600 via-blue-600 to-indigo-600 text-white font-bold text-sm shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
              >
                <span>{isRtl ? "متابعة: إدخال بيانات الجمعية" : "Continue: Association Details"}</span>
                {isRtl ? <ArrowLeft className="h-4 w-4 ms-2" /> : <ArrowRight className="h-4 w-4 ms-2" />}
              </Button>

              <div className="relative py-1">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-[10px] uppercase">
                  <span className="bg-background px-3 text-muted-foreground font-medium">
                    {isRtl ? "أو تجربة سريعة" : "or quick preview"}
                  </span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                disabled={isSeeding}
                onClick={handleDemoRegistration}
                className="w-full h-11 rounded-xl border-amber-500/40 bg-amber-500/5 text-amber-800 dark:text-amber-300 hover:bg-amber-500/15 text-xs font-bold transition-all cursor-pointer"
              >
                <Sparkles className="h-4 w-4 me-2 text-amber-500" />
                <span>
                  {isRtl
                    ? "تحميل نموذج تجريبي جاهز (دوار أيت بوعزة • PIN: 1234)"
                    : "Load Demo Association (Sample Data • PIN: 1234)"}
                </span>
              </Button>
            </div>
          </form>
        )}

        {/* STEP 2: Association Details & Tariffs */}
        {step === 2 && (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="space-y-3">
              {/* Association Name */}
              <div className="space-y-1.5">
                <Label htmlFor="reg-assoc-name" className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
                  <span>{isRtl ? "اسم الجمعية *" : "Association Name *"}</span>
                </Label>
                <Input
                  id="reg-assoc-name"
                  value={formData.associationName}
                  onChange={(e) => setFormData({ ...formData, associationName: e.target.value })}
                  placeholder={isRtl ? "مثال: جمعية الأمل لمستخدمي مياه الشرب" : "e.g. Al-Amal Drinking Water Association"}
                  required
                  autoFocus
                  className="h-11 rounded-xl text-sm"
                />
              </div>

              {/* Village / Douar & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="reg-village" className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                    <span>{isRtl ? "اسم الدوار / القرية" : "Douar / Village"}</span>
                  </Label>
                  <Input
                    id="reg-village"
                    value={formData.villageName}
                    onChange={(e) => setFormData({ ...formData, villageName: e.target.value })}
                    placeholder={isRtl ? "مثال: دوار أيت علي" : "e.g. Douar Ait Ali"}
                    className="h-11 rounded-xl text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="reg-phone" className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>{isRtl ? "هاتف الجمعية" : "Phone Number"}</span>
                  </Label>
                  <Input
                    id="reg-phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder={isRtl ? "0600000000" : "+212 600-000000"}
                    className="h-11 rounded-xl text-sm"
                  />
                </div>
              </div>

              {/* Association Creation / Reference Date */}
              <div className="space-y-1.5">
                <Label htmlFor="reg-creation-date" className="text-xs font-bold text-foreground flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
                    <span>{isRtl ? "تاريخ التأسيس / التاريخ المرجعي للحسابات *" : "Creation / Accounting Reference Date *"}</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground font-normal">
                    {isRtl ? "مرجع بداية الحسابات" : "Baseline Date"}
                  </span>
                </Label>
                <Input
                  id="reg-creation-date"
                  type="date"
                  value={formData.creationDate}
                  onChange={(e) => setFormData({ ...formData, creationDate: e.target.value })}
                  required
                  className="h-11 rounded-xl text-sm font-semibold"
                />
                <span className="text-[10px] text-muted-foreground block">
                  {isRtl
                    ? "* يُعتمد هذا التاريخ كمرجع لبداية احتساب الدورات الشهرية ومؤشرات الانطلاق."
                    : "* Baseline reference for initial meter indexes and monthly billing cycles."}
                </span>
              </div>

              {/* Tariffs Section */}
              <div className="p-3.5 rounded-2xl bg-muted/50 border border-border/80 space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                  <Coins className="h-4 w-4 text-amber-500" />
                  <span>{isRtl ? "تعريفة الماء المعمول بها في الدوار" : "Village Water Tariffs"}</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="reg-price-m3" className="text-[11px] font-semibold text-muted-foreground">
                      {isRtl ? "سعر المتر المكعب (درهم)" : "Price per m³ (MAD)"}
                    </Label>
                    <Input
                      id="reg-price-m3"
                      type="number"
                      step="0.1"
                      min="0"
                      inputMode="decimal"
                      value={formData.pricePerM3MAD}
                      onChange={(e) => setFormData({ ...formData, pricePerM3MAD: e.target.value })}
                      className="h-10 rounded-lg text-sm font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="reg-fixed-fee" className="text-[11px] font-semibold text-muted-foreground">
                      {isRtl ? "واجب الصيانة الشهري (درهم)" : "Monthly Fee (MAD)"}
                    </Label>
                    <Input
                      id="reg-fixed-fee"
                      type="number"
                      step="0.5"
                      min="0"
                      inputMode="decimal"
                      value={formData.fixedFeeMAD}
                      onChange={(e) => setFormData({ ...formData, fixedFeeMAD: e.target.value })}
                      className="h-10 rounded-lg text-sm font-bold"
                    />
                  </div>
                </div>
                <p className="text-[10px] text-muted-foreground">
                  {isRtl
                    ? "* يمكنك تغيير هذه الأثمنة في أي وقت لاحقاً من قائمة الإعدادات."
                    : "* You can adjust these prices anytime in settings."}
                </p>
              </div>

              {/* Monthly Reading Period & Verification Day Section */}
              <div className="p-3.5 rounded-2xl bg-cyan-500/5 border border-cyan-500/20 space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                  <Calendar className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                  <span>{isRtl ? "فترة القراءة الشهرية والمراقبة" : "Reading Period & Verification Day"}</span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1">
                    <Label htmlFor="reg-reading-start" className="text-[11px] font-semibold text-muted-foreground">
                      {isRtl ? "بداية القراءة" : "Start Day"}
                    </Label>
                    <Input
                      id="reg-reading-start"
                      type="number"
                      min="1"
                      max="31"
                      value={formData.readingStartDay}
                      onChange={(e) => setFormData({ ...formData, readingStartDay: e.target.value })}
                      className="h-10 rounded-lg text-sm font-bold text-cyan-600 dark:text-cyan-400"
                    />
                    <span className="text-[9px] text-muted-foreground block truncate">
                      {isRtl ? "يوم 24" : "Day 24"}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="reg-reading-end" className="text-[11px] font-semibold text-muted-foreground">
                      {isRtl ? "نهاية القراءة" : "End Day"}
                    </Label>
                    <Input
                      id="reg-reading-end"
                      type="number"
                      min="1"
                      max="31"
                      value={formData.readingEndDay}
                      onChange={(e) => setFormData({ ...formData, readingEndDay: e.target.value })}
                      className="h-10 rounded-lg text-sm font-bold text-cyan-600 dark:text-cyan-400"
                    />
                    <span className="text-[9px] text-muted-foreground block truncate">
                      {isRtl ? "يوم 27 (3 أيام)" : "Day 27 (3 days)"}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="reg-verification-day" className="text-[11px] font-semibold text-muted-foreground">
                      {isRtl ? "يوم المراقبة" : "Verification"}
                    </Label>
                    <Input
                      id="reg-verification-day"
                      type="number"
                      min="1"
                      max="31"
                      value={formData.verificationDay}
                      onChange={(e) => setFormData({ ...formData, verificationDay: e.target.value })}
                      className="h-10 rounded-lg text-sm font-bold text-amber-600 dark:text-amber-400"
                    />
                    <span className="text-[9px] text-muted-foreground block truncate">
                      {isRtl ? "يوم 28 (يوم واحد)" : "Day 28 (1 day)"}
                    </span>
                  </div>
                </div>

                <div className="text-[10px] text-cyan-800 dark:text-cyan-300 font-medium">
                  {isRtl
                    ? `* القراءة: من 24 إلى 27 من كل شهر (مدة 3 أيام) • المراقبة: يوم 28 شهرياً.`
                    : `* Reading: 24 to 27 each month (3 days) • Verification: Day 28.`}
                </div>
              </div>
            </div>

            {/* Step 2 Actions */}
            <div className="pt-2 flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(1)}
                className="h-12 px-5 rounded-xl text-xs font-semibold"
              >
                {isRtl ? <ArrowRight className="h-4 w-4 me-1.5" /> : <ArrowLeft className="h-4 w-4 me-1.5" />}
                <span>{isRtl ? "السابق" : "Back"}</span>
              </Button>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 h-12 rounded-xl bg-linear-to-r from-cyan-600 via-blue-600 to-indigo-600 text-white font-bold text-sm shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
              >
                <CheckCircle2 className="h-4 w-4 me-2" />
                <span>{isRtl ? "تأكيد التسجيل وتفعيل المنظومة" : "Complete Registration & Launch"}</span>
              </Button>
            </div>
          </form>
        )}

        {/* Footer info banner */}
        <div className="bg-muted/40 p-3 px-6 border-t flex items-center justify-center gap-2 text-[11px] text-muted-foreground font-medium">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
          <span>
            {isRtl
              ? "بياناتكم مشفرة ومحفوظة بالكامل على جهازكم دون مشاركة خارجية"
              : "All data stays safely stored on your local device"}
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
