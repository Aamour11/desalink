
import type { PropsWithChildren } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/header";
import { getCurrentUser } from "@/server/actions";
import { redirect } from "next/navigation";

export default function DashboardLayout({ children }: PropsWithChildren) {
  // We remove the server-side check here.
  // The middleware.ts already protects the route, and client components
  // will fetch their own user data. This avoids caching issues on login/logout.

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-muted/40">
        <DashboardSidebar />
        <div className="flex flex-col flex-1">
          <DashboardHeader />
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
