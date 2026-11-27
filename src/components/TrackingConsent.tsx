"use client";

import { Link } from "@/i18n/navigation";
import { GoogleAnalytics } from "@next/third-parties/google";
import { ShieldCheck } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";

const CONSENT_KEY = "bayyane_tracking_consent";

type ConsentState = "loading" | "unset" | "accepted" | "declined";

export default function TrackingConsent() {
  const locale = useLocale();
  const isRtl = locale === "ar";
  const t = useTranslations("consent");
  const [consent, setConsent] = useState<ConsentState>("loading");

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(CONSENT_KEY);
      if (saved === "accepted" || saved === "declined") {
        setConsent(saved);
      } else {
        setConsent("unset");
      }
    } catch {
      setConsent("unset");
    }
  }, []);

  const handleChoice = (choice: "accepted" | "declined") => {
    try {
      window.localStorage.setItem(CONSENT_KEY, choice);
    } catch {
      // Ignore storage errors in restricted browsing modes
    }
    setConsent(choice);
  };

  return (
    <>
      {/* Only load Google Analytics after explicit opt-in consent */}
      {consent === "accepted" && (
        <>
          <GoogleAnalytics gaId="G-20M29XR18S" />
          <GoogleAnalytics gaId="G-BHTLHQH5HF" />
        </>
      )}

      {/* Consent Banner */}
      {consent === "unset" && (
        <aside
          dir={isRtl ? "rtl" : "ltr"}
          aria-label={t("title")}
          className="fixed bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-md z-50 rounded-2xl border border-white/15 bg-slate-950/95 text-slate-100 p-4 sm:p-5 shadow-2xl backdrop-blur-xl"
        >
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-sm font-bold text-white mb-1">{t("title")}</h2>
              <p className="text-xs text-slate-300 leading-relaxed mb-3">
                {t("description")}
              </p>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleChoice("accepted")}
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  {t("accept")}
                </button>
                <button
                  type="button"
                  onClick={() => handleChoice("declined")}
                  className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 border border-white/10 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
                >
                  {t("decline")}
                </button>
                <Link
                  href="/privacy-policy"
                  className="text-[11px] text-slate-400 hover:text-white underline underline-offset-2 ms-1"
                >
                  {t("privacy")}
                </Link>
                <Link
                  href="/legal"
                  className="text-[11px] text-slate-400 hover:text-white underline underline-offset-2"
                >
                  {t("legal")}
                </Link>
              </div>
            </div>
          </div>
        </aside>
      )}
    </>
  );
}
