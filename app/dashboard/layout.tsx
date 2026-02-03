'use client';

import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import Sidebar from '@/components/Sidebar';
import type { User } from '@/types';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser({
          email: currentUser.email || '',
          uid: currentUser.uid,
        });
      } else {
        router.push('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  if (loading) return <div className="text-center mt-20 text-2xl">Loading...</div>;

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 min-h-screen bg-gray-100">
        <nav className="bg-white p-4 shadow-lg flex justify-between">
          <h2 className="text-2xl font-bold">YubeEarn</h2>
          <div className="flex gap-4">
            <span>{user?.email}</span>
            <button onClick={handleLogout} className="bg-red-600 text-white px-4 py-2 rounded">
              Logout
            </button>
          </div>
        </nav>
        {children}
      </div>
    </div>
  );
}