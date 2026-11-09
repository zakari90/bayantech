"use client";

import React, { useState } from "react";
import { useLocale } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Droplets, Sparkles, CheckCircle2, Lock, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { updateSettings } from "@/app/waterdexiedb/repositories/settingsRepo";
import { madToCentimes } from "@/app/waterdexiedb/billing";
import { seedSampleVillageData } from "@/app/waterdexiedb/sampleData";
import { setAuthenticatedSession } from "@/app/waterdexiedb/auth";

interface OnboardingDialogProps {
  open: boolean;
  onCompleted: () => void;
}

export function OnboardingDialog({ open, onCompleted }: OnboardingDialogProps) {
  const locale = useLocale();
  const isRtl = locale === "ar";

  const [associationName, setAssociationName] = useState("جمعية مستخدمي مياه الشرب");
  const [villageName, setVillageName] = useState("");
  const [pricePerM3MAD, setPricePerM3MAD] = useState("5.00");
  const [fixedFeeMAD, setFixedFeeMAD] = useState("10.00");
  const [pinCode, setPinCode] = useState("1234");
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveCustom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pinCode.trim().length < 4) {
      toast.error(isRtl ? "رمز المرور يجب أن يتكون من 4 أرقام على الأقل" : "Passcode must be at least 4 digits");
      return;
    }

    try {
      setIsSaving(true);
      await updateSettings({
        associationName: associationName.trim() || (isRtl ? "جمعية الماء" : "Water Association"),
        villageName: villageName.trim(),
        pricePerM3: madToCentimes(parseFloat(pricePerM3MAD) || 5),
        fixedFee: madToCentimes(parseFloat(fixedFeeMAD) || 10),
        pinCode: pinCode.trim(),
        pinEnabled: true,
        onboardingCompleted: true,
      });
      setAuthenticatedSession();
      toast.success(isRtl ? "تم إعداد الجمعية وتأمين الحساب بنجاح!" : "Association configured & secured successfully!");
      onCompleted();
    } catch (err) {
      toast.error(isRtl ? "حدث خطأ أثناء الحفظ" : "Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLoadDemo = async () => {
    try {
      setIsSaving(true);
      await seedSampleVillageData();
      setAuthenticatedSession();
      toast.success(isRtl ? "مرحباً بك! تم تجهيز بيانات دوار عين الخير بنجاح (PIN: 1234)." : "Welcome! Demo village data ready (PIN: 1234).");
      onCompleted();
    } catch (err) {
      toast.error(isRtl ? "فشل تحميل البيانات" : "Failed to seed demo");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent className="max-w-md p-6 overflow-hidden rounded-2xl">
        <DialogHeader className="text-start space-y-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
            <Droplets className="h-6 w-6" />
          </div>
          <DialogTitle className="text-xl font-black">
            {isRtl ? "مرحباً بكم في منصة تسيير جمعية الماء" : "Welcome to Water Association Manager"}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
            {isRtl
              ? "نظام رقمي بسيط وخاص يعمل على هاتفك بالكامل دون الحاجة للأنترنت. قم بإدخال بيانات الجمعية للبدء، أو جرب بيانات قرية نموذجية."
              : "A simple, offline-first tool designed for phone usage. Enter your association details or load sample village data."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSaveCustom} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="assoc-name" className="text-xs font-semibold">
              {isRtl ? "اسم الجمعية" : "Association Name"}
            </Label>
            <Input
              id="assoc-name"
              value={associationName}
              onChange={(e) => setAssociationName(e.target.value)}
              placeholder={isRtl ? "مثال: جمعية عين الصفا لمياه الشرب" : "e.g. Ain Safa Water Association"}
              required
              className="h-10 text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="village-name" className="text-xs font-semibold">
              {isRtl ? "اسم الدوار / القرية" : "Village / Douar Name"}
            </Label>
            <Input
              id="village-name"
              value={villageName}
              onChange={(e) => setVillageName(e.target.value)}
              placeholder={isRtl ? "مثال: دوار أولاد يحيى" : "e.g. Douar Ouled Yahya"}
              className="h-10 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="price-m3" className="text-xs font-semibold">
                {isRtl ? "سعر المتر المكعب (درهم)" : "Price per m³ (MAD)"}
              </Label>
              <Input
                id="price-m3"
                type="number"
                step="0.1"
                min="0"
                inputMode="decimal"
                value={pricePerM3MAD}
                onChange={(e) => setPricePerM3MAD(e.target.value)}
                required
                className="h-10 text-sm font-semibold"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="fixed-fee" className="text-xs font-semibold">
                {isRtl ? "واجب الصيانة الشهري (درهم)" : "Monthly Fixed Fee (MAD)"}
              </Label>
              <Input
                id="fixed-fee"
                type="number"
                step="0.5"
                min="0"
                inputMode="decimal"
                value={fixedFeeMAD}
                onChange={(e) => setFixedFeeMAD(e.target.value)}
                required
                className="h-10 text-sm font-semibold"
              />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-muted/60 border border-border/80 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
              <Lock className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
              <span>{isRtl ? "رمز المرور السري للمشرف (PIN)" : "Admin Passcode (PIN)"}</span>
            </div>
            <Input
              id="pin-code"
              type="password"
              inputMode="numeric"
              maxLength={6}
              value={pinCode}
              onChange={(e) => setPinCode(e.target.value.replace(/\D/g, ""))}
              placeholder="••••"
              required
              className="h-10 text-center font-mono tracking-widest text-base font-black bg-background"
            />
            <p className="text-[10px] text-muted-foreground">
              {isRtl
                ? "احفظ هذا الرمز؛ سيطلبه منك التطبيق عند تسجيل الدخول لحماية السجلات."
                : "Save this code; you will need it to login and manage the association."}
            </p>
          </div>

          <div className="pt-2 space-y-2">
            <Button
              type="submit"
              disabled={isSaving}
              className="w-full h-11 rounded-xl bg-linear-to-r from-cyan-600 to-blue-600 text-white font-bold text-sm shadow-md shadow-blue-500/20"
            >
              <CheckCircle2 className="h-4 w-4 me-2" />
              <span>{isRtl ? "حفظ وبدء الاستخدام" : "Save & Get Started"}</span>
            </Button>

            <div className="relative py-1">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase">
                <span className="bg-background px-2 text-muted-foreground">{isRtl ? "أو" : "or"}</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              disabled={isSaving}
              onClick={handleLoadDemo}
              className="w-full h-10 rounded-xl border-amber-500/30 bg-amber-500/5 text-amber-700 dark:text-amber-400 hover:bg-amber-500/15 text-xs font-semibold"
            >
              <Sparkles className="h-4 w-4 me-1.5 text-amber-500" />
              <span>{isRtl ? "تحميل بيانات تجريبية (دوار أيت بوعزة)" : "Load Demo Village Data"}</span>
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
