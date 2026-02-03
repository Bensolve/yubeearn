'use client';

import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { User } from '@/types';

export default function BuyPoints() {
  const [amount, setAmount] = useState('1000');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (!currentUser) {
        router.push('/login');
      } else {
        setUser({
          email: currentUser.email || '',
          uid: currentUser.uid,
        });
      }
    });

    return () => unsubscribe();
  }, [router]);

  // Check for payment verification when user returns
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
        // Store reference to verify later
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
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Buy Points</h2>

        <div className="mb-8 bg-blue-50 p-6 rounded-lg border-2 border-blue-400">
          <p className="text-gray-800 text-lg">
            <strong>Exchange Rate:</strong> ₦1 = 1 Point
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-gray-900 font-semibold mb-2">
              Amount (₦)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-400 rounded text-gray-900 focus:outline-none focus:border-red-600"
              min="100"
              step="100"
            />
            <p className="text-gray-600 mt-2">Minimum: ₦100</p>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <p className="text-gray-800 text-lg">
              <strong>You will get:</strong>{' '}
              <span className="text-red-600 text-2xl font-bold">
                {amount} Points
              </span>
            </p>
          </div>

          <button
            onClick={handlePayment}
            disabled={loading}
            className="w-full bg-red-600 text-white py-3 rounded font-bold hover:bg-red-700 text-lg disabled:bg-gray-400"
          >
            {loading ? 'Processing...' : 'Pay with Paystack'}
          </button>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/dashboard"
            className="text-red-600 font-bold hover:underline"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}