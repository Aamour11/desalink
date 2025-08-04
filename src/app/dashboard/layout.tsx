
import type { PropsWithChildren } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/header";
import { getCurrentUser } from "@/server/actions";
import { redirect } from "next/navigation";

// This layout now relies on the sidebar to manage the active mock user via localStorage.
// The sidebar will pass the correct user to the header.

export default async function DashboardLayout({ children }: PropsWithChildren) {
  // The actual user fetching is now primarily handled in the client-side sidebar
  // to allow for easy role switching for demo purposes.
  // We can pass a default or null user to the header initially.
  const user = await getCurrentUser();

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-muted/40">
        <DashboardSidebar />
        <div className="flex flex-col flex-1">
          {/* The header will now receive the user prop dynamically from the sidebar state */}
          <DashboardHeader />
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
