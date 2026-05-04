'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { logoutAction } from '@/lib/auth';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { User } from '@/types';
import { LogOut, Shield } from 'lucide-react';

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
      await logoutAction();
      router.push('/login');
    } catch (error) {
      console.error('[Sidebar] Logout failed:', error);
    }
  };

  return (
    <Sidebar className="bg-background border-r border-border">
      {/* Header - PRIMARY (Red - Brand) */}
      <SidebarHeader className="p-6 border-b border-border">
        <Link href="/" className="flex items-center gap-2 group">
          {/* Logo - PRIMARY */}
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center group-hover:bg-primary/90 transition shrink-0">
            <span className="text-white font-bold text-sm">Y</span>
          </div>
          <span className="text-xl font-bold text-primary group-hover:text-primary/90 transition">
            YubeEarn
          </span>
        </Link>
      </SidebarHeader>

      {/* Navigation Menu */}
      <SidebarContent className="p-4">
        <SidebarMenu className="space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  className={`rounded-lg font-bold transition ${
                    isActive
                      ? 'bg-primary text-white hover:bg-primary/90'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <Link href={item.href}>
                    <span className="text-lg">{item.icon}</span>
                    <span className="text-sm">{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="p-4 space-y-4 border-t border-border">
        {/* User Card - PRIMARY (Red - info) */}
        <Card className="bg-primary/5 border-primary/20 p-4 hover:border-primary/50 transition">
          <div className="flex items-start gap-2 mb-2">
            <Shield className="w-3 h-3 text-primary shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground font-bold">Logged in as</p>
          </div>
          <p className="text-sm font-bold text-foreground truncate">
            {user?.email || 'Not logged in'}
          </p>
          <p className="text-xs text-muted-foreground mt-2 capitalize">
            Role: 
            {/* PRIMARY: Role badge (red) */}
            <Badge 
              variant="outline" 
              className="ml-1 bg-primary/10 text-primary border-primary/30 shrink-0"
            >
              {user?.role === 'creator' ? '🎬 Creator' : user?.role === 'earner' ? '💰 Earner' : '⚙️ Admin'}
            </Badge>
          </p>
        </Card>

        {/* Logout Button - PRIMARY (Red - action) */}
        <Button
          className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-10 transition"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}