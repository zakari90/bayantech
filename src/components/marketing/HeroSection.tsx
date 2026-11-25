"use client";

import { Link } from "@/i18n/navigation";
import { HardDrive, MapPin, Rocket, Sparkles, Users, WifiOff, Zap, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";
import { useLocale, useTranslations } from "next-intl";

export default function HeroSection() {
  const locale = useLocale();
  const isRtl = locale === "ar";
  const t = useTranslations("marketing");

  return (
    <section className="relative z-10 pt-32 pb-24 px-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-4xl mx-auto mb-16"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 backdrop-blur-md mb-8">
          <Rocket className="w-4 h-4 text-indigo-400" />
          <span className="text-sm font-semibold text-indigo-300 tracking-wide uppercase">
            {t("aboutBadge")}
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
          <span className="bg-gradient-to-r from-white via-indigo-100 to-indigo-300 bg-clip-text text-transparent">
            {t("aboutTitle")}
          </span>
        </h1>

        <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-10">
          {t("aboutSubtitle")}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <Link
            href="/free"
            prefetch={true}
            className="px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(79,70,229,0.3)] inline-flex items-center justify-center text-center cursor-pointer w-full sm:w-auto"
          >
            {t("btnFree")}
          </Link>
          <a
            href="https://wa.me/212754764704"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold transition-all hover:scale-105 active:scale-95 backdrop-blur-sm inline-flex items-center justify-center text-center cursor-pointer w-full sm:w-auto"
          >
            {t("btnPaid")}
          </a>
        </div>
      </motion.div>

      {/* Company Presentation Cards: Story & 4 Core Pillars */}
      <div className="grid lg:grid-cols-12 gap-8 items-stretch">
        {/* Mission Narrative & Origin */}
        <motion.div
          initial={{ opacity: 0, x: isRtl ? 20 : -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-5 p-8 md:p-10 rounded-3xl bg-gradient-to-br from-white/[0.05] to-indigo-950/20 border border-white/10 backdrop-blur-xl flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center gap-2 text-indigo-400 text-sm font-bold uppercase tracking-wider mb-4">
              <Sparkles className="w-4 h-4" />
              <span>{t("aboutStoryHeading")}</span>
            </div>
            <p className="text-slate-300 leading-relaxed text-base mb-6">
              {t("aboutStoryText1")}
            </p>
            <p className="text-slate-300 leading-relaxed text-base mb-8">
              {t("aboutStoryText2")}
            </p>
          </div>

          <div className="pt-6 border-t border-white/10 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-slate-200 text-xs font-semibold">
              <MapPin className="w-3.5 h-3.5 text-rose-400" />
              {t("aboutLocation")}
            </span>
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
              <HardDrive className="w-3.5 h-3.5 text-indigo-400" />
              {t("aboutBadgeSovereignty")}
            </span>
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold">
              <WifiOff className="w-3.5 h-3.5 text-emerald-400" />
              {t("aboutBadgeOffline")}
            </span>
          </div>
        </motion.div>

        {/* 4 Architecture & Value Pillars */}
        <div className="lg:col-span-7 grid sm:grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="p-6 rounded-3xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-indigo-500/40 transition-all duration-300 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4 group-hover:scale-110 transition-transform">
              <WifiOff className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              {t("pillarOfflineTitle")}
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              {t("pillarOfflineDesc")}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="p-6 rounded-3xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-amber-500/40 transition-all duration-300 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              {t("pillarSpeedTitle")}
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              {t("pillarSpeedDesc")}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="p-6 rounded-3xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-emerald-500/40 transition-all duration-300 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              {t("pillarSecurityTitle")}
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              {t("pillarSecurityDesc")}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="p-6 rounded-3xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-cyan-500/40 transition-all duration-300 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              {t("pillarCommunityTitle")}
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              {t("pillarCommunityDesc")}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
