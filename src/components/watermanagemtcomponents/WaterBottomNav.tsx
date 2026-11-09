"use client";

import React, { useState } from "react";
import { useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import {
  Home,
  Users,
  Gauge,
  CreditCard,
  Menu,
} from "lucide-react";
import { MoreMenuSheet } from "./MoreMenuSheet";
import { CacheStatusDot } from "@/components/CacheStatusDot";

export function WaterBottomNav() {
  const locale = useLocale();
  const isRtl = locale === "ar";
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);

  const isActive = (route: string) => {
    if (route === "/waterassociation/waterassociationmanager") {
      const p = pathname.toLowerCase();
      return (
        p === "/waterassociation/waterassociationmanager" ||
        p === "/waterassociation/waterassociationmanager/"
      );
    }
    return pathname.toLowerCase().startsWith(route.toLowerCase());
  };

  const isMoreActive =
    pathname.includes("/expenses") ||
    pathname.includes("/reports") ||
    pathname.includes("/settings");

  return (
    <>
      <nav
        aria-label="Mobile Navigation"
        className="fixed bottom-0 left-0 right-0 z-40 border-t bg-background/95 backdrop-blur-lg supports-backdrop-filter:bg-background/85 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_20px_rgba(0,0,0,0.05)]"
      >
        <div className="max-w-md mx-auto grid grid-cols-5 h-16 items-center px-1">
          {/* 1. Home */}
          <Link
            href="/waterassociation/waterassociationmanager"
            className={`flex flex-col items-center justify-center h-full py-1 text-center transition-all ${
              isActive("/waterassociation/waterassociationmanager")
                ? "text-blue-600 dark:text-cyan-400 font-bold scale-105"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <div
              className={`relative p-1 rounded-xl transition-colors ${
                isActive("/waterassociation/waterassociationmanager")
                  ? "bg-blue-500/15"
                  : "bg-transparent"
              }`}
            >
              <Home className="h-5 w-5" />
              <CacheStatusDot href="/waterassociation/waterassociationmanager" className="absolute top-0.5 end-0.5" />
            </div>
            <span className="text-[10px] leading-tight mt-0.5 truncate max-w-[58px]">
              {isRtl ? "الرئيسية" : "Home"}
            </span>
          </Link>

          {/* 2. Members */}
          <Link
            href="/waterassociation/waterassociationmanager/members"
            className={`flex flex-col items-center justify-center h-full py-1 text-center transition-all ${
              isActive("/waterassociation/waterassociationmanager/members")
                ? "text-blue-600 dark:text-cyan-400 font-bold scale-105"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <div
              className={`relative p-1 rounded-xl transition-colors ${
                isActive("/waterassociation/waterassociationmanager/members")
                  ? "bg-blue-500/15"
                  : "bg-transparent"
              }`}
            >
              <Users className="h-5 w-5" />
              <CacheStatusDot href="/waterassociation/waterassociationmanager/members" className="absolute top-0.5 end-0.5" />
            </div>
            <span className="text-[10px] leading-tight mt-0.5 truncate max-w-[58px]">
              {isRtl ? "المنخرطون" : "Members"}
            </span>
          </Link>

          {/* 3. Readings (Center highlight) */}
          <Link
            href="/waterassociation/waterassociationmanager/readings"
            className={`flex flex-col items-center justify-center h-full py-1 text-center transition-all ${
              isActive("/waterassociation/waterassociationmanager/readings")
                ? "text-cyan-600 dark:text-cyan-300 font-bold scale-105"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <div
              className={`relative p-1.5 rounded-xl transition-all ${
                isActive("/waterassociation/waterassociationmanager/readings")
                  ? "bg-linear-to-tr from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/30"
                  : "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400"
              }`}
            >
              <Gauge className="h-5 w-5" />
              <CacheStatusDot href="/waterassociation/waterassociationmanager/readings" className="absolute top-0.5 end-0.5" />
            </div>
            <span className="text-[10px] leading-tight mt-0.5 truncate max-w-[58px]">
              {isRtl ? "العدادات" : "Readings"}
            </span>
          </Link>

          {/* 4. Payments */}
          <Link
            href="/waterassociation/waterassociationmanager/payments"
            className={`flex flex-col items-center justify-center h-full py-1 text-center transition-all ${
              isActive("/waterassociation/waterassociationmanager/payments")
                ? "text-blue-600 dark:text-cyan-400 font-bold scale-105"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <div
              className={`relative p-1 rounded-xl transition-colors ${
                isActive("/waterassociation/waterassociationmanager/payments")
                  ? "bg-blue-500/15"
                  : "bg-transparent"
              }`}
            >
              <CreditCard className="h-5 w-5" />
              <CacheStatusDot href="/waterassociation/waterassociationmanager/payments" className="absolute top-0.5 end-0.5" />
            </div>
            <span className="text-[10px] leading-tight mt-0.5 truncate max-w-[58px]">
              {isRtl ? "الأداءات" : "Payments"}
            </span>
          </Link>

          {/* 5. More */}
          <button
            type="button"
            onClick={() => setMoreOpen(true)}
            className={`flex flex-col items-center justify-center h-full py-1 text-center transition-all cursor-pointer ${
              isMoreActive
                ? "text-blue-600 dark:text-cyan-400 font-bold scale-105"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <div
              className={`p-1 rounded-xl transition-colors ${
                isMoreActive ? "bg-blue-500/15" : "bg-transparent"
              }`}
            >
              <Menu className="h-5 w-5" />
            </div>
            <span className="text-[10px] leading-tight mt-0.5 truncate max-w-[58px]">
              {isRtl ? "المزيد" : "More"}
            </span>
          </button>
        </div>
      </nav>

      {/* Slide-in More Menu Drawer */}
      <MoreMenuSheet open={moreOpen} onOpenChange={setMoreOpen} />
    </>
  );
}
