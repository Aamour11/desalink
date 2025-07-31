import type { PropsWithChildren } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/header";

export default function DashboardLayout({ children }: PropsWithChildren) {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <div className="flex-1">
        <DashboardHeader />
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </SidebarProvider>
  );
}
