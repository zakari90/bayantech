import DesktopAppUpsell from "@/components/freeinUse/DesktopAppUpsell";
import { ReactNode } from "react";

export default function ScheduleLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      {children}
      <DesktopAppUpsell />
    </div>
  );
}
