'use client';

import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import AppSidebar from '@/components/app-sidebar';

const creatorMenuItems = [
  { label: '📊 Dashboard', href: '/dashboard/creator', icon: '📊' },
  { label: '🎬 Campaigns', href: '/dashboard/creator/campaigns', icon: '🎬' },
  { label: '💰 Billing', href: '/dashboard/creator/billing', icon: '💰' },
  { label: '⚙️ Settings', href: '/dashboard/creator/settings', icon: '⚙️' },
];

export default function CreatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar menuItems={creatorMenuItems} user={null} />
      <main className="w-full">
        <SidebarTrigger className="md:hidden" />
        {children}
      </main>
    </SidebarProvider>
  );
}