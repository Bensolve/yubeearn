'use client';

import { loginAction } from '@/lib/auth';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { AlertCircle, Eye, EyeOff, Mail, Lock, LogIn } from 'lucide-react';

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

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
          {/* Logo */}
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
            <label className="block text-sm font-bold text-foreground flex items-center gap-2">
              <Mail className="w-4 h-4 text-muted-foreground" />
              Email Address
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="h-10 border-border bg-background text-foreground placeholder:text-muted-foreground focus:ring-primary"
              disabled={loading}
              required
            />
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-foreground flex items-center gap-2">
              <Lock className="w-4 h-4 text-muted-foreground" />
              Password
            </label>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="h-10 border-border bg-background text-foreground placeholder:text-muted-foreground focus:ring-primary pr-10"
                disabled={loading}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
                disabled={loading}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Error Message - WARNING COLOR (Red) */}
          {error && (
            <div className="bg-red-100 dark:bg-red-900/30 border-l-4 border-red-600 text-red-800 dark:text-red-200 p-4 rounded">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-sm">Login Error</p>
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button - PRIMARY COLOR */}
          <Button
            type="submit"
            className="w-full h-11 text-base bg-primary hover:bg-primary/90 text-white font-bold transition"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="inline-block animate-spin mr-2">⚙️</span>
                Logging in...
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4 mr-2" />
                Login
              </>
            )}
          </Button>
        </form>

        {/* Footer Links */}
        <div className="mt-8 space-y-3 text-center">
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link
              href="/signup?role=earner"
              className="text-primary font-bold hover:underline transition"
            >
              Sign Up as Earner
            </Link>
          </p>
          <div className="pt-3 border-t border-border">
            <Link
              href="#"
              className="text-sm text-muted-foreground hover:text-primary transition font-medium"
            >
              Forgot password?
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}