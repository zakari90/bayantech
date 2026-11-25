"use client";

import { Link } from "@/i18n/navigation";
import { Cloud, Database, Globe, Laptop, MonitorSmartphone, Rocket, ShieldCheck, Sparkles, Users, WifiOff } from "lucide-react";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";

export default function PricingSection() {
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
    {
      text: t("paidFeature7"),
      icon: <MonitorSmartphone className="w-5 h-5" />,
    },
    { text: t("paidFeature8"), icon: <ShieldCheck className="w-5 h-5" /> },
    { text: t("paidFeature9"), icon: <Globe className="w-5 h-5" /> },
  ];

  return (
    <section className="relative z-10 py-24 px-6 bg-white/[0.015] border-y border-white/[0.04]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>{t("pricingTitle")}</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold mb-4 text-white tracking-tight">
            {t("pricingTitle")}
          </h2>
          <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            {t("pricingSubtitle")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Free Tier Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl hover:border-indigo-500/50 transition-all duration-300 group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />

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
            className="relative p-8 rounded-3xl bg-gradient-to-br from-indigo-900/40 to-violet-900/40 border border-indigo-500/30 backdrop-blur-xl shadow-[0_0_40px_rgba(79,70,229,0.15)] hover:shadow-[0_0_60px_rgba(79,70,229,0.25)] transition-all duration-300"
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
                href="https://wa.me/212754764704"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-bold transition-all active:scale-95 shadow-[0_0_20px_rgba(79,70,229,0.4)] inline-flex items-center justify-center text-center cursor-pointer"
              >
                {t("btnPaid")}
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
