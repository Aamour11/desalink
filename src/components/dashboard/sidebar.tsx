
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
} from "@/components/ui/sidebar";
import {
  LayoutGrid,
  Users,
  Store,
  LogOut,
  Settings,
  Shield,
} from "lucide-react";
import { LogoIcon } from "@/components/icons";
import { signOut } from "@/server/actions";

const navItems = [
  { href: "/dashboard", icon: LayoutGrid, label: "Dashboard" },
  { href: "/dashboard/umkm", icon: Store, label: "UMKM" },
  { href: "/dashboard/users", icon: Users, label: "Pengguna" },
  { href: "/dashboard/admin", icon: Shield, label: "Pusat Administrasi", adminOnly: true },
];

const bottomNavItems = [
    { href: "/dashboard/settings", icon: Settings, label: "Pengaturan" },
]

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.push('/login');
  }

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
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                isActive={pathname === item.href}
                icon={<item.icon />}
                tooltip={{ children: item.label }}
                onClick={() => router.push(item.href)}
              >
                {item.label}
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
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
                    onClick={() => router.push(item.href)}
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
