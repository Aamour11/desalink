
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
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  LayoutGrid,
  Users,
  Store,
  LogOut,
  Settings,
  ChevronDown,
} from "lucide-react";
import { LogoIcon } from "@/components/icons";
import { mockUsers } from "@/lib/data";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "../ui/button";

const navItems = [
  { href: "/dashboard", icon: LayoutGrid, label: "Dashboard" },
  { href: "/dashboard/umkm", icon: Store, label: "UMKM" },
  { href: "/dashboard/users", icon: Users, label: "Pengguna" },
  { href: "/dashboard/settings", icon: Settings, label: "Pengaturan" },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const currentUser = mockUsers[0];

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="justify-center group-data-[collapsed=icon]:justify-center">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="bg-primary p-2 rounded-lg">
            <LogoIcon className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="font-headline text-xl font-bold text-sidebar-foreground group-data-[collapsed=icon]:hidden">
            DesaLink
          </span>
        </Link>
        <SidebarTrigger className="hidden sm:flex absolute right-2 group-data-[collapsed=icon]:hidden" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                isActive={pathname.startsWith(item.href) && (item.href === '/dashboard' ? pathname === item.href : true) }
                icon={<item.icon />}
                tooltip={{ children: item.label, side: "right" }}
                onClick={() => router.push(item.href)}
              >
                {item.label}
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="flex-col items-start gap-2 !p-2 group-data-[collapsed=icon]:items-center">
         <div className="w-full border-t border-sidebar-border/50 group-data-[collapsed=icon]:w-2/3" />
         <SidebarMenu>
          <SidebarMenuItem>
             <SidebarMenuButton 
                variant="ghost"
                className="w-full justify-start"
                tooltip={{ children: "Logout", side: "right" }}
                icon={<LogOut />}
                onClick={() => router.push('/login')}
              >
              <span className="group-data-[collapsed=icon]:hidden">Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
         </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
