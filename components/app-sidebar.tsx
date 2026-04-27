"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { logoutAction } from "@/lib/auth";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { User } from "@/types";

interface MenuItem {
  label: string;
  href: string;
  icon: string;
}

interface AppSidebarProps {
  menuItems: MenuItem[];
  user: User | null;
}

export default function AppSidebar({ menuItems, user }: AppSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logoutAction;
      router.push('/login');
    } catch (error) {
      console.error('[Sidebar] Logout failed:', error);
    }
  };

  return (
    <Sidebar>
      <SidebarHeader className="p-6">
        <Link href="/" className="text-2xl font-bold text-red-600">
          YubeEarn
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  className={`font-bold ${
                    isActive
                      ? "bg-red-600 text-white hover:bg-red-700"
                      : "text-gray-300 hover:bg-gray-800"
                  }`}
                >
                  <Link href={item.href}>
                    <span className="text-xl">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <Separator className="mb-4 bg-gray-700" />
        <div className="bg-gray-800 rounded-lg p-4 mb-4">
          <p className="text-xs text-gray-400 mb-1">Logged in as</p>
          <p className="text-sm font-bold text-white truncate">
            {user?.email || "Not logged in"}
          </p>
        </div>
        <Button
          className="w-full bg-red-600 hover:bg-red-700 text-white"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}