"use client";

import Contact from "@/components/Contact";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import MarketingFooter from "@/components/MarketingFooter";
import { Link } from "@/i18n/navigation";
import { FloatingWhatsApp } from "@digicroz/react-floating-whatsapp";
import {
  ArrowDown,
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Cloud,
  Database,
  Droplets,
  FileSpreadsheet,
  Gauge,
  Globe,
  GraduationCap,
  Laptop,
  LogIn,
  Menu,
  MonitorSmartphone,
  Rocket,
  ShieldCheck,
  Sparkles,
  Users,
  WifiOff,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useState } from "react";

const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "212754764704";

type ServiceTab = "center" | "water" | "tools";

export default function SaaSMarketingPage() {
  const locale = useLocale();
  const isRtl = locale === "ar";
  const t = useTranslations("marketing");

  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDetailTab, setActiveDetailTab] = useState<ServiceTab>("center");

  useEffect(() => setMounted(true), []);

  const openDetailTab = (tab: ServiceTab) => {
    setActiveDetailTab(tab);
    setMobileMenuOpen(false);
    const el = document.getElementById("service-details");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const freeFeatures = [
    { text: t("freeFeature1"), icon: <Rocket className="w-5 h-5" /> },
    { text: t("freeFeature2"), icon: <WifiOff className="w-5 h-5" /> },
    { text: t("freeFeature3"), icon: <Users className="w-5 h-5" /> },
    { text: t("freeFeature4"), icon: <ShieldCheck className="w-5 h-5" /> },
  ];

  const paidFeatures = [
    { text: t("paidFeature1"), icon: <Cloud className="w-5 h-5" /> },
    { text: t("paidFeature2"), icon: <Users className="w-5 h-5" /> },
    { text: t("paidFeature3"), icon: <Laptop className="w-5 h-5" /> },
    { text: t("paidFeature4"), icon: <Globe className="w-5 h-5" /> },
    { text: t("paidFeature5"), icon: <Database className="w-5 h-5" /> },
    { text: t("paidFeature6"), icon: <Laptop className="w-5 h-5" /> },
    {
      text: t("paidFeature7"),
      icon: <MonitorSmartphone className="w-5 h-5" />,
    },
    { text: t("paidFeature8"), icon: <ShieldCheck className="w-5 h-5" /> },
    { text: t("paidFeature9"), icon: <Globe className="w-5 h-5" /> },
  ];

  const featuresList = [
    t("featuresList1"),
    t("featuresList2"),
    t("featuresList3"),
    t("featuresList4"),
    t("featuresList5"),
  ];

  return (
    <main
      className="min-h-screen bg-[#0A0A0A] text-white selection:bg-indigo-500/30 overflow-x-hidden font-sans"
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* Background ambient glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-indigo-600/10 blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-cyan-600/10 blur-[120px] mix-blend-screen" />
      </div>

      {/* Sticky Glassmorphic Top Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#0A0A0A]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <a
            href="#"
            className="flex items-center gap-2.5 font-extrabold text-lg tracking-tight text-white shrink-0"
          >
            <Image
              src="/bayyane-logo.webp"
              alt={t("brandName")}
              width={36}
              height={36}
              className="w-9 h-9 rounded-xl object-cover border border-white/15 shadow-lg shadow-indigo-500/10"
              priority
            />
            <span className="bg-linear-to-r from-white to-slate-300 bg-clip-text text-transparent">
              {t("brandName")}
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300">
            <a href="#services" className="hover:text-white transition-colors">
              {t("navServices")}
            </a>
            <button
              type="button"
              onClick={() => openDetailTab("center")}
              className="hover:text-white transition-colors cursor-pointer"
            >
              {t("navCenter")}
            </button>
            <button
              type="button"
              onClick={() => openDetailTab("water")}
              className="hover:text-white transition-colors cursor-pointer"
            >
              {t("navWater")}
            </button>
            <button
              type="button"
              onClick={() => openDetailTab("tools")}
              className="hover:text-white transition-colors cursor-pointer"
            >
              {t("navTools")}
            </button>
            <Link href="/about" className="hover:text-white transition-colors">
              {t("navAbout")}
            </Link>
            <a href="#contact" className="hover:text-white transition-colors">
              {t("navContact")}
            </a>
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-2.5">
            <div className="text-slate-900 dark:text-white">
              <LanguageSwitcher />
            </div>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle Menu"
              className="lg:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-white/10 bg-[#0A0A0A]/95 backdrop-blur-xl px-6 py-4 space-y-3">
            <a
              href="#services"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-medium text-slate-300 hover:text-white"
            >
              {t("navServices")}
            </a>
            <button
              type="button"
              onClick={() => openDetailTab("center")}
              className="block w-full text-start py-2 text-sm font-medium text-slate-300 hover:text-white"
            >
              {t("navCenter")}
            </button>
            <button
              type="button"
              onClick={() => openDetailTab("water")}
              className="block w-full text-start py-2 text-sm font-medium text-slate-300 hover:text-white"
            >
              {t("navWater")}
            </button>
            <button
              type="button"
              onClick={() => openDetailTab("tools")}
              className="block w-full text-start py-2 text-sm font-medium text-slate-300 hover:text-white"
            >
              {t("navTools")}
            </button>
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-medium text-slate-300 hover:text-white"
            >
              {t("navAbout")}
            </Link>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-medium text-slate-300 hover:text-white"
            >
              {t("navContact")}
            </a>
          </div>
        )}
      </header>

      {/* Platform Hero Section */}
      <section className="relative z-10 pt-16 pb-12 px-6 max-w-7xl mx-auto text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight max-w-4xl mx-auto"
        >
          <span className="bg-linear-to-br from-white via-indigo-100 to-cyan-200 bg-clip-text text-transparent">
            {t("heroTitle")}
          </span>
        </motion.h1>
      </section>

      {/* 3-Service Showcase Section */}
      <section id="services" className="relative z-10 py-10 px-6 max-w-7xl mx-auto scroll-mt-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {/* Service 1: Educational Center Management */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative p-7 rounded-3xl bg-linear-to-br from-indigo-950/50 via-slate-900/70 to-violet-950/30 border border-indigo-500/30 backdrop-blur-xl shadow-[0_0_40px_rgba(79,70,229,0.12)] hover:border-indigo-400/50 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-3 mb-5">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-wider">
                  <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
                  {t("serviceCenterBadge")}
                </span>
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-300">
                  <GraduationCap className="w-5 h-5" />
                </div>
              </div>

              <h3 className="text-xl md:text-2xl font-extrabold text-white mb-2.5">
                {t("serviceCenterTitle")}
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-5">
                {t("serviceCenterDesc")}
              </p>

              <ul className="space-y-2.5 mb-6">
                {[
                  t("serviceCenterBullet1"),
                  t("serviceCenterBullet2"),
                  t("serviceCenterBullet3"),
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-5 border-t border-white/10 flex flex-wrap items-center gap-2.5">
              <Link
                href="/free"
                prefetch={true}
                className="flex-1 min-w-[140px] py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition-all inline-flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-600/25"
              >
                <span>{t("serviceCenterCtaPrimary")}</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
              <Link
                href="/pro/login"
                className="py-2.5 px-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white font-semibold text-sm transition-all inline-flex items-center justify-center gap-1.5"
              >
                <LogIn className="w-4 h-4 text-indigo-300" />
                <span>{t("serviceCenterCtaPro")}</span>
              </Link>
              <button
                type="button"
                onClick={() => openDetailTab("center")}
                className="py-2.5 px-2.5 text-xs font-semibold text-indigo-300 hover:text-indigo-200 transition-colors inline-flex items-center gap-1 cursor-pointer"
              >
                <span>{t("serviceCenterCtaMore")}</span>
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>

          {/* Service 2: Water Association Management */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative p-7 rounded-3xl bg-linear-to-br from-cyan-950/50 via-slate-900/70 to-blue-950/30 border border-cyan-500/30 backdrop-blur-xl shadow-[0_0_40px_rgba(6,182,212,0.12)] hover:border-cyan-400/50 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-3 mb-5">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-bold uppercase tracking-wider">
                  <Droplets className="w-3.5 h-3.5 text-cyan-400" />
                  {t("serviceWaterBadge")}
                </span>
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-300">
                  <Droplets className="w-5 h-5" />
                </div>
              </div>

              <h3 className="text-xl md:text-2xl font-extrabold text-white mb-2.5">
                {t("serviceWaterTitle")}
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-5">
                {t("serviceWaterDesc")}
              </p>

              <ul className="space-y-2.5 mb-6">
                {[
                  t("serviceWaterBullet1"),
                  t("serviceWaterBullet2"),
                  t("serviceWaterBullet3"),
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-5 border-t border-white/10 flex flex-wrap items-center gap-2.5">
              <Link
                href="/waterassociation"
                prefetch={true}
                className="flex-1 min-w-[140px] py-2.5 px-4 rounded-xl bg-linear-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-sm transition-all inline-flex items-center justify-center gap-1.5 shadow-lg shadow-cyan-600/25"
              >
                <span>{t("serviceWaterCtaPrimary")}</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
              <Link
                href="/waterassociation/login"
                className="py-2.5 px-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white font-semibold text-sm transition-all inline-flex items-center justify-center gap-1.5"
              >
                <LogIn className="w-4 h-4 text-cyan-300" />
                <span>{t("serviceWaterCtaLogin")}</span>
              </Link>
              <button
                type="button"
                onClick={() => openDetailTab("water")}
                className="py-2.5 px-2.5 text-xs font-semibold text-cyan-300 hover:text-cyan-200 transition-colors inline-flex items-center gap-1 cursor-pointer"
              >
                <span>{t("serviceWaterCtaMore")}</span>
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>

          {/* Service 3: Instant Smart Free Tools */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative p-7 rounded-3xl bg-linear-to-br from-emerald-950/45 via-slate-900/70 to-teal-950/30 border border-emerald-500/30 backdrop-blur-xl shadow-[0_0_40px_rgba(16,185,129,0.12)] hover:border-emerald-400/50 transition-all flex flex-col justify-between md:col-span-2 lg:col-span-1"
          >
            <div>
              <div className="flex items-center justify-between gap-3 mb-5">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  {t("serviceToolsBadge")}
                </span>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-300">
                  <CalendarDays className="w-5 h-5" />
                </div>
              </div>

              <h3 className="text-xl md:text-2xl font-extrabold text-white mb-2.5">
                {t("serviceToolsTitle")}
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-5">
                {t("serviceToolsDesc")}
              </p>

              <ul className="space-y-2.5 mb-6">
                {[
                  t("serviceToolsBullet1"),
                  t("serviceToolsBullet2"),
                  t("serviceToolsBullet3"),
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-5 border-t border-white/10 flex flex-wrap items-center gap-2.5">
              <Link
                href="/schedule?tab=schedule"
                prefetch={true}
                className="flex-1 min-w-[115px] py-2.5 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-all inline-flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-600/25"
              >
                <CalendarDays className="w-4 h-4" />
                <span>{t("serviceToolsCtaSchedule")}</span>
              </Link>
              <Link
                href="/schedule?tab=attendance"
                prefetch={true}
                className="flex-1 min-w-[115px] py-2.5 px-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white font-semibold text-sm transition-all inline-flex items-center justify-center gap-1.5"
              >
                <ClipboardCheck className="w-4 h-4 text-emerald-300" />
                <span>{t("serviceToolsCtaAttendance")}</span>
              </Link>
              <button
                type="button"
                onClick={() => openDetailTab("tools")}
                className="py-2.5 px-2.5 text-xs font-semibold text-emerald-300 hover:text-emerald-200 transition-colors inline-flex items-center gap-1 cursor-pointer"
              >
                <span>{t("serviceToolsCtaMore")}</span>
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Elegant Gradient Divider */}
      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <div className="h-px w-full bg-linear-to-r from-transparent via-indigo-500/30 to-transparent" />
      </div>

      {/* Unified Tabbed Service Details Section */}
      <section id="service-details" className="relative z-10 py-20 px-6 max-w-7xl mx-auto scroll-mt-20">
        {/* Tab Switcher */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          <button
            type="button"
            onClick={() => setActiveDetailTab("center")}
            className={`px-5 py-3 rounded-2xl text-sm font-bold transition-all inline-flex items-center gap-2 cursor-pointer border ${
              activeDetailTab === "center"
                ? "bg-indigo-600 text-white border-indigo-400 shadow-[0_0_25px_rgba(79,70,229,0.35)]"
                : "bg-white/5 text-slate-300 border-white/10 hover:bg-white/10 hover:text-white"
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>{t("navCenter")}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveDetailTab("water")}
            className={`px-5 py-3 rounded-2xl text-sm font-bold transition-all inline-flex items-center gap-2 cursor-pointer border ${
              activeDetailTab === "water"
                ? "bg-cyan-600 text-white border-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.35)]"
                : "bg-white/5 text-slate-300 border-white/10 hover:bg-white/10 hover:text-white"
            }`}
          >
            <Droplets className="w-4 h-4" />
            <span>{t("navWater")}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveDetailTab("tools")}
            className={`px-5 py-3 rounded-2xl text-sm font-bold transition-all inline-flex items-center gap-2 cursor-pointer border ${
              activeDetailTab === "tools"
                ? "bg-emerald-600 text-white border-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.35)]"
                : "bg-white/5 text-slate-300 border-white/10 hover:bg-white/10 hover:text-white"
            }`}
          >
            <CalendarDays className="w-4 h-4" />
            <span>{t("navTools")}</span>
          </button>
        </div>

        {/* Tab 1: Center Management (Free vs Paid) */}
        {activeDetailTab === "center" && (
          <div className="max-w-5xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <h2 className="text-2xl md:text-4xl font-extrabold text-white mb-3">
                {t("centerTitle")}
              </h2>
              <p className="text-slate-400 text-sm md:text-base">
                {t("centerSubtitle")}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Free Tier Card */}
              <div className="relative p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl hover:border-indigo-500/50 transition-all duration-300">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-1">
                      {t("freePlan")}
                    </h3>
                    <div className="text-indigo-400 font-medium text-sm">
                      {t("freePlanDesc")}
                    </div>
                  </div>
                  <div className="bg-white/10 p-3 rounded-2xl">
                    <WifiOff className="w-6 h-6 text-indigo-300" />
                  </div>
                </div>

                <p className="text-sm text-slate-400 mb-6 pb-6 border-b border-white/10">
                  {t("freePlanTarget")}
                </p>

                <ul className="space-y-3.5 mb-8 text-sm">
                  {freeFeatures.map((feat, i) => (
                    <li key={i} className="flex gap-3 text-slate-300">
                      <div className="text-indigo-400 mt-0.5">{feat.icon}</div>
                      <span>{feat.text}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/free"
                  prefetch={true}
                  className="w-full py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-all active:scale-95 inline-flex items-center justify-center text-center cursor-pointer"
                >
                  {t("btnFree")}
                </Link>
              </div>

              {/* Premium Tier Card */}
              <div className="relative p-8 rounded-3xl bg-gradient-to-br from-indigo-900/40 to-violet-900/40 border border-indigo-500/30 backdrop-blur-xl shadow-[0_0_40px_rgba(79,70,229,0.15)]">
                <div className="absolute top-0 right-10 transform -translate-y-1/2 bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                  {t("recommendedBadge")}
                </div>

                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-1">
                      {t("paidPlan")}
                    </h3>
                    <div className="text-violet-300 font-medium text-sm">
                      {t("paidPlanDesc")}
                    </div>
                  </div>
                  <div className="bg-indigo-500/20 p-3 rounded-2xl">
                    <Cloud className="w-6 h-6 text-indigo-300" />
                  </div>
                </div>

                <p className="text-sm text-indigo-200/70 mb-6 pb-6 border-b border-indigo-500/20">
                  {t("paidPlanTarget")}
                </p>

                <ul className="space-y-3 mb-8 text-sm">
                  {paidFeatures.map((feat, i) => (
                    <li key={i} className="flex gap-3 text-indigo-100">
                      <div className="text-indigo-400 mt-0.5">{feat.icon}</div>
                      <span>{feat.text}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href={`https://wa.me/${WA_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-bold transition-all active:scale-95 shadow-[0_0_20px_rgba(79,70,229,0.4)] inline-flex items-center justify-center text-center cursor-pointer"
                >
                  {t("btnPaid")}
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Water Association Spotlight */}
        {activeDetailTab === "water" && (
          <div className="relative rounded-3xl p-8 md:p-12 bg-gradient-to-br from-cyan-950/40 via-blue-950/30 to-slate-900/70 border border-cyan-500/30 backdrop-blur-xl shadow-[0_0_50px_rgba(6,182,212,0.15)] overflow-hidden">
            <div className="relative z-10 text-center">
              <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-bold uppercase tracking-wider">
                  <Droplets className="w-3.5 h-3.5 text-cyan-400" />
                  {t("waterBadge")}
                </span>
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 text-xs font-medium">
                  <WifiOff className="w-3 h-3 text-cyan-400" />
                  {t("waterStatOffline")}
                </span>
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 text-xs font-medium">
                  <ShieldCheck className="w-3 h-3 text-cyan-400" />
                  {t("waterStatFree")}
                </span>
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 text-xs font-medium">
                  <Gauge className="w-3 h-3 text-cyan-400" />
                  {t("waterStatInstant")}
                </span>
              </div>

              <div className="max-w-2xl mx-auto mb-10">
                <h2 className="text-2xl md:text-4xl font-extrabold text-white mb-3 leading-tight">
                  {t("waterTitle")}
                </h2>
                <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                  {t("waterSubtitle")}
                </p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                {[
                  { icon: <Users className="w-5 h-5" />, text: t("waterFeature1") },
                  { icon: <Gauge className="w-5 h-5" />, text: t("waterFeature2") },
                  { icon: <FileSpreadsheet className="w-5 h-5" />, text: t("waterFeature3") },
                  { icon: <ShieldCheck className="w-5 h-5" />, text: t("waterFeature4") },
                ].map((feat, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-500/40 transition-colors flex flex-col items-center text-center"
                  >
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400 mb-3">
                      {feat.icon}
                    </div>
                    <p className="text-sm text-slate-200 font-medium leading-relaxed">
                      {feat.text}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-center">
                <Link
                  href="/waterassociation"
                  prefetch={true}
                  className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold transition-all hover:scale-105 active:scale-95 shadow-[0_0_25px_rgba(6,182,212,0.35)] inline-flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Droplets className="w-5 h-5" />
                  <span>{t("waterBtnExplore")}</span>
                  <ArrowUpRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/waterassociation/how-it-works"
                  prefetch={true}
                  className="px-6 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-500/30 text-slate-200 hover:text-white font-semibold transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
                >
                  <BookOpen className="w-4 h-4 text-cyan-400" />
                  <span>{t("waterBtnGuide")}</span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Instant Smart Free Tools */}
        {activeDetailTab === "tools" && (
          <div className="max-w-5xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <h2 className="text-2xl md:text-4xl font-extrabold text-white mb-3">
                {t("freeToolsTitle")}
              </h2>
              <p className="text-slate-400 text-sm md:text-base">
                {t("freeToolsSubtitle")}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="group p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl hover:border-emerald-500/40 transition-all duration-300 flex flex-col">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 mb-5">
                  <CalendarDays className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2.5">
                  {t("scheduleToolTitle")}
                </h3>
                <p className="text-slate-400 text-sm mb-6 grow leading-relaxed">
                  {t("scheduleToolDesc")}
                </p>
                <Link
                  href="/schedule?tab=schedule"
                  className="inline-flex items-center gap-2 text-indigo-400 font-bold hover:text-indigo-300 transition-colors"
                >
                  {t("btnTryTool")}
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="group p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl hover:border-emerald-500/40 transition-all duration-300 flex flex-col">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 mb-5">
                  <ClipboardCheck className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2.5">
                  {t("attendanceToolTitle")}
                </h3>
                <p className="text-slate-400 text-sm mb-6 grow leading-relaxed">
                  {t("attendanceToolDesc")}
                </p>
                <Link
                  href="/schedule?tab=attendance"
                  className="inline-flex items-center gap-2 text-emerald-400 font-bold hover:text-emerald-300 transition-colors"
                >
                  {t("btnTryTool")}
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Elegant Emerald Gradient Divider */}
      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <div className="h-px w-full bg-linear-to-r from-transparent via-emerald-500/30 to-transparent" />
      </div>

      {/* Universal Features Section */}
      <section className="relative z-10 py-16 px-6 max-w-7xl mx-auto">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold mb-10 text-white tracking-tight">
            {t("featuresTitle")}
          </h2>
          <div className="grid sm:grid-cols-3 gap-5">
            {featuresList.map((feat: string, i: number) => (
              <div
                key={i}
                className="flex flex-col items-center text-center p-5 bg-white/[0.03] hover:bg-white/[0.06] rounded-2xl border border-white/10 hover:border-violet-500/30 transition-all duration-300"
              >
                <CheckCircle2 className="w-7 h-7 text-emerald-400 mb-3" />
                <p className="text-slate-300 text-sm leading-relaxed">{feat}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="relative z-10 bg-white/[0.015] border-t border-white/[0.04] scroll-mt-20">
        <Contact />
      </section>

      {/* Footer */}
      <MarketingFooter />

      {/* FloatingWhatsApp deferred to client-only to avoid SSR/window errors */}
      {mounted && (
        <FloatingWhatsApp
          phoneNumber={WA_NUMBER}
          accountName={t("waAccountName")}
          statusMessage={t("waStatusMessage")}
          chatMessage={t("waChatMessage")}
          placeholder={t("waPlaceholder")}
          darkMode={true}
          allowClickAway={false}
          allowEsc={true}
          notification={true}
          notificationSound={true}
        />
      )}
    </main>
  );
}
