
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
import React from "react";

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
  
  const handleNavigate = (href: string) => {
    router.push(href);
    setOpenMobile(false); 
  };

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
  };
  
  const handleRoleSwitch = () => {
    // This logic is safe as it's triggered by a user click, which is always client-side.
    const newRole = user?.role === 'Admin Desa' ? 'petugas' : 'admin';
    document.cookie = `activeRole=${newRole}; path=/; max-age=31536000`; // Expires in 1 year
    
    if (newRole === 'petugas') {
      window.location.href = '/dashboard/umkm';
    } else {
      window.location.href = '/dashboard';
    }
  };

  const isDisplayingAsAdmin = user?.role === "Admin Desa";
  // The original user is the admin if their actual ID is 'user-admin'.
  // The `user` object might be a simulated one, but its ID remains consistent for this check.
  const isOriginalUserAdmin = user?.id === 'user-admin';

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
