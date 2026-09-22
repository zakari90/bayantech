"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Loader2, Globe, AlertCircle } from "lucide-react";
import "./globals.css";

export default function RootPage() {
  const router = useRouter();
  const [isDelayed, setIsDelayed] = useState(false);

  useEffect(() => {
    // 1. Try Next.js client-side router navigation
    try {
      router.replace("/ar");
    } catch {
      // 2. Direct browser navigation fallback if router throws
      window.location.replace("/ar");
    }

    // 3. Fallback timer: if not redirected after 2 seconds, trigger direct browser replace
    // and display retry/delayed assistance UI
    const timer = setTimeout(() => {
      setIsDelayed(true);
      try {
        window.location.replace("/ar");
      } catch {
        // Fallback to manual click
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main
      dir="rtl"
      className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white relative overflow-hidden font-sans selection:bg-blue-500/30"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 -right-24 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container Card */}
      <div className="relative z-10 w-full max-w-md mx-auto p-8 sm:p-10 rounded-3xl bg-slate-900/80 backdrop-blur-xl border border-slate-800 shadow-2xl shadow-black/60 text-center flex flex-col items-center">
        {/* Brand Logo */}
        <div className="relative mb-6">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 blur-lg opacity-40 animate-pulse" />
          <div className="relative w-20 h-20 rounded-2xl bg-slate-800/90 border border-slate-700/60 p-3.5 flex items-center justify-center shadow-inner">
            <Image
              src="/logo.svg"
              alt="شعار بيان تك"
              width={56}
              height={56}
              className="w-full h-full object-contain invert"
              priority
            />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold tracking-tight text-white mb-2 flex items-center justify-center gap-2">
          <span>بيان تك</span>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-400">
            BayanTech
          </span>
        </h1>

        {/* Status Indicator */}
        <div className="flex items-center justify-center gap-2.5 text-slate-300 text-sm mb-6">
          <Loader2 className="w-4 h-4 animate-spin text-blue-400 shrink-0" />
          <span>جاري تحويلك تلقائياً إلى التطبيق...</span>
        </div>

        {/* Manual Redirection Button (Always accessible if auto-redirect crashes or delays) */}
        <a
          href="/ar"
          className="group w-full inline-flex items-center justify-center gap-3 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-base shadow-lg shadow-blue-600/30 transition-all duration-200 hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] border border-blue-400/20"
        >
          <span>الانتقال إلى التطبيق مباشرة</span>
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        </a>

        {/* Helper / Delayed Notice */}
        {isDelayed ? (
          <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-center gap-2 text-right">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
            <span>
              إذا تأخر التحويل التلقائي، يُرجى النقر على الزر أعلاه للمتابعة.
            </span>
          </div>
        ) : (
          <p className="text-xs text-slate-400 mt-4 leading-relaxed">
            إذا لم يتم تحويلك تلقائياً خلال ثوانٍ، اضغط على الزر أعلاه للمتابعة.
          </p>
        )}

        {/* Quick Locale Selectors */}
        <div className="mt-8 pt-6 border-t border-slate-800/90 w-full flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5 text-slate-400">
            <Globe className="w-3.5 h-3.5 text-slate-400" />
            <span>اللغة / Language:</span>
          </span>
          <div className="flex items-center gap-2 font-medium">
            <a
              href="/ar"
              className="px-2.5 py-1 rounded-lg bg-blue-500/15 text-blue-400 hover:bg-blue-500/25 transition-colors"
            >
              العربية
            </a>
            <span className="text-slate-700">|</span>
            <a
              href="/fr"
              className="px-2.5 py-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            >
              Français
            </a>
            <span className="text-slate-700">|</span>
            <a
              href="/en"
              className="px-2.5 py-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            >
              English
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-8 text-xs text-slate-400 text-center">
        جميع الحقوق محفوظة &copy; بيان تك
      </footer>
    </main>
  );
}
