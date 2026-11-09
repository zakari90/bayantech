"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  Droplets,
  Users,
  Gauge,
  CreditCard,
  TrendingDown,
  FileSpreadsheet,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  MessageCircle,
  Printer,
  ShieldCheck,
  WifiOff,
  HelpCircle,
  Building2,
  Compass,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { WaterRegistrationDialog } from "@/components/watermanagemtcomponents/WaterRegistrationDialog";
import { getSettings } from "@/app/waterdexiedb";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { ModeToggle } from "@/components/ModeToggle";
import PublicFooter from "@/components/PublicFooter";

export default function HowItWorksPage() {
  const t = useTranslations("HowItWorks");
  const locale = useLocale();
  const isRtl = locale === "ar";

  const [registerOpen, setRegisterOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [isOnboarded, setIsOnboarded] = useState<boolean>(false);

  useEffect(() => {
    async function checkState() {
      try {
        const s = await getSettings();
        setIsOnboarded(Boolean(s.onboardingCompleted));
      } catch {
        setIsOnboarded(false);
      }
    }
    checkState();
  }, []);

  // 5 Steps of the Association Operating Rhythm
  const steps = useMemo(
    () => [
      {
        number: 1,
        title: t("steps.step1.title"),
        subtitle: t("steps.step1.subtitle"),
        icon: Users,
        color: "from-blue-500 to-cyan-500",
        description: t("steps.step1.description"),
        points: [
          t("steps.step1.point1"),
          t("steps.step1.point2"),
          t("steps.step1.point3"),
          t("steps.step1.point4"),
        ],
        mockup: {
          title: t("steps.step1.mockupTitle"),
          tag: t("steps.step1.mockupTag"),
          name: t("steps.step1.mockupName"),
          meta: t("steps.step1.mockupMeta"),
          field1Label: t("steps.step1.field1Label"),
          field1Value: t("steps.step1.field1Value"),
          field2Label: t("steps.step1.field2Label"),
          field2Value: t("steps.step1.field2Value"),
          statusText: t("steps.step1.statusText"),
          statusBadge: t("steps.step1.statusBadge"),
        },
        tip: t("steps.step1.tip"),
      },
      {
        number: 2,
        title: t("steps.step2.title"),
        subtitle: t("steps.step2.subtitle"),
        icon: Gauge,
        color: "from-cyan-500 to-teal-500",
        description: t("steps.step2.description"),
        points: [
          t("steps.step2.point1"),
          t("steps.step2.point2"),
          t("steps.step2.point3"),
          t("steps.step2.point4"),
        ],
        mockup: {
          title: t("steps.step2.mockupTitle"),
          tag: t("steps.step2.mockupTag"),
          name: t("steps.step2.mockupName"),
          meta: t("steps.step2.mockupMeta"),
          field1Label: t("steps.step2.field1Label"),
          field1Value: t("steps.step2.field1Value"),
          field2Label: t("steps.step2.field2Label"),
          field2Value: t("steps.step2.field2Value"),
          statusText: t("steps.step2.statusText"),
          statusBadge: t("steps.step2.statusBadge"),
        },
        tip: t("steps.step2.tip"),
      },
      {
        number: 3,
        title: t("steps.step3.title"),
        subtitle: t("steps.step3.subtitle"),
        icon: CreditCard,
        color: "from-emerald-500 to-green-600",
        description: t("steps.step3.description"),
        points: [
          t("steps.step3.point1"),
          t("steps.step3.point2"),
          t("steps.step3.point3"),
          t("steps.step3.point4"),
        ],
        mockup: {
          title: t("steps.step3.mockupTitle"),
          tag: t("steps.step3.mockupTag"),
          name: t("steps.step3.mockupName"),
          meta: t("steps.step3.mockupMeta"),
          field1Label: t("steps.step3.field1Label"),
          field1Value: t("steps.step3.field1Value"),
          field2Label: t("steps.step3.field2Label"),
          field2Value: t("steps.step3.field2Value"),
          statusText: t("steps.step3.statusText"),
          statusBadge: t("steps.step3.statusBadge"),
        },
        tip: t("steps.step3.tip"),
      },
      {
        number: 4,
        title: t("steps.step4.title"),
        subtitle: t("steps.step4.subtitle"),
        icon: TrendingDown,
        color: "from-rose-500 to-orange-500",
        description: t("steps.step4.description"),
        points: [
          t("steps.step4.point1"),
          t("steps.step4.point2"),
          t("steps.step4.point3"),
          t("steps.step4.point4"),
        ],
        mockup: {
          title: t("steps.step4.mockupTitle"),
          tag: t("steps.step4.mockupTag"),
          name: t("steps.step4.mockupName"),
          meta: t("steps.step4.mockupMeta"),
          field1Label: t("steps.step4.field1Label"),
          field1Value: t("steps.step4.field1Value"),
          field2Label: t("steps.step4.field2Label"),
          field2Value: t("steps.step4.field2Value"),
          statusText: t("steps.step4.statusText"),
          statusBadge: t("steps.step4.statusBadge"),
        },
        tip: t("steps.step4.tip"),
      },
      {
        number: 5,
        title: t("steps.step5.title"),
        subtitle: t("steps.step5.subtitle"),
        icon: FileSpreadsheet,
        color: "from-indigo-600 to-purple-600",
        description: t("steps.step5.description"),
        points: [
          t("steps.step5.point1"),
          t("steps.step5.point2"),
          t("steps.step5.point3"),
          t("steps.step5.point4"),
        ],
        mockup: {
          title: t("steps.step5.mockupTitle"),
          tag: t("steps.step5.mockupTag"),
          name: t("steps.step5.mockupName"),
          meta: t("steps.step5.mockupMeta"),
          field1Label: t("steps.step5.field1Label"),
          field1Value: t("steps.step5.field1Value"),
          field2Label: t("steps.step5.field2Label"),
          field2Value: t("steps.step5.field2Value"),
          statusText: t("steps.step5.statusText"),
          statusBadge: t("steps.step5.statusBadge"),
        },
        tip: t("steps.step5.tip"),
      },
    ],
    [t]
  );

  const currentStepData = steps.find((s) => s.number === activeStep) || steps[0];

  const benefits = useMemo(
    () => [
      {
        icon: WifiOff,
        title: t("benefits.card1Title"),
        desc: t("benefits.card1Desc"),
        iconColor: "text-cyan-600 dark:text-cyan-400",
        iconBg: "bg-cyan-500/10",
      },
      {
        icon: MessageCircle,
        title: t("benefits.card2Title"),
        desc: t("benefits.card2Desc"),
        iconColor: "text-emerald-600 dark:text-emerald-400",
        iconBg: "bg-emerald-500/10",
      },
      {
        icon: Printer,
        title: t("benefits.card3Title"),
        desc: t("benefits.card3Desc"),
        iconColor: "text-blue-600 dark:text-blue-400",
        iconBg: "bg-blue-500/10",
      },
      {
        icon: ShieldCheck,
        title: t("benefits.card4Title"),
        desc: t("benefits.card4Desc"),
        iconColor: "text-indigo-600 dark:text-indigo-400",
        iconBg: "bg-indigo-500/10",
      },
    ],
    [t]
  );

  const faqs = useMemo(
    () => [
      { q: t("faq.q1"), a: t("faq.a1") },
      { q: t("faq.q2"), a: t("faq.a2") },
      { q: t("faq.q3"), a: t("faq.a3") },
      { q: t("faq.q4"), a: t("faq.a4") },
    ],
    [t]
  );

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col antialiased selection:bg-cyan-500/20">
      {/* 1. Global Navigation Bar */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/90 backdrop-blur-md supports-backdrop-filter:bg-background/80">
        <div className="flex h-16 items-center justify-between px-4 sm:px-8 max-w-6xl mx-auto">
          {/* Logo & Brand */}
          <Link
            href="/waterassociation"
            className="flex items-center gap-2.5 group transition-transform hover:scale-[1.02]"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-cyan-500 via-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25">
              <Droplets className="h-5 w-5 fill-white/20 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-base sm:text-lg tracking-tight bg-linear-to-r from-blue-600 via-cyan-600 to-indigo-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent">
                  {t("nav.brandName")}
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/20">
                  {t("nav.brandSubtitle")}
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground hidden sm:block">
                {t("nav.brandDesc")}
              </p>
            </div>
          </Link>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/waterassociation">
              <Button
                variant="ghost"
                size="sm"
                className="h-9 px-3 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer"
              >
                {isRtl ? <ArrowRight className="h-3.5 w-3.5 me-1" /> : <ArrowLeft className="h-3.5 w-3.5 me-1" />}
                <span>{t("nav.home")}</span>
              </Button>
            </Link>

            {isOnboarded ? (
              <Link href="/waterassociation/waterassociationmanager">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 px-3.5 rounded-xl border-border hover:bg-muted font-bold text-xs cursor-pointer"
                >
                  <Compass className="h-3.5 w-3.5 me-1 text-blue-600 dark:text-cyan-400" />
                  <span>{t("nav.dashboard")}</span>
                </Button>
              </Link>
            ) : (
              <Button
                size="sm"
                onClick={() => setRegisterOpen(true)}
                className="h-9 px-3.5 rounded-xl bg-linear-to-r from-cyan-600 via-blue-600 to-indigo-600 text-white font-bold text-xs shadow-xs hover:scale-[1.02] cursor-pointer"
              >
                <Building2 className="h-3.5 w-3.5 me-1" />
                <span>{t("nav.register")}</span>
              </Button>
            )}

            <LanguageSwitcher />
            <ModeToggle />
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-8 lg:px-10 py-10 sm:py-16 space-y-16 sm:space-y-20 w-full">
        {/* 2. Hero Section */}
        <section className="relative overflow-hidden rounded-3xl bg-linear-to-b from-cyan-500/10 via-blue-500/5 to-card border border-cyan-500/25 p-8 sm:p-14 lg:p-16 text-center shadow-lg shadow-cyan-500/5">
          <div className="absolute top-0 start-1/2 -translate-x-1/2 w-96 h-40 bg-cyan-400/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative max-w-2xl mx-auto space-y-6">
            <Badge
              variant="outline"
              className="px-3.5 py-1 text-xs font-bold border-cyan-500/30 bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 rounded-full"
            >
              <Sparkles className="h-3.5 w-3.5 me-1.5 text-cyan-600 dark:text-cyan-400" />
              <span>{t("hero.badge")}</span>
            </Badge>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-foreground tracking-tight leading-snug sm:leading-tight">
              {t("hero.titlePrefix")}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-600 via-blue-600 to-indigo-600 dark:from-cyan-400 dark:to-blue-400">
                {t("hero.titleHighlight")}
              </span>
              {t("hero.titleSuffix")}
            </h1>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-xl mx-auto">
              {t("hero.subtitle")}
            </p>

            {/* Registration & Dashboard Action Buttons */}
            <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3" suppressHydrationWarning>
              {isOnboarded ? (
                <Link href="/waterassociation/waterassociationmanager" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto h-12 px-7 rounded-2xl bg-linear-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-700 hover:to-indigo-700 text-white font-bold text-sm shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                  >
                    <Compass className="h-5 w-5 me-2" />
                    <span>{t("hero.ctaDashboard")}</span>
                    {isRtl ? <ArrowLeft className="h-4 w-4 ms-2" /> : <ArrowRight className="h-4 w-4 ms-2" />}
                  </Button>
                </Link>
              ) : (
                <Button
                  size="lg"
                  onClick={() => setRegisterOpen(true)}
                  className="w-full sm:w-auto h-12 px-7 rounded-2xl bg-linear-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-700 hover:to-indigo-700 text-white font-bold text-sm shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                >
                  <Building2 className="h-5 w-5 me-2" />
                  <span>{t("hero.ctaRegister")}</span>
                  {isRtl ? <ArrowLeft className="h-4 w-4 ms-2" /> : <ArrowRight className="h-4 w-4 ms-2" />}
                </Button>
              )}
            </div>

            {/* Feature Guarantees */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>{t("hero.guaranteeOffline")}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>{t("hero.guaranteePrivacy")}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>{t("hero.guaranteeReceipts")}</span>
              </span>
            </div>
          </div>
        </section>

        {/* 3. Interactive 5-Step Process Switcher */}
        <section className="space-y-6">
          <div className="text-center space-y-1.5">
            <h2 className="text-xl sm:text-2xl font-black text-foreground">
              {t("stepsSection.title")}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {t("stepsSection.subtitle")}
            </p>
          </div>

          {/* Step Selector Buttons (Responsive Grid) */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
            {steps.map((step) => {
              const Icon = step.icon;
              const isSelected = activeStep === step.number;
              return (
                <button
                  key={step.number}
                  type="button"
                  onClick={() => setActiveStep(step.number)}
                  className={`p-4 sm:p-5 rounded-2xl border text-start transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? "bg-card border-blue-500/70 shadow-lg shadow-blue-500/15 ring-2 ring-blue-500/30 scale-[1.02]"
                      : "bg-muted/40 border-border/70 hover:bg-muted/80 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-3">
                    <div
                      className={`h-9 w-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                        isSelected
                          ? "bg-linear-to-br from-cyan-500 to-blue-600 text-white shadow-sm"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {step.number}
                    </div>
                    <Icon
                      className={`h-4 w-4 ${
                        isSelected ? "text-blue-600 dark:text-cyan-400" : "text-muted-foreground/60"
                      }`}
                    />
                  </div>
                  <div>
                    <div className={`text-xs sm:text-sm font-bold leading-snug line-clamp-2 ${isSelected ? "text-foreground" : ""}`}>
                      {step.title}
                    </div>
                    <div className="text-[10px] sm:text-xs text-muted-foreground mt-1">{step.subtitle}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Step Showcase Card */}
          <Card className="rounded-3xl border-border/80 shadow-xl overflow-hidden bg-card">
            <CardContent className="p-6 sm:p-10 lg:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                {/* Left Column: Explanation & Highlights */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-12 w-12 rounded-2xl bg-linear-to-br ${currentStepData.color} text-white flex items-center justify-center shadow-md`}
                    >
                      <currentStepData.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                        {t("stepsSection.phasePrefix")} 0{currentStepData.number} {t("stepsSection.phaseOf")}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-black text-foreground">
                        {currentStepData.title}
                      </h3>
                    </div>
                  </div>

                  <p className="text-sm text-foreground/80 leading-relaxed font-medium">
                    {currentStepData.description}
                  </p>

                  {/* Bullet Points */}
                  <div className="space-y-2.5 pt-1">
                    {currentStepData.points.map((pt, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-muted-foreground">
                        <div className="h-5 w-5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        </div>
                        <span className="leading-snug">{pt}</span>
                      </div>
                    ))}
                  </div>

                  {/* Practical Tip */}
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-xs text-amber-900 dark:text-amber-200 font-medium flex items-start gap-2 leading-relaxed">
                    <span>{currentStepData.tip}</span>
                  </div>
                </div>

                {/* Right Column: Visual Real-Life Mockup Card */}
                <div className="lg:col-span-5">
                  <div className="p-6 sm:p-7 rounded-3xl bg-linear-to-b from-muted/60 to-muted/20 border border-border/80 shadow-inner space-y-5">
                    <div className="flex items-center justify-between pb-3.5 border-b border-border/60">
                      <div className="flex items-center gap-2">
                        <div className="h-2.5 w-2.5 rounded-full bg-cyan-500 animate-pulse" />
                        <span className="text-xs font-bold text-foreground">
                          {currentStepData.mockup.title}
                        </span>
                      </div>
                      <Badge variant="secondary" className="text-[10px] py-0.5 font-bold">
                        {currentStepData.mockup.tag}
                      </Badge>
                    </div>

                    {/* Mockup Card Body */}
                    <div className="p-5 sm:p-6 rounded-2xl bg-card border border-border/70 shadow-sm space-y-4">
                      <div>
                        <div className="text-[11px] text-muted-foreground font-semibold">
                          {t("stepsSection.memberLabel")}
                        </div>
                        <div className="text-sm sm:text-base font-bold text-foreground mt-0.5">
                          {currentStepData.mockup.name}
                        </div>
                      </div>

                      <div className="text-xs text-muted-foreground font-medium flex items-center gap-1.5 pb-3 border-b border-border/50">
                        <span>{currentStepData.mockup.meta}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 pt-1">
                        <div className="p-3 sm:p-3.5 rounded-xl bg-cyan-500/10 text-start">
                          <span className="text-[10px] text-muted-foreground font-medium block">
                            {currentStepData.mockup.field1Label}
                          </span>
                          <span className="text-xs sm:text-sm font-black text-cyan-700 dark:text-cyan-300">
                            {currentStepData.mockup.field1Value}
                          </span>
                        </div>

                        <div className="p-3 sm:p-3.5 rounded-xl bg-emerald-500/10 text-start">
                          <span className="text-[10px] text-muted-foreground font-medium block">
                            {currentStepData.mockup.field2Label}
                          </span>
                          <span className="text-xs sm:text-sm font-black text-emerald-700 dark:text-emerald-400">
                            {currentStepData.mockup.field2Value}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs pt-3 border-t border-border/50">
                        <span className="text-muted-foreground text-[11px] font-medium">
                          {currentStepData.mockup.statusText}
                        </span>
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/15 px-2.5 py-1 rounded-full">
                          {currentStepData.mockup.statusBadge}
                        </span>
                      </div>
                    </div>

                    {/* Step Navigation Controls */}
                    <div className="flex items-center justify-between pt-1 text-xs">
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={activeStep === 1}
                        onClick={() => setActiveStep((prev) => Math.max(1, prev - 1))}
                        className="h-8 px-2 text-xs cursor-pointer"
                      >
                        {isRtl ? <ChevronRight className="h-4 w-4 me-1" /> : <ChevronLeft className="h-4 w-4 me-1" />}
                        <span>{t("stepsSection.prevPhase")}</span>
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={activeStep === 5}
                        onClick={() => setActiveStep((prev) => Math.min(5, prev + 1))}
                        className="h-8 px-2 text-xs font-bold text-blue-600 dark:text-cyan-400 cursor-pointer"
                      >
                        <span>{t("stepsSection.nextPhase")}</span>
                        {isRtl ? <ChevronLeft className="h-4 w-4 ms-1" /> : <ChevronRight className="h-4 w-4 ms-1" />}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* 4. Why Associations Prefer It */}
        <section className="space-y-8 pt-4">
          <div className="text-center space-y-2">
            <Badge variant="outline" className="text-xs font-bold text-primary border-primary/20">
              {t("benefits.badge")}
            </Badge>
            <h2 className="text-xl sm:text-3xl font-black text-foreground">
              {t("benefits.title")}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto">
              {t("benefits.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {benefits.map((b, idx) => {
              const Icon = b.icon;
              return (
                <div
                  key={idx}
                  className="p-6 sm:p-7 rounded-2xl bg-card border border-border/80 shadow-xs hover:shadow-md transition-all space-y-3.5"
                >
                  <div className={`h-11 w-11 rounded-xl ${b.iconBg} ${b.iconColor} flex items-center justify-center`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-sm font-bold text-foreground">
                    {b.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {b.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* 5. Frequently Asked Questions */}
        <section className="space-y-6 pt-4">
          <div className="text-center space-y-1.5">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">
              {t("faq.title")}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {t("faq.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-4xl mx-auto">
            {faqs.map((faq, idx) => (
              <div key={idx} className="p-5 sm:p-6 rounded-2xl bg-card border border-border/70 space-y-2 shadow-xs">
                <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-cyan-600 shrink-0" />
                  <span>{faq.q}</span>
                </h4>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 6. Bottom Call to Action Card */}
        <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-cyan-600 via-blue-600 to-indigo-700 text-white p-8 sm:p-14 lg:p-16 shadow-2xl">
          <div className="absolute top-0 end-0 -mt-10 -me-10 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative max-w-xl mx-auto text-center space-y-5">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md text-white shadow-inner">
              <Droplets className="h-6 w-6 fill-white/20" />
            </div>

            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              {t("ctaBottom.title")}
            </h2>

            <p className="text-xs sm:text-base text-white/90 leading-relaxed max-w-md mx-auto">
              {t("ctaBottom.subtitle")}
            </p>

            <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-4" suppressHydrationWarning>
              {isOnboarded ? (
                <Link href="/waterassociation/waterassociationmanager" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto h-13 px-8 rounded-2xl bg-white text-blue-700 hover:bg-white/90 font-black text-sm shadow-xl shadow-black/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  >
                    <Compass className="h-5 w-5 me-2 text-blue-600" />
                    <span>{t("ctaBottom.ctaDashboard")}</span>
                    {isRtl ? <ArrowLeft className="h-4 w-4 ms-2" /> : <ArrowRight className="h-4 w-4 ms-2" />}
                  </Button>
                </Link>
              ) : (
                <Button
                  size="lg"
                  onClick={() => setRegisterOpen(true)}
                  className="w-full sm:w-auto h-13 px-8 rounded-2xl bg-white text-blue-700 hover:bg-white/90 font-black text-sm shadow-xl shadow-black/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  <Building2 className="h-5 w-5 me-2 text-blue-600" />
                  <span>{t("ctaBottom.ctaRegister")}</span>
                  {isRtl ? <ArrowLeft className="h-4 w-4 ms-2" /> : <ArrowRight className="h-4 w-4 ms-2" />}
                </Button>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Embedded Registration Dialog */}
      <WaterRegistrationDialog
        open={registerOpen}
        onOpenChange={setRegisterOpen}
        onSuccess={() => setIsOnboarded(true)}
      />

      {/* Footer */}
      <PublicFooter />
    </div>
  );
}
