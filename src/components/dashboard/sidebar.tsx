
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  LayoutGrid,
  Users,
  Store,
  LogOut,
  Settings,
  Shield,
  Contact,
  Network,
  Replace,
} from "lucide-react";
import { LogoIcon } from "@/components/icons";
import { signOut } from "@/server/actions";
import React, { useEffect, useState } from "react";

const navItems = [
  { href: "/dashboard", icon: LayoutGrid, label: "Dashboard" },
  { href: "/dashboard/umkm", icon: Store, label: "UMKM" },
  { href: "/dashboard/structure", icon: Network, label: "Struktur Wilayah" },
  { href: "/dashboard/users", icon: Users, label: "Pengguna", adminOnly: true },
  { href: "/dashboard/management", icon: Contact, label: "Pengurus" },
  {
    href: "/dashboard/admin",
    icon: Shield,
    label: "Pusat Administrasi",
    adminOnly: true,
  },
];

const bottomNavItems = [
  { href: "/dashboard/settings", icon: Settings, label: "Pengaturan" },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { setOpenMobile, user } = useSidebar();
  const [activeRole, setActiveRole] = useState("admin");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // This effect runs only on the client-side
    setIsClient(true);
    const storedRole = localStorage.getItem("activeRole");
    if (storedRole) {
      setActiveRole(storedRole);
    } else if (user) {
      // If no role is stored, set the default based on the user's actual role
      const initialRole = user.role === 'Admin Desa' ? 'admin' : 'petugas';
      setActiveRole(initialRole);
      localStorage.setItem("activeRole", initialRole);
    }
  }, [user]);
  
  const handleNavigate = (href: string) => {
    router.push(href);
    setOpenMobile(false); 
  };

  const handleLogout = async () => {
    // Clear role preference on logout
    localStorage.removeItem("activeRole");
    await signOut();
    router.push("/login");
  };
  
  const handleRoleSwitch = () => {
    const newRole = activeRole === 'admin' ? 'petugas' : 'admin';
    // 1. Store the new role preference on the client
    localStorage.setItem("activeRole", newRole);
    // 2. Set a cookie that the middleware can read to inform the server render
    document.cookie = `activeRole=${newRole}; path=/; max-age=31536000`; // Expires in 1 year
    
    // 3. Force a full page reload to ensure the server re-renders with the new role context
    if (newRole === 'petugas') {
      window.location.href = '/dashboard/umkm';
    } else {
      window.location.href = '/dashboard';
    }
  };

  // The role displayed in the UI is based on the simulated role from localStorage.
  const isDisplayingAsAdmin = activeRole === 'admin';
  // The ability to switch roles is based on the user's *actual, original* role.
  const isOriginalUserAdmin = user?.role === "Admin Desa";

  // Prevent rendering the switch button on the server to avoid hydration mismatch
  if (!isClient) {
      return (
        <Sidebar>
            <SidebarHeader>
                 <Link href="/dashboard" className="flex items-center gap-2.5">
                    <div className="bg-primary p-2 rounded-lg">
                        <LogoIcon className="h-6 w-6 text-primary-foreground" />
                    </div>
                 </Link>
            </SidebarHeader>
        </Sidebar>
      );
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="bg-primary p-2 rounded-lg">
            <LogoIcon className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="font-headline text-xl font-bold text-sidebar-foreground group-data-[state=expanded]:hidden">
            DesaLink
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => {
            // Use the client-side activeRole to determine menu visibility
            if (item.adminOnly && !isDisplayingAsAdmin) {
              return null;
            }
            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  isActive={pathname === item.href}
                  icon={<item.icon />}
                  tooltip={{ children: item.label }}
                  onClick={() => handleNavigate(item.href)}
                >
                  {item.label}
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <div className="w-full border-t border-sidebar-border/50 my-2 group-data-[state=expanded]:w-full group-data-[state=collapsed]:w-2/3 mx-auto" />
        <SidebarMenu>
           {/* Only show the switch button if the original user is an admin */}
           {isOriginalUserAdmin && (
             <SidebarMenuItem>
                <SidebarMenuButton
                    variant="ghost"
                    className="w-full justify-start"
                    tooltip={{ children: isDisplayingAsAdmin ? "Beralih ke Petugas" : "Beralih ke Admin" }}
                    icon={<Replace />}
                    onClick={handleRoleSwitch}
                >
                  {isDisplayingAsAdmin ? "Beralih ke Petugas" : "Beralih ke Admin"}
                </SidebarMenuButton>
              </SidebarMenuItem>
           )}

          {bottomNavItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                isActive={pathname === item.href}
                icon={<item.icon />}
                tooltip={{ children: item.label }}
                onClick={() => handleNavigate(item.href)}
              >
                {item.label}
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          <SidebarMenuItem>
            <SidebarMenuButton
              variant="ghost"
              className="w-full justify-start"
              tooltip={{ children: "Logout" }}
              icon={<LogOut />}
              onClick={handleLogout}
            >
              Logout
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
