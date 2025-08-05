
"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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
  UserX,
} from "lucide-react";
import { LogoIcon } from "@/components/icons";
import { signOut } from "@/server/actions";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

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
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setOpenMobile, user, state: sidebarState } = useSidebar();
  const [isClient, setIsClient] = useState(false);

  const isSimulating = searchParams.has('sim_user');

  useEffect(() => {
    setIsClient(true);
  }, []);
  
  const handleNavigate = (href: string) => {
    // Preserve simulation query param when navigating
    const url = isSimulating ? `${href}?${searchParams.toString()}` : href;
    router.push(url);
    setOpenMobile(false); 
  };

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
  };
  
  const handleStopSimulation = () => {
    // Navigate to the base dashboard URL without any query parameters.
    router.push('/dashboard');
  }

  if (!isClient || !user) {
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

  const isUserAdmin = user.role === 'Admin Desa';

  return (
    <Sidebar>
      <SidebarHeader>
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="bg-primary p-2 rounded-lg">
            <LogoIcon className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="font-headline text-xl font-bold text-sidebar-foreground group-data-[state=expanded]:block hidden">
            DesaLink
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {isSimulating && isUserAdmin && (
             <div className="p-3">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <div className="bg-yellow-400/20 border border-yellow-400/50 text-yellow-300 p-3 rounded-lg text-sm text-center cursor-pointer" onClick={handleStopSimulation}>
                            <div className="group-data-[state=collapsed]:hidden">
                                <h4 className="font-bold mb-1">Mode Simulasi</h4>
                                <p>Klik untuk kembali ke akun Admin Anda.</p>
                            </div>
                            <UserX className="h-5 w-5 mx-auto group-data-[state=expanded]:hidden" />
                        </div>
                    </TooltipTrigger>
                    {sidebarState === 'collapsed' && (
                        <TooltipContent side="right" align="center">
                            <p>Kembali ke Admin</p>
                        </TooltipContent>
                    )}
                </Tooltip>
            </div>
        )}
        <SidebarMenu>
          {navItems.map((item) => {
            if (item.adminOnly && (isSimulating || !isUserAdmin)) {
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
