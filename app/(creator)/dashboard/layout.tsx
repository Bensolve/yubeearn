'use client';

import { useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import SidebarCreator from '@/components/SidebarCreator';
import type { User } from '@/types';

export default function CreatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (!currentUser) {
        router.push('/(public)/login');
        setLoading(false);
        return;
      }

      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      const userData = userDoc.data();

      if (userData?.userType !== 'creator') {
        router.push('/dashboard');
        setLoading(false);
        return;
      }

      setUser({
        email: currentUser.email || '',
        uid: currentUser.uid,
        userType: 'creator',
      });
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/(public)/login');
  };

  if (loading) return <div className="text-center mt-20 text-2xl">Loading...</div>;

  if (!user) return null;

  return (
    <div className="flex h-screen bg-gray-100">
      <div
        className={`fixed md:relative z-50 h-screen transform transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <SidebarCreator />
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col w-full md:w-auto">
        <nav className="bg-white text-gray-900 p-3 md:p-4 shadow-lg flex justify-between items-center sticky top-0 z-30">
          <div className="flex items-center gap-3 md:gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden text-2xl font-bold"
            >
              ☰
            </button>
            <h2 className="text-lg md:text-2xl font-bold">🎬 Creator</h2>
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

        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    </div>
  );
}