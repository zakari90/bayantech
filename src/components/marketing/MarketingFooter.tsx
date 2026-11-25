"use client";

import { Link } from "@/i18n/navigation";
import { Droplets, Facebook } from "lucide-react";
import { useTranslations } from "next-intl";

export default function MarketingFooter() {
  const t = useTranslations("marketing");

  return (
    <footer className="py-12 px-6 border-t border-white/5 text-center relative z-10 flex flex-col items-center gap-4">
      <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-sm text-slate-400 mb-2">
        <Link href="/free" className="hover:text-white transition-colors">
          {t("freePlan")}
        </Link>
        <span className="text-slate-600">•</span>
        <Link
          href="/waterassociation"
          className="inline-flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 transition-colors font-medium"
        >
          <Droplets className="w-3.5 h-3.5" />
          {t("waterFooterLink")}
        </Link>
      </div>

      <a
        href="https://web.facebook.com/people/Bayyane/61595228613814/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Facebook Page"
        className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white/5 hover:bg-blue-600/20 border border-white/10 hover:border-blue-500/40 text-slate-300 hover:text-white transition-all text-sm font-medium"
      >
        <Facebook className="w-4 h-4 text-blue-400" />
      </a>
      <p className="text-slate-500 text-sm tracking-wide">
        © {new Date().getFullYear()} {t("copyright")}.
      </p>
    </footer>
  );
}
