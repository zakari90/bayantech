"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  variant?: "blue" | "emerald" | "amber" | "rose" | "purple";
  badge?: string;
  onClick?: () => void;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = "blue",
  badge,
  onClick,
}: StatCardProps) {
  const variantStyles = {
    blue: {
      border: "border-blue-500/20 dark:border-blue-500/30",
      bg: "bg-blue-500/5 dark:bg-blue-950/20",
      iconBg: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
      accent: "text-blue-600 dark:text-cyan-400",
    },
    emerald: {
      border: "border-emerald-500/20 dark:border-emerald-500/30",
      bg: "bg-emerald-500/5 dark:bg-emerald-950/20",
      iconBg: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
      accent: "text-emerald-600 dark:text-emerald-400",
    },
    amber: {
      border: "border-amber-500/20 dark:border-amber-500/30",
      bg: "bg-amber-500/5 dark:bg-amber-950/20",
      iconBg: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
      accent: "text-amber-600 dark:text-amber-400",
    },
    rose: {
      border: "border-rose-500/20 dark:border-rose-500/30",
      bg: "bg-rose-500/5 dark:bg-rose-950/20",
      iconBg: "bg-rose-500/15 text-rose-600 dark:text-rose-400",
      accent: "text-rose-600 dark:text-rose-400",
    },
    purple: {
      border: "border-purple-500/20 dark:border-purple-500/30",
      bg: "bg-purple-500/5 dark:bg-purple-950/20",
      iconBg: "bg-purple-500/15 text-purple-600 dark:text-purple-400",
      accent: "text-purple-600 dark:text-purple-400",
    },
  }[variant];

  return (
    <Card
      onClick={onClick}
      className={`relative overflow-hidden transition-all duration-200 ${variantStyles.border} ${variantStyles.bg} ${
        onClick ? "cursor-pointer hover:shadow-md hover:-translate-y-0.5 active:translate-y-0" : ""
      }`}
    >
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1 min-w-0">
            <p className="text-xs font-medium text-muted-foreground truncate">{title}</p>
            <div className={`text-xl sm:text-2xl font-black tracking-tight ${variantStyles.accent}`}>
              {value}
            </div>
            {subtitle && (
              <p className="text-[11px] text-muted-foreground truncate">{subtitle}</p>
            )}
          </div>
          <div className={`p-2.5 rounded-2xl shrink-0 ${variantStyles.iconBg}`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
        {badge && (
          <div className="mt-2.5 pt-2 border-t border-border/40 flex items-center justify-between text-[11px] font-semibold text-muted-foreground">
            <span>{badge}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
