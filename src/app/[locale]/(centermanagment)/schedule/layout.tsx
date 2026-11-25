import DesktopAppUpsell from "@/components/centermanagementcomponents/freeinUse/DesktopAppUpsell";
import { ReactNode } from "react";

export default function ScheduleLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      {children}
      <DesktopAppUpsell />
    </div>
  );
}
