"use client";

import { Link } from "@/i18n/navigation";
import { ArrowUpRight, BookOpen, Droplets, FileSpreadsheet, Gauge, ShieldCheck, Users, WifiOff } from "lucide-react";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";

export default function WaterSpotlightSection() {
  const t = useTranslations("marketing");

  return (
    <section className="relative z-10 py-24 px-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative rounded-3xl p-8 md:p-12 bg-gradient-to-br from-cyan-950/40 via-blue-950/30 to-slate-900/70 border border-cyan-500/30 backdrop-blur-xl shadow-[0_0_50px_rgba(6,182,212,0.15)] overflow-hidden"
      >
        {/* Ambient Glows */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          {/* Header Badges */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
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

          {/* Title & Subtitle */}
          <div className="max-w-3xl mb-10">
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
              <span className="bg-gradient-to-r from-white via-cyan-100 to-blue-200 bg-clip-text text-transparent">
                {t("waterTitle")}
              </span>
            </h2>
            <p className="text-slate-300 text-base md:text-lg leading-relaxed">
              {t("waterSubtitle")}
            </p>
          </div>

          {/* Feature Cards Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-500/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400 mb-3">
                <Users className="w-5 h-5" />
              </div>
              <p className="text-sm text-slate-200 font-medium leading-relaxed">
                {t("waterFeature1")}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-500/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400 mb-3">
                <Gauge className="w-5 h-5" />
              </div>
              <p className="text-sm text-slate-200 font-medium leading-relaxed">
                {t("waterFeature2")}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-500/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400 mb-3">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <p className="text-sm text-slate-200 font-medium leading-relaxed">
                {t("waterFeature3")}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-500/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400 mb-3">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <p className="text-sm text-slate-200 font-medium leading-relaxed">
                {t("waterFeature4")}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
            <Link
              href="/waterassociation"
              prefetch={true}
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold transition-all hover:scale-105 active:scale-95 shadow-[0_0_25px_rgba(6,182,212,0.35)] inline-flex items-center justify-center gap-2 cursor-pointer text-center"
            >
              <Droplets className="w-5 h-5" />
              <span>{t("waterBtnExplore")}</span>
              <ArrowUpRight className="w-5 h-5" />
            </Link>

            <Link
              href="/waterassociation/how-it-works"
              prefetch={true}
              className="px-6 py-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-500/30 text-slate-200 hover:text-white font-semibold transition-all inline-flex items-center justify-center gap-2 cursor-pointer text-center"
            >
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>{t("waterBtnGuide")}</span>
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
