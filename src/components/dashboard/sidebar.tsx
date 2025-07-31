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

const navItems = [
  { href: "/dashboard", icon: LayoutGrid, label: "Dashboard" },
  { href: "/dashboard/umkm", icon: Store, label: "UMKM" },
  { href: "/dashboard/users", icon: Users, label: "Pengguna" },
];

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
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                icon={<item.icon />}
                tooltip={{ children: item.label, side: "right" }}
              >
                <Link href={item.href}>{item.label}</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="flex flex-col gap-2 !p-2">
        <Collapsible>
          <CollapsibleTrigger asChild>
            <div className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-sidebar-accent transition-colors group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:justify-center">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                  data-ai-hint="user avatar"
                />
                <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                <p className="text-sm font-semibold text-sidebar-accent-foreground">
                  {currentUser.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {currentUser.email}
                </p>
              </div>
              <ChevronDown className="h-4 w-4 ml-auto group-data-[collapsible=icon]:hidden" />
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenu className="mt-2">
              <SidebarMenuItem>
                <SidebarMenuButton
                  variant="ghost"
                  className="w-full justify-start"
                  asChild
                >
                  <Link href="#">
                    <Settings className="mr-2 h-4 w-4" />
                    Pengaturan
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  variant="ghost"
                  className="w-full justify-start"
                  asChild
                >
                  <Link href="/login">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </CollapsibleContent>
        </Collapsible>
      </SidebarFooter>
    </Sidebar>
  );
}
