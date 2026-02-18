'use client';

import { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { doc, getDoc } from 'firebase/firestore';
import type { User } from '@/types';

export default function EarnerDashboard() {
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
        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-400">
          <p className="text-gray-600 text-sm mb-2">Total Earnings</p>
          <p className="text-4xl font-bold text-green-600">GHS 0.00</p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-400">
          <p className="text-gray-600 text-sm mb-2">Tasks Completed</p>
          <p className="text-4xl font-bold text-blue-600">0</p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-purple-400">
          <p className="text-gray-600 text-sm mb-2">Available Tasks</p>
          <p className="text-4xl font-bold text-purple-600">0</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Browse Tasks CTA */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-lg p-8 border-2 border-blue-300">
          <div className="text-5xl mb-4">📋</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Browse Tasks</h3>
          <p className="text-gray-700 mb-6">
            Explore available tasks, earn money by watching videos and completing simple assignments.
          </p>
          <Link href="/(earner)/dashboard/tasks">
            <button className="bg-blue-600 text-white px-6 py-3 rounded font-bold hover:bg-blue-700 transition">
              📋 View Available Tasks
            </button>
          </Link>
        </div>

        {/* My Tasks CTA */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow-lg p-8 border-2 border-green-300">
          <div className="text-5xl mb-4">✅</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">My Tasks</h3>
          <p className="text-gray-700 mb-6">
            Track your in-progress tasks, completed tasks, and pending payouts.
          </p>
          <Link href="/(earner)/dashboard/my-tasks">
            <button className="bg-green-600 text-white px-6 py-3 rounded font-bold hover:bg-green-700 transition">
              ✓ View My Tasks
            </button>
          </Link>
        </div>

        {/* Earnings CTA */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg shadow-lg p-8 border-2 border-purple-300">
          <div className="text-5xl mb-4">💰</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Earnings</h3>
          <p className="text-gray-700 mb-6">
            View your total earnings, bonuses, and track your income over time.
          </p>
          <Link href="/(earner)/dashboard/earnings">
            <button className="bg-purple-600 text-white px-6 py-3 rounded font-bold hover:bg-purple-700 transition">
              💳 View Earnings
            </button>
          </Link>
        </div>

        {/* Withdraw CTA */}
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg shadow-lg p-8 border-2 border-orange-300">
          <div className="text-5xl mb-4">🏦</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Withdraw</h3>
          <p className="text-gray-700 mb-6">
            Withdraw your earnings to your bank account or mobile money.
          </p>
          <Link href="/(earner)/dashboard/withdraw">
            <button className="bg-orange-600 text-white px-6 py-3 rounded font-bold hover:bg-orange-700 transition">
              🚀 Withdraw Now
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
            <span>Browse available tasks on the platform</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="font-bold text-blue-600">2.</span>
            <span>Complete tasks (watch videos, click links, fill surveys)</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="font-bold text-blue-600">3.</span>
            <span>Earn money for each completed task</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="font-bold text-blue-600">4.</span>
            <span>Track your earnings in real-time</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="font-bold text-blue-600">5.</span>
            <span>Withdraw your earnings anytime to your bank account</span>
          </li>
        </ol>
      </div>
    </div>
  );
}