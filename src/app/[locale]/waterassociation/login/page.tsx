"use client";

import React, { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { Link } from "@/i18n/navigation";
import {
  KeyRound,
  ShieldCheck,
  Droplets,
  ArrowRight,
  ArrowLeft,
  Lock,
  Unlock,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  Delete,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  getSettings,
  verifyPinCode,
  isSecurityPinEnabled,
  isUserAuthenticated,
} from "@/app/waterdexiedb";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { ModeToggle } from "@/components/ModeToggle";
import { toast } from "sonner";

export default function WaterAssociationLoginPage() {
  const locale = useLocale();
  const isRtl = locale === "ar";
  const router = useRouter();

  const [pin, setPin] = useState("");
  const [associationName, setAssociationName] = useState("");
  const [villageName, setVillageName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [pinEnabled, setPinEnabled] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    async function loadInfo() {
      // If already logged in, redirect straight to dashboard
      if (isUserAuthenticated()) {
        router.replace(`/${locale}/waterassociation/waterassociationmanager`);
        return;
      }

      const s = await getSettings();
      if (!s.onboardingCompleted) {
        router.replace(`/${locale}/waterassociation?setup=true`);
        return;
      }
      setAssociationName(s.associationName);
      setVillageName(s.villageName || "");
      const enabled = Boolean(s.pinEnabled);
      setPinEnabled(enabled);

      // If PIN is not enabled, user can enter freely
      if (!enabled) {
        // Automatically allow access if PIN lock isn't configured
        router.replace(`/${locale}/waterassociation/waterassociationmanager`);
      }
    }
    loadInfo();
  }, [locale, router]);

  const handleKeyPress = (num: string) => {
    setErrorMsg("");
    if (pin.length < 6) {
      setPin((prev) => prev + num);
    }
  };

  const handleDelete = () => {
    setErrorMsg("");
    setPin((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    setErrorMsg("");
    setPin("");
  };

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!pin) {
      setErrorMsg(isRtl ? "يرجى إدخال رمز المرور" : "Please enter passcode");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");

    try {
      const valid = await verifyPinCode(pin);
      if (valid) {
        toast.success(
          isRtl ? "مرحباً بكم في لوحة التسيير" : "Passcode verified! Welcome back"
        );
        router.push(`/${locale}/waterassociation/waterassociationmanager`);
      } else {
        setErrorMsg(isRtl ? "رمز المرور غير صحيح" : "Incorrect passcode");
        setPin("");
      }
    } catch (err) {
      console.error("Login verification error:", err);
      setErrorMsg(isRtl ? "حدث خطأ أثناء التحقق" : "Verification error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-background via-muted/30 to-background flex flex-col justify-between p-4 selection:bg-cyan-500/20">
      {/* Header Bar */}
      <header className="w-full max-w-5xl mx-auto flex items-center justify-between py-2 px-2">
        <Link
          href="/waterassociation"
          className="flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors group"
        >
          {isRtl ? <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /> : <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />}
          <span>{isRtl ? "العودة للرئيسية" : "Back to Home"}</span>
        </Link>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <ModeToggle />
        </div>
      </header>

      {/* Main Login Card */}
      <main className="w-full max-w-sm mx-auto my-auto py-6">
        <Card className="rounded-3xl border border-border/80 shadow-2xl bg-card/95 backdrop-blur-xl overflow-hidden">
          {/* Brand & Association Header */}
          <div className="bg-linear-to-br from-cyan-600 via-blue-600 to-indigo-700 p-6 text-white text-center relative overflow-hidden">
            <div className="relative z-10 flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner">
                <Lock className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-black tracking-tight leading-tight">
                  {associationName || (isRtl ? "تسيير جمعية الماء" : "Water Association")}
                </h1>
                <p className="text-xs text-white/80 mt-0.5 font-medium">
                  {villageName || (isRtl ? "النسخة المحلية المستقلة" : "Local Edition")}
                </p>
              </div>
            </div>
            {/* Ambient Background blur */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
          </div>

          <CardContent className="p-6 space-y-6">
            <div className="text-center space-y-1">
              <h2 className="text-base font-bold text-foreground">
                {isRtl ? "تسجيل الدخول إلى لوحة القيادة" : "Enter Passcode"}
              </h2>
              <p className="text-xs text-muted-foreground">
                {isRtl
                  ? "أدخل رمز المرور السري (PIN) الخاص بالمسيرين"
                  : "Enter the security passcode to access management"}
              </p>
            </div>

            {/* PIN Code Visual Indicators */}
            <div className="flex justify-center items-center gap-3 py-2">
              {[0, 1, 2, 3].map((idx) => (
                <div
                  key={idx}
                  className={`w-4 h-4 rounded-full transition-all duration-200 ${
                    pin.length > idx
                      ? "bg-blue-600 dark:bg-cyan-400 scale-110 shadow-sm shadow-blue-500/50"
                      : "border-2 border-muted-foreground/30 bg-muted/20"
                  }`}
                />
              ))}
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="p-2.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center justify-center gap-1.5 font-medium animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Numeric Keypad (Optimized for mobile & touchscreen) */}
            <div className="grid grid-cols-3 gap-2 sm:gap-2.5 max-w-[260px] mx-auto">
              {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
                <Button
                  key={num}
                  type="button"
                  variant="outline"
                  onClick={() => handleKeyPress(num)}
                  className="h-12 text-lg font-bold rounded-2xl hover:bg-primary hover:text-primary-foreground active:scale-95 transition-all shadow-xs"
                >
                  {num}
                </Button>
              ))}
              <Button
                type="button"
                variant="ghost"
                onClick={handleClear}
                className="h-12 text-xs font-semibold rounded-2xl text-muted-foreground hover:text-foreground"
              >
                {isRtl ? "مسح" : "Clear"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleKeyPress("0")}
                className="h-12 text-lg font-bold rounded-2xl hover:bg-primary hover:text-primary-foreground active:scale-95 transition-all shadow-xs"
              >
                0
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={handleDelete}
                className="h-12 rounded-2xl text-muted-foreground hover:text-destructive flex items-center justify-center"
              >
                <Delete className="w-5 h-5" />
              </Button>
            </div>

            {/* Submit Button */}
            <Button
              onClick={() => handleLogin()}
              disabled={isLoading || pin.length === 0}
              className="w-full h-12 rounded-2xl bg-linear-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 active:scale-[0.98] transition-all cursor-pointer"
            >
              <Unlock className="w-4 h-4 me-2" />
              <span>{isLoading ? (isRtl ? "جارٍ التحقق..." : "Verifying...") : (isRtl ? "تأكيد والدخول" : "Verify & Login")}</span>
            </Button>

            {/* Note & Hint */}
            <div className="text-center pt-2 border-t border-border/50">
              <p className="text-[11px] text-muted-foreground flex items-center justify-center gap-1">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>
                  {isRtl
                    ? "الرمز الافتراضي للتجربة هو: 1234 (يمكن تغييره من الإعدادات)"
                    : "Default demo PIN is: 1234 (configurable in Settings)"}
                </span>
              </p>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-muted-foreground py-2">
        <p>{isRtl ? "نظام حماية وتسيير جمعيات الماء • يعمل 100% بدون إنترنت" : "Water Association Security System • 100% Offline"}</p>
      </footer>
    </div>
  );
}
