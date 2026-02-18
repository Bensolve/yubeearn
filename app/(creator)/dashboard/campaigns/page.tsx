'use client';

import { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { doc, getDoc } from 'firebase/firestore';
import type { User } from '@/types';

export default function CreatorCampaigns() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (!currentUser) {
        router.push('/login');
      } else {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        const userData = userDoc.data();

        setUser({
          email: currentUser.email || '',
          uid: currentUser.uid,
          userType: (userData?.userType as 'earner' | 'creator') || 'earner',
        });

        // Redirect if not a creator
        if (userData?.userType !== 'creator') {
          router.push('/dashboard');
        }
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
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">My Campaigns</h2>
        <Link href="/dashboard/creator/campaigns/create">
          <button className="bg-red-600 text-white px-6 py-2 rounded font-bold hover:bg-red-700 transition">
            ➕ Create Campaign
          </button>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <p className="text-gray-600 text-lg">No campaigns yet</p>
        <p className="text-gray-500 mb-6">Create your first campaign to start getting views</p>
        <Link href="/dashboard/creator/campaigns/create">
          <button className="bg-red-600 text-white px-8 py-3 rounded font-bold hover:bg-red-700 transition">
            🚀 Create First Campaign
          </button>
        </Link>
      </div>
    </div>
  );
}