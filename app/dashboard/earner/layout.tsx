import {  getLoggedInUserAction } from '@/lib/auth';
import { fetchUserData } from '@/lib/actions/user';
import AppSidebar from '@/components/app-sidebar';
import { EARNER_MENU_ITEMS } from '@/constants/navigation';
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

export default async function EarnerLayout({ children }: { children: React.ReactNode }) {
  const currentUser = await getLoggedInUserAction();

  if (!currentUser) {
    return <div className="p-8">Not logged in</div>;
  }

  // Fetch full user data from Firestore
  const userData = await fetchUserData(currentUser.id);

  if (!userData) {
    return <div className="p-8">User data not found</div>;
  }

  return (
    <SidebarProvider>
      <AppSidebar menuItems={EARNER_MENU_ITEMS} user={userData} />
      <SidebarInset>
        <main className="flex-1">
          {/* Pass userData to children via context or props */}
          <SidebarTrigger />
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}