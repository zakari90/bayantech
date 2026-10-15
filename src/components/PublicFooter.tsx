"use client";

import { useTranslations } from "next-intl";
import { Facebook } from "lucide-react";

export default function PublicFooter() {
  const t = useTranslations("Footer");

  return (
    <footer className="w-full py-16 px-6 bg-[#0A0A0A] border-t border-white/10 flex flex-col items-center gap-8 text-center mt-auto">
      <div className="space-y-2">
        <p className="text-xl text-slate-300 font-bold tracking-tight">
          {t("bookingInquiry")}
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <button
          onClick={() => window.open("https://wa.me/212754764704", "_blank")}
          className="px-8 py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold transition-all transform hover:scale-105 active:scale-95 backdrop-blur-sm shadow-xl shadow-indigo-500/10 cursor-pointer"
        >
          {t("btnPaid")}
        </button>

        <a
          href="https://web.facebook.com/people/Bayyane/61595228613814/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/20 hover:border-blue-500/40 text-white font-bold transition-all transform hover:scale-105 active:scale-95 backdrop-blur-sm shadow-xl shadow-blue-500/10 cursor-pointer"
        >
          <Facebook className="w-5 h-5 text-blue-400" />
          <span>{t("facebook")}</span>
        </a>
      </div>

      <div className="pt-4 border-t border-white/5 w-full max-w-xs">
        <p className="text-sm text-indigo-400 font-mono tracking-wider opacity-80">
          {t("contactEmail")}
        </p>
      </div>
    </footer>
  );
}
