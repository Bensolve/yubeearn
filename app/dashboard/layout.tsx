// app/dashboard/layout.tsx

'use client';

import { useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import SidebarCreator from '@/components/SidebarCreator';
import SidebarEarner from '@/components/SidebarEarner';
import AdminSidebar from '@/components/AdminSidebar';
import type { User } from '@/types';

export default function DashboardLayout({
  creator,
  earner,
  admin,
}: {
  children: React.ReactNode;
  creator: React.ReactNode;
  earner: React.ReactNode;
  admin: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          const userData = userDoc.data();

          if (userData) {
            setUser({
              email: currentUser.email || '',
              uid: currentUser.uid,
              userType: (userData?.userType as 'earner' | 'creator' | 'admin') || 'earner',
            });
          } else {
            // User not in Firestore, redirect to login
            router.push('/login');
          }
        } catch (error) {
          console.error('Error fetching user:', error);
          router.push('/login');
        }
      } else {
        router.push('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]); // ← Keep this dependency

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  const renderSidebar = () => {
    switch (user.userType) {
      case 'creator':
        return <SidebarCreator />;
      case 'earner':
        return <SidebarEarner />;
      case 'admin':
        return <AdminSidebar />;
      default:
        return <SidebarEarner />;
    }
  };

  const renderContent = () => {
    switch (user.userType) {
      case 'creator':
        return creator;
      case 'earner':
        return earner;
      case 'admin':
        return admin;
      default:
        return earner;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed md:relative z-50 h-screen transform transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {renderSidebar()}
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col w-full md:w-auto">
        {/* Top Navbar */}
        <nav className="bg-white text-gray-900 p-3 md:p-4 shadow-lg flex justify-between items-center sticky top-0 z-30">
          <div className="flex items-center gap-3 md:gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden text-2xl font-bold"
            >
              ☰
            </button>
            <h2 className="text-lg md:text-2xl font-bold">
              {user.userType === 'creator' && '🎬 Creator'}
              {user.userType === 'earner' && '💰 Earner'}
              {user.userType === 'admin' && '🔐 Admin'}
            </h2>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <span className="text-xs md:text-sm text-gray-700 hidden sm:inline truncate">
              {user?.email}
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-2 md:px-4 py-2 rounded font-bold text-xs md:text-base transition"
            >
              Logout
            </button>
          </div>
        </nav>

        {/* Main Content Area */}
        <div className="flex-1 overflow-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}