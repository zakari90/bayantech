"use client";

import LanguageSwitcher from "@/components/LanguageSwitcher";
import MarketingFooter from "@/components/MarketingFooter";
import { Link } from "@/i18n/navigation";
import {
  ArrowLeft,
  ArrowRight,
  HardDrive,
  MapPin,
  Menu,
  Rocket,
  ShieldCheck,
  Sparkles,
  Users,
  WifiOff,
  X,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";

export default function AboutPage() {
  const locale = useLocale();
  const isRtl = locale === "ar";
  const t = useTranslations("marketing");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <main
      className="min-h-screen bg-[#0A0A0A] text-white selection:bg-indigo-500/30 overflow-x-hidden font-sans flex flex-col"
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
          <Link
            href="/"
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
          </Link>

          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300">
            <Link href="/" className="hover:text-white transition-colors">
              {t("navHome")}
            </Link>
            <Link href="/#services" className="hover:text-white transition-colors">
              {t("navServices")}
            </Link>
            <Link href="/about" className="text-white font-semibold">
              {t("navAbout")}
            </Link>
            <Link href="/#contact" className="hover:text-white transition-colors">
              {t("navContact")}
            </Link>
          </nav>

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

        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-white/10 bg-[#0A0A0A]/95 backdrop-blur-xl px-6 py-4 space-y-3">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              {t("navHome")}
            </Link>
            <Link
              href="/#services"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              {t("navServices")}
            </Link>
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-semibold text-white"
            >
              {t("navAbout")}
            </Link>
            <Link
              href="/#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              {t("navContact")}
            </Link>
          </div>
        )}
      </header>

      {/* About Bayyane Presentation Section */}
      <section className="relative z-10 py-20 px-6 max-w-7xl mx-auto flex-1">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-4">
            <Rocket className="w-3.5 h-3.5 text-indigo-400" />
            <span>{t("aboutBadge")}</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-5 leading-tight">
            <span className="bg-linear-to-r from-white via-indigo-100 to-indigo-300 bg-clip-text text-transparent">
              {t("aboutTitle")}
            </span>
          </h1>
          <p className="text-slate-300 text-base md:text-lg leading-relaxed">
            {t("aboutSubtitle")}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-8 items-stretch mb-16">
          {/* Left Column: Mission Narrative & Credibility Card */}
          <motion.div
            initial={{ opacity: 0, x: isRtl ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 p-8 md:p-10 rounded-3xl bg-linear-to-br from-white/5 to-indigo-950/20 border border-white/10 backdrop-blur-xl flex flex-col justify-between"
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

          {/* Right Column: 4 Architecture & Value Pillars */}
          <div className="lg:col-span-7 grid sm:grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="p-6 rounded-3xl bg-white/3 hover:bg-white/6 border border-white/10 hover:border-indigo-500/40 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4 group-hover:scale-110 transition-transform">
                <WifiOff className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-white mb-2">
                {t("pillarOfflineTitle")}
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                {t("pillarOfflineDesc")}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="p-6 rounded-3xl bg-white/3 hover:bg-white/6 border border-white/10 hover:border-amber-500/40 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-white mb-2">
                {t("pillarSpeedTitle")}
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                {t("pillarSpeedDesc")}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="p-6 rounded-3xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-emerald-500/40 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-white mb-2">
                {t("pillarSecurityTitle")}
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                {t("pillarSecurityDesc")}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="p-6 rounded-3xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-cyan-500/40 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-white mb-2">
                {t("pillarCommunityTitle")}
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                {t("pillarCommunityDesc")}
              </p>
            </motion.div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/#services"
            className="px-7 py-3.5 rounded-xl bg-linear-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold transition-all hover:scale-105 active:scale-95 shadow-[0_0_25px_rgba(79,70,229,0.35)] inline-flex items-center gap-2"
          >
            <span>{t("aboutCtaExplore")}</span>
            {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </Link>
          <Link
            href="/#contact"
            className="px-7 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 hover:text-white font-semibold transition-all inline-flex items-center gap-2"
          >
            <span>{t("heroCtaContact")}</span>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <MarketingFooter />
    </main>
  );
}
