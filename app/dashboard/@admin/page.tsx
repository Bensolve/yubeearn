// app/dashboard/@admin/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import type { User } from '@/types';

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        const userData = userDoc.data();

        setUser({
          email: currentUser.email || '',
          uid: currentUser.uid,
          userType: (userData?.userType as 'earner' | 'creator' | 'admin') || 'earner',
        });

        // Verify user is admin
        if (userData?.userType !== 'admin') {
          router.push('/dashboard');  // Redirect if not admin
        }
      } else {
        router.push('/(public)/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return <div className="text-center mt-20 text-2xl">Loading...</div>;
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <h2 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard 🔐</h2>
        <p className="text-gray-600 text-lg">
          Welcome, <strong>{user?.email}</strong>
        </p>
      </div>

      {/* Admin Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-600">
          <p className="text-gray-600 text-sm mb-2">Total Users</p>
          <p className="text-4xl font-bold text-blue-600">0</p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-600">
          <p className="text-gray-600 text-sm mb-2">Active Creators</p>
          <p className="text-4xl font-bold text-green-600">0</p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-purple-600">
          <p className="text-gray-600 text-sm mb-2">Active Earners</p>
          <p className="text-4xl font-bold text-purple-600">0</p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-orange-600">
          <p className="text-gray-600 text-sm mb-2">Total Revenue</p>
          <p className="text-4xl font-bold text-orange-600">GHS 0.00</p>
        </div>
      </div>

      {/* Admin Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-lg p-8 border-2 border-blue-300">
          <div className="text-5xl mb-4">👥</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Manage Users</h3>
          <p className="text-gray-700 mb-6">View and manage all platform users.</p>
          <button className="bg-blue-600 text-white px-6 py-3 rounded font-bold hover:bg-blue-700 transition w-full">
            👥 View Users
          </button>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg shadow-lg p-8 border-2 border-purple-300">
          <div className="text-5xl mb-4">📊</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Reports</h3>
          <p className="text-gray-700 mb-6">View detailed platform reports and analytics.</p>
          <button className="bg-purple-600 text-white px-6 py-3 rounded font-bold hover:bg-purple-700 transition w-full">
            📊 View Reports
          </button>
        </div>
      </div>
    </div>
  );
}