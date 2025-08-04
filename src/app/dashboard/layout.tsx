
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
    // This is the fallback for demo mode when no one is logged in.
    // It should not redirect to login, but use a mock admin instead.
    const mockAdmin = mockUsers.find(u => u.role === 'Admin Desa');
    if (mockAdmin) {
      user = mockAdmin;
    } else {
       // If even the mock admin isn't found, something is very wrong with the data.
       // Redirecting to login is the safest fallback.
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
