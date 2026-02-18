'use client';

import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
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
          <p className="text-gray-800 text-lg font-semibold">Login</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-4">
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
            {loading ? 'Loading...' : 'Login'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-800">Dont have account?</p>
          <Link href="/signup" className="text-red-600 font-bold hover:underline">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}