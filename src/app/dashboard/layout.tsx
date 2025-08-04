
import type { PropsWithChildren } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/header";
import { getCurrentUser } from "@/server/actions";
import { redirect } from "next/navigation";

// Mock user for bypass - Now simulating an Admin Desa
const mockUser = {
  id: 'user-admin',
  name: 'Admin Desa Utama',
  email: 'admin@desa.com',
  role: 'Admin Desa' as const,
  rtRw: '-',
  avatarUrl: 'https://placehold.co/100x100.png?text=AD'
};

export default async function DashboardLayout({ children }: PropsWithChildren) {
  let user = await getCurrentUser();
  
  // If no user is logged in, use the mock user. This bypasses the login requirement.
  if (!user) {
    user = mockUser;
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-muted/40">
        <DashboardSidebar />
        <div className="flex flex-col flex-1">
          <DashboardHeader user={user} />
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
