"use client";

import { Link } from "@/i18n/navigation";
import { ArrowUpRight, CalendarDays, ClipboardCheck, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";

export default function FreeToolsSection() {
  const t = useTranslations("marketing");

  return (
    <section className="relative z-10 py-24 px-6 bg-white/[0.015] border-y border-white/[0.04]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4"
          >
            <Sparkles className="w-3.5 h-3.5" /> {t("freeBadge")}
          </motion.div>
          <h2 className="text-3xl md:text-5xl font-extrabold mb-4 text-white tracking-tight">
            {t("freeToolsTitle")}
          </h2>
          <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            {t("freeToolsSubtitle")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Schedule Tool Card */}
          <motion.div
            whileHover={{ y: -5 }}
            className="group relative p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl hover:border-emerald-500/40 hover:bg-white/[0.07] transition-all duration-300"
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
              <p className="text-slate-400 mb-8 grow leading-relaxed">
                {t("scheduleToolDesc")}
              </p>

              <Link
                href="/free/schedule?tab=schedule"
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
            className="group relative p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl hover:border-emerald-500/40 hover:bg-white/[0.07] transition-all duration-300"
          >
            <div className="flex flex-col h-full">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
                <ClipboardCheck className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                {t("attendanceToolTitle")}
              </h3>
              <p className="text-slate-400 mb-8 grow leading-relaxed">
                {t("attendanceToolDesc")}
              </p>
              <Link
                href="/free/schedule?tab=attendance"
                className="inline-flex items-center gap-2 text-emerald-400 font-bold hover:text-emerald-300 transition-colors cursor-pointer group/btn"
              >
                {t("btnTryTool")}
                <ArrowUpRight className="w-5 h-5 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
