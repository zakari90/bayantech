import AutoImportFromServer from "@/components/centermanagementcomponents/auto-import-from-server";
import { AutoSyncProvider } from "@/components/AutoSyncProvider";
import { EpochMismatchDialog } from "@/components/centermanagementcomponents/epoch-mismatch-dialog";
import { AuthProvider } from "@/context/authContext";
import { ReactNode } from "react";

export default function ProLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <AuthProvider>
      <AutoImportFromServer />
      <AutoSyncProvider />
      <EpochMismatchDialog />
      {children}
    </AuthProvider>
  );
}
