import React from "react";
import { WaterTopNav } from "@/components/watermanagemtcomponents/WaterTopNav";
import { WaterBottomNav } from "@/components/watermanagemtcomponents/WaterBottomNav";
import { setRequestLocale } from "next-intl/server";

import { WaterAuthGuard } from "@/components/watermanagemtcomponents/WaterAuthGuard";

export default async function WaterAssociationLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col antialiased selection:bg-cyan-500/20">
      {/* Top Header */}
      <WaterTopNav />

      {/* Main Content Area with Bottom Bar padding */}
      <main className="flex-1 pb-24 px-3 sm:px-6 max-w-5xl mx-auto w-full pt-4">
        <WaterAuthGuard>{children}</WaterAuthGuard>
      </main>

      {/* Fixed Bottom Mobile Navigation */}
      <WaterBottomNav />
    </div>
  );
}
