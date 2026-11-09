"use client";

import React, { useState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import {
  Droplets,
  WifiOff,
  AlertTriangle,
  Globe,
  Sun,
  Moon,
  Database,
  ArrowRight,
  ArrowLeft,
  HelpCircle,
  LogOut,
  Lock,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { WaterSettings } from "@/app/waterdexiedb/types";
import { getSettings } from "@/app/waterdexiedb/repositories/settingsRepo";
import { logoutSession } from "@/app/waterdexiedb/auth";
import dynamic from "next/dynamic";

const CacheStatusIndicator = dynamic(
  () => import("@/components/CacheStatusIndicator").then((m) => m.CacheStatusIndicator),
  {
    ssr: false,
    loading: () => (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-border/40 bg-muted/20 text-muted-foreground text-[11px] font-medium h-[26px] w-[110px]" />
    ),
  }
);

export function WaterTopNav() {
  const locale = useLocale();
  const isRtl = locale === "ar";
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const [settings, setSettings] = useState<WaterSettings | null>(null);
  const [needsBackup, setNeedsBackup] = useState(false);

  useEffect(() => {
    async function load() {
      const s = await getSettings();
      setSettings(s);

      // Check if backup is older than 30 days
      if (s.lastBackupAt) {
        const last = new Date(s.lastBackupAt).getTime();
        const now = Date.now();
        const days = (now - last) / (1000 * 60 * 60 * 24);
        if (days > 30) setNeedsBackup(true);
      } else {
        setNeedsBackup(true);
      }
    }
    load();
  }, [pathname]);

  const toggleLanguage = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur-md supports-backdrop-filter:bg-background/80">
      <div className="flex h-14 items-center justify-between px-3 sm:px-6 max-w-5xl mx-auto">
        {/* Brand & Association Name */}
        <div className="flex items-center gap-2.5 min-w-0">
          <Link
            href="/waterassociation/waterassociationmanager"
            className="flex items-center gap-2 min-w-0 group"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-cyan-500 to-blue-600 text-white shadow-sm shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Droplets className="h-5 w-5 fill-white/20" />
            </div>
            <div className="truncate">
              <h1 className="text-sm font-bold text-foreground leading-tight truncate">
                {settings?.associationName || (isRtl ? "تسيير جمعية الماء" : "Water Manager")}
              </h1>
              <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                <span>{settings?.villageName || (isRtl ? "النسخة المحلية" : "Local Edition")}</span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span className="text-emerald-600 dark:text-emerald-400 font-medium text-[10px]">
                  {isRtl ? "بدون أنترنت" : "Offline PWA"}
                </span>
              </p>
            </div>
          </Link>
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Cache Status Badge */}
          <CacheStatusIndicator />

          {/* Backup Alert Chip */}
          {needsBackup && (
            <Link href="/waterassociation/waterassociationmanager/settings">
              <Badge
                variant="outline"
                className="hidden sm:inline-flex items-center gap-1 border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 cursor-pointer text-[11px] py-0.5"
              >
                <AlertTriangle className="h-3 w-3" />
                <span>{isRtl ? "تذكير بالنسخ الاحتياطي" : "Backup needed"}</span>
              </Badge>
            </Link>
          )}

          {/* How It Works Guide Link */}
          <Link href="/waterassociation/how-it-works" title={isRtl ? "دليل: كيف يعمل التطبيق؟" : "How it works"}>
            <Button
              variant={pathname.includes("/how-it-works") ? "secondary" : "ghost"}
              size="icon"
              className={`h-8 w-8 rounded-lg ${pathname.includes("/how-it-works") ? "text-cyan-600 bg-cyan-500/15" : "text-muted-foreground"}`}
            >
              <HelpCircle className="h-4 w-4" />
              <span className="sr-only">How it works</span>
            </Button>
          </Link>

          {/* Language Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <span className="sr-only">Language</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={isRtl ? "start" : "end"} className="w-36">
              <DropdownMenuItem
                onClick={() => toggleLanguage("ar")}
                className={`flex justify-between ${locale === "ar" ? "font-bold text-primary" : ""}`}
              >
                <span>العربية (المغرب)</span>
                {locale === "ar" && <span>✓</span>}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => toggleLanguage("fr")}
                className={`flex justify-between ${locale === "fr" ? "font-bold text-primary" : ""}`}
              >
                <span>Français</span>
                {locale === "fr" && <span>✓</span>}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => toggleLanguage("en")}
                className={`flex justify-between ${locale === "en" ? "font-bold text-primary" : ""}`}
              >
                <span>English</span>
                {locale === "en" && <span>✓</span>}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Switcher */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-muted-foreground" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-muted-foreground" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* Quick Lock / Logout Button (when PIN is enabled) */}
          {settings?.pinEnabled && (
            <Button
              variant="ghost"
              size="icon"
              title={isRtl ? "قفل الجلسة (تسجيل الخروج)" : "Lock Session (Logout)"}
              className="h-8 w-8 rounded-lg text-rose-500 hover:text-rose-600 hover:bg-rose-500/10"
              onClick={() => {
                logoutSession();
                router.replace("/waterassociation/login");
              }}
            >
              <LogOut className="h-4 w-4" />
              <span className="sr-only">Lock</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
