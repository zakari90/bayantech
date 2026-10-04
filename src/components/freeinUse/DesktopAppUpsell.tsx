"use client";

import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function DesktopAppUpsell() {
  const t = useTranslations("upsell");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem("desktop-upsell-dismissed");
    if (!dismissed) {
      setIsVisible(true);
    }
  }, []);

  if (!isVisible) return null;

  const handleDismiss = () => {
    sessionStorage.setItem("desktop-upsell-dismissed", "true");
    setIsVisible(false);
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-[100] border-t border-indigo-500/30 bg-linear-to-r from-indigo-900 via-slate-900 to-indigo-950 p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-4 shadow-2xl pr-10 sm:pr-12">
        {/* Close Button */}
        <button 
          onClick={handleDismiss}
          className="absolute top-2 right-2 text-indigo-400 hover:text-white transition-colors p-1"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 text-center sm:text-left">
          <div className="text-2xl hidden sm:block">💻</div>
          <div>
            <h4 className="font-bold text-white text-sm sm:text-base leading-tight">
              {t("title")}
            </h4>
            <p className="text-indigo-200 text-xs sm:text-sm">
              {t("description")}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <div className="text-white text-right">
            <div className="font-bold text-lg leading-none">$49</div>
          </div>
          <button
            onClick={() =>
              window.open(
                `https://wa.me/212754764704?text=${encodeURIComponent(t("message"))}`,
                "_blank"
              )
            }
            className="h-10 px-6 bg-white text-indigo-900 hover:bg-indigo-50 font-bold rounded-lg shadow-sm transition-all hover:scale-105 cursor-pointer text-sm"
          >
            {t("buyNow")}
          </button>
        </div>
      </div>
      {/* Spacer so nothing hides behind it */}
      <div className="h-24 sm:h-16 w-full"></div>
    </>
  );
}
