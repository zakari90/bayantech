"use client";

import { Link } from "@/i18n/navigation";
import {
  BookOpen,
  CalendarDays,
  ClipboardCheck,
  Droplets,
  Facebook,
  GraduationCap,
  Mail,
  MapPin,
  Scale,
  ShieldCheck,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";

export default function MarketingFooter() {
  const locale = useLocale();
  const isRtl = locale === "ar";
  const t = useTranslations("marketing");

  return (
    <footer
      dir={isRtl ? "rtl" : "ltr"}
      className="relative z-10 border-t border-white/10 bg-[#070707]/90 backdrop-blur-xl"
    >
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand Column */}
          <div className="space-y-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 font-extrabold text-lg tracking-tight text-white"
            >
              <Image
                src="/bayyane-logo.webp"
                alt={t("brandName")}
                width={34}
                height={34}
                className="w-8.5 h-8.5 rounded-xl object-cover border border-white/15"
              />
              <span>{t("brandName")}</span>
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
              {t("footerTagline")}
            </p>

            <div className="flex items-center gap-2 text-xs text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span>{t("aboutLocation")}</span>
            </div>

            <div className="flex items-center gap-2.5 pt-1">
              <a
                href="https://web.facebook.com/people/Bayyane/61595228613814/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook Page"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-blue-600/20 border border-white/10 hover:border-blue-500/40 flex items-center justify-center text-slate-300 hover:text-white transition-all"
              >
                <Facebook className="w-4 h-4 text-blue-400" />
              </a>
              <a
                href="mailto:bayyanedigital@gmail.com"
                aria-label="Email Bayyane"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-indigo-600/20 border border-white/10 hover:border-indigo-500/40 flex items-center justify-center text-slate-300 hover:text-white transition-all"
              >
                <Mail className="w-4 h-4 text-indigo-400" />
              </a>
            </div>
          </div>

          {/* Services Column */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">
              {t("footerServicesHeading")}
            </h3>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link
                  href="/free"
                  className="inline-flex items-center gap-2 hover:text-white transition-colors"
                >
                  <GraduationCap className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>{t("serviceCenterTitle")}</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/pro/login"
                  className="inline-flex items-center gap-2 hover:text-indigo-300 transition-colors"
                >
                  <span className="w-4 h-4 inline-flex items-center justify-center text-indigo-400 text-xs font-bold">
                    •
                  </span>
                  <span>{t("navCenterProLogin")}</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/waterassociation"
                  className="inline-flex items-center gap-2 hover:text-cyan-300 transition-colors"
                >
                  <Droplets className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>{t("waterFooterLink")}</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/waterassociation/login"
                  className="inline-flex items-center gap-2 hover:text-cyan-300 transition-colors"
                >
                  <span className="w-4 h-4 inline-flex items-center justify-center text-cyan-400 text-xs font-bold">
                    •
                  </span>
                  <span>{t("navWaterLogin")}</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/schedule?tab=schedule"
                  className="inline-flex items-center gap-2 hover:text-emerald-300 transition-colors"
                >
                  <CalendarDays className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{t("scheduleToolTitle")}</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/schedule?tab=attendance"
                  className="inline-flex items-center gap-2 hover:text-emerald-300 transition-colors"
                >
                  <ClipboardCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{t("attendanceToolTitle")}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Company & Guides Column */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">
              {t("footerCompanyHeading")}
            </h3>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  {t("navHome")}
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  {t("navAbout")}
                </Link>
              </li>
              <li>
                <Link
                  href="/waterassociation/how-it-works"
                  className="inline-flex items-center gap-2 hover:text-cyan-300 transition-colors"
                >
                  <BookOpen className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>{t("waterBtnGuide")}</span>
                </Link>
              </li>
              <li>
                <Link href="/#contact" className="hover:text-white transition-colors">
                  {t("navContact")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Privacy Column */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">
              {t("footerLegalHeading")}
            </h3>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link
                  href="/legal"
                  className="inline-flex items-center gap-2 hover:text-white transition-colors"
                >
                  <Scale className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>{t("legalFooterLink")}</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="inline-flex items-center gap-2 hover:text-white transition-colors"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{t("privacyFooterLink")}</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} {t("brandName")}. {t("copyright")}.
          </p>
          <p>bayyanedigital@gmail.com</p>
        </div>
      </div>
    </footer>
  );
}
