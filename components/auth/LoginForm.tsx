'use client';

import { loginAction } from '@/lib/auth';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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
    <div className="min-h-screen flex items-center justify-center bg-background px-6 py-12">
      <Card className="w-full max-w-md bg-card border-border p-8 md:p-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">Y</span>
            </div>
            <h1 className="text-3xl font-bold text-primary">YubeEarn</h1>
          </div>
          <p className="text-muted-foreground">Welcome back! Login to continue</p>
        </div>

        {/* Form */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Email Field */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-foreground">Email Address</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="h-10 border-border bg-background text-foreground placeholder:text-muted-foreground focus:ring-primary"
            />
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-foreground">Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="h-10 border-border bg-background text-foreground placeholder:text-muted-foreground focus:ring-primary"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border-l-4 border-red-600 text-red-800 p-4 rounded">
              <p className="font-bold text-sm">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full h-11 text-base bg-primary hover:bg-primary/90 text-white font-bold"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>

        {/* Footer Links */}
        <div className="mt-8 space-y-3 text-center">
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link 
              href="/signup?role=earner" 
              className="text-primary font-bold hover:underline"
            >
              Sign Up
            </Link>
          </p>
          <Link 
            href="#" 
            className="block text-sm text-muted-foreground hover:text-primary transition"
          >
            Forgot password?
          </Link>
        </div>
      </Card>
    </div>
  );
}