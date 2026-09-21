"use client";

import { useIsOnline } from "@/hooks/useOnlineStatus";
import { useTranslations } from "next-intl";
import { CloudOff, Database } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useCacheStatusStore, type CacheStatusState } from "@/stores/useCacheStatusStore";
import { cn } from "@/lib/utils";

/**
 * A small dot indicator for individual navigation items.
 * Shows green if cached, amber if not.
 * Hides if everything is cached (global allCached state).
 */
export function CacheStatusDot({ href }: { href: string }) {
  const isOnline = useIsOnline();
  const allCached = useCacheStatusStore((state: CacheStatusState) => state.allCached);
  const isCached = useCacheStatusStore((state: CacheStatusState) => state.pageStatuses[href]);
  const isInitialCheckDone = useCacheStatusStore((state: CacheStatusState) => state.isInitialCheckDone);

  // Optional: hide dots if everything is perfect, but the user wants to see the green bubble
  // if (isOnline && allCached) return null;
  
  // Wait for initial check to avoid flickering
  if (!isInitialCheckDone) return null;

  return (
    <div 
      className={cn(
        "h-2 w-2 rounded-full border border-background shadow-sm",
        isCached ? "bg-emerald-500" : "bg-amber-500 animate-pulse"
      )} 
    />
  );
}

/**
 * Global status indicator (badge).
 * Shows offline or syncing status.
 * Now respects the centralized store's allCached state for hiding.
 */
interface CacheStatusIndicatorProps {
  isSyncing?: boolean;
}

export function CacheStatusIndicator({ isSyncing }: CacheStatusIndicatorProps) {
  const isOnline = useIsOnline();
  const allCached = useCacheStatusStore((state: CacheStatusState) => state.allCached);
  const t = useTranslations("CacheStatusIndicator");

  // If online but not fully cached yet, do not show any spinning badge
  if (isOnline && !allCached) return null;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center cursor-default select-none">
            {!isOnline ? (
              <Badge
                variant="outline"
                className="h-8 px-2.5 gap-1.5 rounded-lg border-orange-500/20 bg-orange-500/10 text-orange-600 dark:border-orange-500/30 dark:bg-orange-500/15 dark:text-orange-400 font-medium text-xs shadow-xs"
              >
                <CloudOff className="h-3.5 w-3.5 shrink-0" />
                <span className="hidden sm:inline">
                  {t("offline")}
                </span>
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="h-8 px-2.5 gap-1.5 rounded-lg border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:border-emerald-500/30 dark:bg-emerald-500/15 dark:text-emerald-400 font-medium text-xs shadow-xs"
              >
                <Database className="h-3.5 w-3.5 shrink-0" />
                <span className="hidden sm:inline">
                  {t("ready") || "Ready"}
                </span>
              </Badge>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent
          side="bottom"
          align="end"
          className="text-xs max-w-[200px]"
        >
          <p>
            {!isOnline ? t("offline") : t("ready") || "Ready for offline"}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}


