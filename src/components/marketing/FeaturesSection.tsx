"use client";

import { CheckCircle2 } from "lucide-react";
import { useTranslations } from "next-intl";

export default function FeaturesSection() {
  const t = useTranslations("marketing");

  const featuresList = [
    t("featuresList1"),
    t("featuresList2"),
    t("featuresList3"),
    t("featuresList4"),
    t("featuresList5"),
  ];

  return (
    <section className="relative z-10 py-24 px-6 max-w-7xl mx-auto">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-semibold uppercase tracking-widest mb-4">
          <CheckCircle2 className="w-3.5 h-3.5 text-violet-400" />
          <span>{t("featuresTitle")}</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold mb-12 text-white tracking-tight">
          {t("featuresTitle")}
        </h2>
        <div className="grid sm:grid-cols-3 gap-6">
          {featuresList.map((feat: string, i: number) => (
            <div
              key={i}
              className="flex flex-col items-center text-center p-6 bg-white/[0.03] hover:bg-white/[0.06] rounded-2xl border border-white/10 hover:border-violet-500/30 transition-all duration-300"
            >
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mb-4" />
              <p className="text-slate-300 text-sm leading-relaxed">{feat}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
