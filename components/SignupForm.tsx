'use client';

import { useState, useEffect } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { doc, setDoc } from 'firebase/firestore';

interface SignupFormProps {
  initialRole?: 'creator' | 'earner';
}

export default function SignupForm({ initialRole }: SignupFormProps) {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState<'earner' | 'creator' | ''>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Pre-fill role from prop
  useEffect(() => {
    if (initialRole) {
      setUserType(initialRole);
    }
  }, [initialRole]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userType) {
      setError('Please select if you are an Earner or Creator');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      await setDoc(doc(db, 'users', uid), {
        email,
        userType,
        balance: 0,
        tasksCompleted: 0,
        createdAt: new Date(),
      });

      router.push('/dashboard');
    } catch (err) {
      const error = err as Error;
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="bg-white border-2 border-gray-200 rounded-lg shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-red-600 mb-2">YubeEarn</h1>
          <p className="text-gray-800 text-lg font-semibold">Create Account</p>
          {userType && (
            <p className="text-gray-600 text-sm mt-2">
              {userType === 'earner' ? '💰 Earner Mode' : '🎬 Creator Mode'}
            </p>
          )}
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          {/* Only show role selection if NOT pre-filled from URL */}
          {!initialRole && (
            <div>
              <label className="block text-gray-900 font-semibold mb-3">I am a...</label>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setUserType('earner')}
                  className={`w-full p-4 rounded-lg border-2 font-bold transition text-left ${
                    userType === 'earner'
                      ? 'border-red-600 bg-red-50 text-red-600'
                      : 'border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  💰 Earner - Watch videos & earn money
                </button>
                <button
                  type="button"
                  onClick={() => setUserType('creator')}
                  className={`w-full p-4 rounded-lg border-2 font-bold transition text-left ${
                    userType === 'creator'
                      ? 'border-red-600 bg-red-50 text-red-600'
                      : 'border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  🎬 Creator - Create tasks & pay users
                </button>
              </div>
            </div>
          )}

          <div>
            <label className="block text-gray-900 font-semibold mb-2">Email</label>
            <input
              type="email"
              placeholder="test@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-400 rounded text-gray-900 placeholder-gray-500 focus:outline-none focus:border-red-600"
              required
            />
          </div>

          <div>
            <label className="block text-gray-900 font-semibold mb-2">Password</label>
            <input
              type="password"
              placeholder="password123"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-400 rounded text-gray-900 placeholder-gray-500 focus:outline-none focus:border-red-600"
              required
            />
          </div>

          {error && (
            <div className="bg-red-100 border-l-4 border-red-600 text-red-800 p-3 rounded">
              <p className="font-bold text-red-900">Error:</p>
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 text-white py-2 rounded font-bold hover:bg-red-700 disabled:bg-gray-400 text-lg"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-800">Already have account?</p>
          <Link href="/(public)/login" className="text-red-600 font-bold hover:underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}