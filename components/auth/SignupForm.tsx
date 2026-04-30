"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { validateSignupInputs } from "@/lib/validation";
import { signUpAction } from "@/lib/auth";
import type { UserRole } from "@/types";

interface SignupFormProps {
  role: UserRole;
}

export default function SignupForm({ role }: SignupFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const validationError = validateSignupInputs(
      email,
      password,
      confirmPassword,
    );
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      await signUpAction(email, password, role); // ← no const user
      console.log(`[Signup] ${role} created:`, email);

      router.push(
        role === "creator" ? "/dashboard/creator" : "/dashboard/earner",
      );
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Signup failed";
      if (message.includes("email-already-in-use")) {
        setError("Email already exists");
      } else {
        setError(message);
      }
      console.error("[Signup] Error:", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6 py-12">
      <Card className="w-full max-w-md  bg-card border-border p-8 md:p-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">Y</span>
            </div>
            <h1 className="text-3xl font-bold text-primary">YubeEarn</h1>
          </div>

          <p className="text-muted-foreground">
            Sign up as{" "}
            <span
              className={
                role === "creator" ? "text-blue-600" : "text-green-600"
              }
            >
              {role}
            </span>{" "}
            to continue
          </p>
        </div>

        {/* form */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Email field */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-foreground">
              Email Address
            </label>
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
            <label className="block text-sm font-bold text-foreground">
              Password
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="h-10 border-border bg-background text-foreground placeholder:text-muted-foreground focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-foreground">
              {" "}
              Confirm Password
            </label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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

          <Button
            type="submit"
            className="w-full h-11 text-base bg-primary hover:bg-primary/90 text-white font-bold"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </Button>
        </form>

        <div className="mt-8 space-y-3 text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-primary font-bold hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}
