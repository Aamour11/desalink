
import type { PropsWithChildren } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/header";
import { getCurrentUser } from "@/server/actions";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }: PropsWithChildren) {
  // Middleware handles redirection for unauthenticated users.
  // We can safely assume a user exists here.
  // This server-side check adds an extra layer of security.
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }

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
