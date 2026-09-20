"use client";

import Contact from "@/components/Contact";
import { FloatingWhatsApp } from "@digicroz/react-floating-whatsapp";
import {
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Cloud,
  Database,
  Globe,
  Laptop,
  MonitorSmartphone,
  Rocket,
  ShieldCheck,
  Sparkles,
  Users,
  WifiOff,
} from "lucide-react";
import { motion } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useEffect, useState } from "react";

const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "212768276772";

export default function SaaSMarketingPage() {
  const locale = useLocale();
  const isRtl = locale === "ar";
  const t = useTranslations("marketing");

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
    { text: t("paidFeature7"), icon: <MonitorSmartphone className="w-5 h-5" /> },
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

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <main
      className="min-h-screen bg-[#0A0A0A] text-white selection:bg-indigo-500/30 overflow-x-hidden font-sans"
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* Background ambient glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-indigo-600/10 blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-violet-600/10 blur-[120px] mix-blend-screen" />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 backdrop-blur-md mb-8"
        >
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span className="text-sm font-semibold text-indigo-300 tracking-wide uppercase">
            {t("heroTag")}
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight"
        >
          <span className="bg-linear-to-br from-white via-indigo-100 to-indigo-300 bg-clip-text text-transparent">
            {t("heroTitle")}
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-slate-400 max-w-3xl leading-relaxed mb-12"
        >
          {t("heroSubtitle")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
        >
          <Link
            href="/free"
            prefetch={true}
            className="px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(79,70,229,0.3)] inline-flex items-center justify-center text-center cursor-pointer"
          >
            {t("btnFree")}
          </Link>
          <a
            href="https://wa.me/212768276772"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold transition-all hover:scale-105 active:scale-95 backdrop-blur-sm inline-flex items-center justify-center text-center cursor-pointer"
          >
            {t("btnPaid")}
          </a>
        </motion.div>
      </section>

      {/* Pricing/Tiers Section */}
      <section className="relative z-10 py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t("pricingTitle")}
          </h2>
          <p className="text-slate-400">{t("pricingSubtitle")}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Free Tier Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl hover:border-indigo-500/50 transition-all duration-300 group"
          >
            <div className="absolute inset-0 bg-linear-to-br from-indigo-500/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {t("freePlan")}
                  </h3>
                  <div className="text-indigo-400 font-medium">
                    {t("freePlanDesc")}
                  </div>
                </div>
                <div className="bg-white/10 p-3 rounded-2xl">
                  <WifiOff className="w-6 h-6 text-indigo-300" />
                </div>
              </div>

              <p className="text-sm text-slate-400 mb-8 pb-8 border-b border-white/10">
                {t("freePlanTarget")}
              </p>

              <ul className="space-y-4 mb-8">
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
                className="w-full py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-all active:scale-95 inline-flex items-center justify-center text-center cursor-pointer"
              >
                {t("btnFree")}
              </Link>
            </div>
          </motion.div>

          {/* Premium Tier Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative p-8 rounded-3xl bg-linear-to-br from-indigo-900/40 to-violet-900/40 border border-indigo-500/30 backdrop-blur-xl shadow-[0_0_40px_rgba(79,70,229,0.15)] hover:shadow-[0_0_60px_rgba(79,70,229,0.25)] transition-all duration-300"
          >
            <div className="absolute top-0 right-10 transform -translate-y-1/2 bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
              {t("recommendedBadge")}
            </div>

            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {t("paidPlan")}
                  </h3>
                  <div className="text-violet-300 font-medium">
                    {t("paidPlanDesc")}
                  </div>
                </div>
                <div className="bg-indigo-500/20 p-3 rounded-2xl">
                  <Cloud className="w-6 h-6 text-indigo-300" />
                </div>
              </div>

              <p className="text-sm text-indigo-200/70 mb-8 pb-8 border-b border-indigo-500/20">
                {t("paidPlanTarget")}
              </p>

              <ul className="space-y-4 mb-8">
                {paidFeatures.map((feat, i) => (
                  <li key={i} className="flex gap-3 text-indigo-100">
                    <div className="text-indigo-400 mt-0.5">{feat.icon}</div>
                    <span>{feat.text}</span>
                  </li>
                ))}
              </ul>

              <a
                href="https://wa.me/212768276772"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-bold transition-all active:scale-95 shadow-[0_0_20px_rgba(79,70,229,0.4)] inline-flex items-center justify-center text-center cursor-pointer"
              >
                {t("btnPaid")}
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Free Instant Tools Section */}
      <section className="relative z-10 py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4"
          >
            <Sparkles className="w-3 h-3" /> {t("freeBadge")}
          </motion.div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">
            {t("freeToolsTitle")}
          </h2>
          <p className="text-slate-400 text-lg">{t("freeToolsSubtitle")}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Schedule Tool Card */}
          <motion.div
            whileHover={{ y: -5 }}
            className="group relative p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/8 transition-all duration-300"
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                  <CalendarDays className="w-8 h-8" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                {t("scheduleToolTitle")}
              </h3>
              <p className="text-slate-400 mb-8 grow">{t("scheduleToolDesc")}</p>

              <Link
                href="/schedule?tab=schedule"
                className="inline-flex items-center gap-2 text-indigo-400 font-bold hover:text-indigo-300 transition-colors cursor-pointer group/btn"
              >
                {t("btnTryTool")}
                <ArrowUpRight className="w-5 h-5 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
              </Link>
            </div>
          </motion.div>

          {/* Attendance Tool Card */}
          <motion.div
            whileHover={{ y: -5 }}
            className="group relative p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/8 transition-all duration-300"
          >
            <div className="flex flex-col h-full">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
                <ClipboardCheck className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                {t("attendanceToolTitle")}
              </h3>
              <p className="text-slate-400 mb-8 grow">{t("attendanceToolDesc")}</p>
              <Link
                href="/schedule?tab=attendance"
                className="inline-flex items-center gap-2 text-emerald-400 font-bold hover:text-emerald-300 transition-colors cursor-pointer"
              >
                {t("btnTryTool")} <ArrowUpRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Universal Features Section */}
      <section className="relative z-10 py-24 px-6 bg-white/5 border-y border-white/10 mt-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-10 text-white">
            {t("featuresTitle")}
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {featuresList.map((feat: string, i: number) => (
              <div
                key={i}
                className="flex flex-col items-center text-center p-6 bg-white/5 rounded-2xl border border-white/5"
              >
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mb-4" />
                <p className="text-slate-300 text-sm leading-relaxed">{feat}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <Contact />

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/5 text-center relative z-10">
        <p className="text-slate-500 text-sm tracking-wide">
          © {new Date().getFullYear()} {t("copyright")}.
        </p>
      </footer>

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
