"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import {
  LayoutGrid,
  Users,
  Store,
  LogOut,
  LifeBuoy,
  Settings,
} from "lucide-react";
import { LogoIcon } from "@/components/icons";
import { Button } from "../ui/button";
import { mockUsers } from "@/lib/data";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const navItems = [
  { href: "/dashboard", icon: LayoutGrid, label: "Dashboard" },
  { href: "/dashboard/umkm", icon: Store, label: "UMKM" },
  { href: "/dashboard/users", icon: Users, label: "Pengguna" },
];

const secondaryNavItems = [
    { href: "#", icon: LifeBuoy, label: "Bantuan" },
    { href: "#", icon: Settings, label: "Pengaturan" },
]

export function DashboardSidebar() {
  const pathname = usePathname();
  const currentUser = mockUsers[0];

  return (
    <Sidebar>
      <SidebarHeader>
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="bg-primary p-2 rounded-lg">
            <LogoIcon className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="font-headline text-xl font-bold text-sidebar-foreground group-data-[collapsible=icon]:hidden">
            DesaLink
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} legacyBehavior passHref>
                <SidebarMenuButton
                  isActive={pathname === item.href}
                  icon={<item.icon />}
                  tooltip={{ children: item.label, side: "right" }}
                >
                  {item.label}
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="flex flex-col gap-4">
        <SidebarSeparator />
         <SidebarMenu>
            {secondaryNavItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                <Link href={item.href} legacyBehavior passHref>
                    <SidebarMenuButton
                    isActive={pathname === item.href}
                    icon={<item.icon />}
                    tooltip={{ children: item.label, side: "right" }}
                    >
                    {item.label}
                    </SidebarMenuButton>
                </Link>
                </SidebarMenuItem>
            ))}
        </SidebarMenu>
        <SidebarSeparator />
         <div className="flex items-center gap-3 p-2 rounded-lg bg-sidebar-accent transition-colors group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:justify-center">
            <Avatar className="h-10 w-10">
                <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name} />
                <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                <p className="text-sm font-semibold text-sidebar-accent-foreground">{currentUser.name}</p>
                <p className="text-xs text-muted-foreground">{currentUser.email}</p>
            </div>
             <Button variant="ghost" size="icon" className="h-8 w-8 ml-auto group-data-[collapsible=icon]:hidden">
                <Link href="/login">
                    <LogOut className="h-4 w-4" />
                </Link>
            </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
