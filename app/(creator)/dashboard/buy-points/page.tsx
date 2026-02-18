'use client';

import { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { doc, getDoc } from 'firebase/firestore';
import type { User } from '@/types';

export default function BuyPoints() {
  const [amount, setAmount] = useState('1000');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (!currentUser) {
        router.push('/login');
      } else {
        // Get userType from Firestore
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        const userData = userDoc.data();

        setUser({
          email: currentUser.email || '',
          uid: currentUser.uid,
          userType: (userData?.userType as 'earner' | 'creator') || 'earner',
        });
      }
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    const reference = sessionStorage.getItem('paystack_reference');
    const userId = sessionStorage.getItem('paystack_userId');

    if (reference && userId) {
      verifyPayment(reference, userId);
      sessionStorage.removeItem('paystack_reference');
      sessionStorage.removeItem('paystack_userId');
    }
  }, []);

  const verifyPayment = async (reference: string, userId: string) => {
    try {
      const response = await fetch('/api/paystack/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reference, userId }),
      });

      const data = await response.json();

      if (data.success) {
        alert(`Success! You got ${data.points} points!`);
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      alert('Verification error: ' + error);
    }
  };

  const handlePayment = async () => {
    if (!amount || parseInt(amount) < 100) {
      alert('Minimum amount is ₦100');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/paystack/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user?.email,
          amount: parseInt(amount),
          userId: user?.uid,
        }),
      });

      const data = await response.json();

      if (data.authorizationUrl) {
        sessionStorage.setItem('paystack_reference', data.reference);
        sessionStorage.setItem('paystack_userId', user?.uid || '');
        window.location.href = data.authorizationUrl;
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      alert('Payment error: ' + error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Buy Points</h2>

        <div className="mb-8 bg-blue-50 p-4 md:p-6 rounded-lg border-2 border-blue-400">
          <p className="text-gray-800 text-lg">
            <strong>Exchange Rate:</strong> ₦1 = 1 Point
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-gray-900 font-semibold mb-2 text-sm md:text-base">
              Amount (₦)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-400 rounded text-gray-900 focus:outline-none focus:border-red-600 text-base"
              min="100"
              step="100"
            />
            <p className="text-gray-600 mt-2 text-sm">Minimum: ₦100</p>
          </div>

          <div className="bg-gray-50 p-4 md:p-6 rounded-lg">
            <p className="text-gray-800 text-base md:text-lg">
              <strong>You will get:</strong>{' '}
              <span className="text-red-600 text-xl md:text-2xl font-bold">
                {amount} Points
              </span>
            </p>
          </div>

          <button
            onClick={handlePayment}
            disabled={loading}
            className="w-full bg-red-600 text-white py-3 rounded font-bold hover:bg-red-700 text-base md:text-lg disabled:bg-gray-400 transition"
          >
            {loading ? 'Processing...' : 'Pay with Paystack'}
          </button>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/dashboard"
            className="text-red-600 font-bold hover:underline text-sm md:text-base"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}