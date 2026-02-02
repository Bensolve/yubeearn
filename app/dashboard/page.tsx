'use client';

import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { User } from '@/types';

export default function Dashboard() {
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

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen text-gray-900 text-2xl">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-red-600 text-white p-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold">▶️ YubeEarn</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-100">{user?.email}</span>
            <button
              onClick={handleLogout}
              className="bg-red-700 hover:bg-red-800 px-4 py-2 rounded font-bold"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Rest of the code stays the same */}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Welcome! 👋</h2>
          <p className="text-gray-700 text-xl mb-8">
            You are logged in as <strong>{user?.email}</strong>
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* User Section */}
            <Link href="/user/tasks">
              <div className="bg-blue-50 border-2 border-blue-400 rounded-lg p-8 cursor-pointer hover:shadow-lg transition">
                <h3 className="text-2xl font-bold text-blue-600 mb-2">👤 User Mode</h3>
                <p className="text-gray-700">Watch videos and earn points</p>
              </div>
            </Link>

            {/* Creator Section */}
            <Link href="/creator/dashboard">
              <div className="bg-green-50 border-2 border-green-400 rounded-lg p-8 cursor-pointer hover:shadow-lg transition">
                <h3 className="text-2xl font-bold text-green-600 mb-2">🎬 Creator Mode</h3>
                <p className="text-gray-700">Create tasks and manage points</p>
              </div>
            </Link>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 text-left">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Stats</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded border-l-4 border-blue-400">
                <p className="text-gray-600 text-sm">Available Points</p>
                <p className="text-3xl font-bold text-blue-600">0</p>
              </div>
              <div className="bg-white p-4 rounded border-l-4 border-green-400">
                <p className="text-gray-600 text-sm">Tasks Completed</p>
                <p className="text-3xl font-bold text-green-600">0</p>
              </div>
              <div className="bg-white p-4 rounded border-l-4 border-red-400">
                <p className="text-gray-600 text-sm">Total Earned</p>
                <p className="text-3xl font-bold text-red-600">₦0</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}