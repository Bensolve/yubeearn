'use client';

import { useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import type { User } from '@/types';

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        // Get userType from Firestore
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        const userData = userDoc.data();

        setUser({
          email: currentUser.email || '',
          uid: currentUser.uid,
          userType: (userData?.userType as 'earner' | 'creator') || 'earner',
        });
      } else {
        router.push('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return <div className="text-center mt-20 text-2xl">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">Welcome! 👋</h2>
        <p className="text-gray-700 text-xl mb-8">
          You are logged in as <strong>{user?.email}</strong>
        </p>

        <div className="bg-gray-50 rounded-lg p-6">
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
  );
}