"use client";

import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function DesktopAppUpsell() {
  const t = useTranslations("upsell");
  const [isMinimized, setIsMinimized] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const dismissed = sessionStorage.getItem("desktop-upsell-dismissed");
    if (dismissed) {
      setIsMinimized(true);
    }
  }, []);

  if (!mounted) return null;

  const handleMinimize = () => {
    sessionStorage.setItem("desktop-upsell-dismissed", "true");
    setIsMinimized(true);
  };

  const handleMaximize = () => {
    sessionStorage.removeItem("desktop-upsell-dismissed");
    setIsMinimized(false);
  };

  if (isMinimized) {
    return (
      <button 
        onClick={handleMaximize}
        className="fixed bottom-6 right-6 z-[100] bg-linear-to-r from-indigo-900 to-indigo-950 text-white rounded-full p-3 shadow-2xl transition-all hover:scale-110 flex items-center gap-2 group border border-indigo-500/30"
        aria-label="Expand Desktop App Offer"
      >
        <span className="text-2xl leading-none">💻</span>
        <span className="text-sm font-bold max-w-0 overflow-hidden group-hover:max-w-[200px] transition-all duration-500 ease-in-out whitespace-nowrap px-0 group-hover:px-2">
          {t("title")}
        </span>
      </button>
    );
  }

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-[100] border-t border-indigo-500/30 bg-linear-to-r from-indigo-900 via-slate-900 to-indigo-950 p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-4 shadow-2xl pr-10 sm:pr-12">
        {/* Close Button */}
        <button 
          onClick={handleMinimize}
          className="absolute top-2 right-2 text-indigo-400 hover:text-white transition-colors p-1"
          aria-label="Minimize"
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
