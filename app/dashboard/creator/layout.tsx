import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import AppSidebar from '@/components/app-sidebar';
import { getLoggedInUserAction } from '@/lib/auth';

const creatorMenuItems = [
  { label: 'Dashboard', href: '/dashboard/creator', icon: '📊' },
  { label: 'Campaigns', href: '/dashboard/creator/campaigns', icon: '🎬' },
  { label: 'Billing', href: '/dashboard/creator/billing', icon: '💳' },
  { label: 'Settings', href: '/dashboard/creator/settings', icon: '⚙️' },
];

export default async function CreatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getLoggedInUserAction();

  return (
    <SidebarProvider>
      <AppSidebar menuItems={creatorMenuItems} user={user} />
      <main className="w-full min-h-screen">
        <div className="md:hidden p-4 border-b border-border">
          <SidebarTrigger />
        </div>
        {children}
      </main>
    </SidebarProvider>
  );
}