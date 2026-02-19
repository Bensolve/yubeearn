// app/dashboard/@creator/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { doc, getDoc } from 'firebase/firestore';
import type { User } from '@/types';

export default function CreatorDashboard() {
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
          userType: (userData?.userType as 'earner' | 'creator') || 'earner',
        });

        // Verify user is creator
        if (userData?.userType !== 'creator') {
          router.push('/dashboard');  // Redirect if not creator
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
        <h2 className="text-4xl font-bold text-gray-900 mb-2">Welcome back! 👋</h2>
        <p className="text-gray-600 text-lg">
          You&apos;re logged in as <strong>{user?.email}</strong>
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-400">
          <p className="text-gray-600 text-sm mb-2">Active Campaigns</p>
          <p className="text-4xl font-bold text-blue-600">0</p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-400">
          <p className="text-gray-600 text-sm mb-2">Total Watch Hours</p>
          <p className="text-4xl font-bold text-green-600">0</p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-red-400">
          <p className="text-gray-600 text-sm mb-2">Account Balance</p>
          <p className="text-4xl font-bold text-red-600">GHS 0.00</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Create Campaign CTA */}
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg shadow-lg p-8 border-2 border-red-300">
          <div className="text-5xl mb-4">🚀</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Create Campaign</h3>
          <p className="text-gray-700 mb-6">
            Get real Ghanaian viewers for your YouTube videos and reach 4,000 watch hours faster.
          </p>
          <Link href="/(creator)/dashboard/campaigns/create">
            <button className="bg-red-600 text-white px-6 py-3 rounded font-bold hover:bg-red-700 transition">
              ➕ Create New Campaign
            </button>
          </Link>
        </div>

        {/* View Campaigns CTA */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-lg p-8 border-2 border-blue-300">
          <div className="text-5xl mb-4">📊</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">My Campaigns</h3>
          <p className="text-gray-700 mb-6">
            View your active campaigns, track progress, and see real-time watch hour updates.
          </p>
          <Link href="/(creator)/dashboard/campaigns">
            <button className="bg-blue-600 text-white px-6 py-3 rounded font-bold hover:bg-blue-700 transition">
              📈 View Campaigns
            </button>
          </Link>
        </div>

        {/* Pending Approvals CTA */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg shadow-lg p-8 border-2 border-purple-300">
          <div className="text-5xl mb-4">✓</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Pending Approvals</h3>
          <p className="text-gray-700 mb-6">
            Review and approve task completions from viewers who watched your videos.
          </p>
          <Link href="/(creator)/dashboard/campaigns/approvals">
            <button className="bg-purple-600 text-white px-6 py-3 rounded font-bold hover:bg-purple-700 transition">
              🔍 Review Approvals
            </button>
          </Link>
        </div>

        {/* Fund Account CTA */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow-lg p-8 border-2 border-green-300">
          <div className="text-5xl mb-4">💳</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Fund Account</h3>
          <p className="text-gray-700 mb-6">
            Add funds to your account to create campaigns and get viewers.
          </p>
          <Link href="/(creator)/dashboard/buy-points">
            <button className="bg-green-600 text-white px-6 py-3 rounded font-bold hover:bg-green-700 transition">
              💰 Add Funds
            </button>
          </Link>
        </div>
      </div>

      {/* Info Section */}
      <div className="bg-blue-50 border-l-4 border-blue-600 rounded-lg p-6 mt-8">
        <h3 className="text-lg font-bold text-gray-900 mb-2">How It Works</h3>
        <ol className="text-gray-700 space-y-2">
          <li className="flex items-start gap-3">
            <span className="font-bold text-blue-600">1.</span>
            <span>Create a campaign with your YouTube video</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="font-bold text-blue-600">2.</span>
            <span>Pay GHS 29+ to activate the campaign</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="font-bold text-blue-600">3.</span>
            <span>Real Ghanaian viewers watch your videos</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="font-bold text-blue-600">4.</span>
            <span>Track watch hours increase in real-time</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="font-bold text-blue-600">5.</span>
            <span>Hit 4,000 hours and get monetized!</span>
          </li>
        </ol>
      </div>
    </div>
  );
}