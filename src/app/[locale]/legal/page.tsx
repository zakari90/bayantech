"use client";

import LanguageSwitcher from "@/components/LanguageSwitcher";
import MarketingFooter from "@/components/MarketingFooter";
import { Link } from "@/i18n/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Database,
  FileText,
  Globe,
  HardDrive,
  Mail,
  Scale,
  ShieldCheck,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";

function SectionIcon({ name }: { name: string }) {
  switch (name) {
    case "scale":
      return <Scale className="w-5 h-5 text-indigo-400" />;
    case "file":
      return <FileText className="w-5 h-5 text-cyan-400" />;
    case "harddrive":
      return <HardDrive className="w-5 h-5 text-emerald-400" />;
    case "globe":
      return <Globe className="w-5 h-5 text-violet-400" />;
    default:
      return <ShieldCheck className="w-5 h-5 text-amber-400" />;
  }
}

export default function LegalPage() {
  const locale = useLocale();
  const isRtl = locale === "ar";
  const t = useTranslations("legal");

  const sections = [
    {
      icon: "scale",
      title: t("sec1Title"),
      body: [t("sec1P1"), t("sec1P2"), t("sec1P3")],
    },
    {
      icon: "file",
      title: t("sec2Title"),
      body: [t("sec2P1"), t("sec2P2"), t("sec2P3")],
    },
    {
      icon: "harddrive",
      title: t("sec3Title"),
      body: [t("sec3P1"), t("sec3P2")],
    },
    {
      icon: "globe",
      title: t("sec4Title"),
      body: [t("sec4P1"), t("sec4P2"), t("sec4P3"), t("sec4P4")],
    },
    {
      icon: "shield",
      title: t("sec5Title"),
      body: [t("sec5P1")],
    },
  ];

  return (
    <main
      dir={isRtl ? "rtl" : "ltr"}
      className="min-h-screen bg-[#0A0A0A] text-slate-100 selection:bg-indigo-500/30 font-sans flex flex-col"
    >
      {/* Ambient background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-[#0A0A0A]/80 border-b border-white/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <Link
            href="/"
            className="flex items-center gap-2.5 text-white font-bold tracking-tight"
          >
            <Image
              src="/bayyane-logo.webp"
              alt={t("brandName")}
              width={32}
              height={32}
              className="w-8 h-8 rounded-lg object-cover border border-white/15"
            />
            <span>{t("brandName")}</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/privacy-policy"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-slate-300 hover:text-white transition-colors"
            >
              <Database className="w-3.5 h-3.5 text-cyan-400" />
              <span>{t("privacyLink")}</span>
            </Link>
            <div className="text-slate-900 dark:text-white">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 flex-1 w-full">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-4">
            <Scale className="w-3.5 h-3.5 text-indigo-400" />
            <span>{t("badge")}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
            {t("title")}
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto mb-3">
            {t("subtitle")}
          </p>
          <p className="text-xs text-slate-500">{t("lastUpdated")}</p>
        </div>

        <div className="space-y-6">
          {sections.map((sec, idx) => (
            <section
              key={idx}
              className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-sm"
            >
              <h2 className="text-lg sm:text-xl font-bold text-white mb-4 flex items-center gap-2.5">
                <SectionIcon name={sec.icon} />
                <span>{sec.title}</span>
              </h2>
              <div className="space-y-3 text-sm sm:text-base text-slate-300 leading-relaxed">
                {sec.body.map((p, pIdx) => (
                  <p key={pIdx}>{p}</p>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Contact & Navigation Card */}
        <div className="mt-10 p-6 sm:p-8 rounded-2xl bg-linear-to-br from-indigo-950/40 to-cyan-950/30 border border-indigo-500/25 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-lg font-bold text-white mb-1">{t("contactTitle")}</h3>
            <p className="text-sm text-slate-300 mb-2">{t("contactText")}</p>
            <a
              href="mailto:bayyanedigital@gmail.com"
              className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-300 hover:text-indigo-200"
            >
              <Mail className="w-4 h-4" />
              <span>bayyanedigital@gmail.com</span>
            </a>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/privacy-policy"
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-sm font-semibold text-white transition-colors"
            >
              {t("privacyLink")}
            </Link>
            <Link
              href="/"
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-sm font-bold text-white transition-colors inline-flex items-center gap-2"
            >
              {isRtl ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
              <span>{t("backHome")}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <MarketingFooter />
    </main>
  );
}
