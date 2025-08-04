
import type { PropsWithChildren } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/header";
import { getCurrentUser } from "@/server/actions";
import { redirect } from "next/navigation";
import { mockUsers } from "@/lib/data";

export default async function DashboardLayout({ children }: PropsWithChildren) {
  let user = await getCurrentUser();

  if (!user) {
    // If no user is logged in, use the main Admin Desa as a mock user
    // to allow dashboard access without login (demo mode).
    const mockAdmin = mockUsers.find(u => u.role === 'Admin Desa');
    if (mockAdmin) {
      user = mockAdmin;
    } else {
       // If for some reason the mock admin is not found, redirect to login as a fallback.
       return redirect("/login");
    }
  }

  return (
    <SidebarProvider user={user}>
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
