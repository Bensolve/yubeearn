'use client';

import { loginAction } from '@/lib/auth';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import Link from 'next/link';


export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Call Server Action (secure, server-side)
    const result = await loginAction(email, password);

    if (result.success) {
      router.push(
        result.user?.role === 'creator'
          ? '/dashboard/creator'
          : '/dashboard/earner'
      );
    } else {
      setError(result.error || 'Login failed');
    }

    setLoading(false);
  };



  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-red-600 mb-2">YubeEarn</h1>
          <p className="text-gray-600">Login to your account</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
            />
          </div>

          {error && (
            <div className="bg-red-100 border-l-4 border-red-600 text-red-800 p-3 rounded">
              <p className="font-bold">Error:</p>
              <p className="text-sm">{error}</p>
            </div>
          )}

          <Button type="submit" className="w-full text-lg py-6" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>

        <div className="mt-6 text-center space-y-2">
          <p className="text-gray-600">
            Don&apos;t have an account?{" "}
            <Link href="/signup?role=earner" className="text-red-600 font-bold hover:underline">
              Sign Up
            </Link>
          </p>
          <Link href="#" className="text-sm text-gray-600 hover:underline block">
            Forgot password?
          </Link>
        </div>
      </div>
    </div>
  );
}