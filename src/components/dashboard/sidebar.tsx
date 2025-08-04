
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
import type { User } from "@/lib/types";
import { useEffect, useState } from "react";
import { getCurrentUser, signOut as serverSignOut } from "@/server/actions";

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
  const { setOpenMobile, activeUser, setActiveUser } = useSidebar();
  
  useEffect(() => {
    // On initial load, set the active user from the server action
    // This respects the cookie/header logic for role switching
    const fetchAndSetUser = async () => {
        try {
            const user = await getCurrentUser();
            if (user) {
                setActiveUser(user);
            } else {
                // If no user is found client-side, something is wrong, redirect to login
                window.location.href = "/login";
            }
        } catch (e) {
            console.error("Failed to fetch current user, redirecting.", e);
            window.location.href = "/login";
        }
    }
    fetchAndSetUser();
  }, [setActiveUser]);


  const handleNavigate = (href: string) => {
    router.push(href);
    setOpenMobile(false); 
  };

  const handleLogout = async () => {
    await serverSignOut();
    window.location.href = "/login";
  };
  
  const handleRoleSwitch = () => {
    const currentRole = document.cookie.split('; ').find(row => row.startsWith('activeRole='))?.split('=')[1];
    const newRole = currentRole === 'admin' ? 'petugas' : 'admin';
    
    // Set cookie for middleware to pick up on the next request
    document.cookie = `activeRole=${newRole}; path=/; max-age=31536000`; // Expires in 1 year
    
    // Force a reload to ensure all server components re-fetch data with the new role context
    window.location.reload();
  };

  const userIsAdmin = activeUser?.role === "Admin Desa";

  return (
    <Sidebar>
      <SidebarHeader>
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="bg-primary p-2 rounded-lg">
            <LogoIcon className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="font-headline text-xl font-bold text-sidebar-foreground group-data-[state=collapsed]:hidden">
            DesaLink
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => {
            if (item.adminOnly && !userIsAdmin) {
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
          <SidebarMenuItem>
             <SidebarMenuButton
                variant="ghost"
                className="w-full justify-start"
                tooltip={{ children: userIsAdmin ? "Beralih ke Petugas" : "Beralih ke Admin" }}
                icon={<Replace />}
                onClick={handleRoleSwitch}
            >
                {userIsAdmin ? "Beralih ke Petugas" : "Beralih ke Admin"}
            </SidebarMenuButton>
          </SidebarMenuItem>

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
