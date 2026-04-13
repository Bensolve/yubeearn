"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/app/context/AppContext";
import { validateSignupInputs } from "@/lib/validation";
import { checkEmailExists, saveNewUser } from "@/lib/storage";
import { generateId } from "@/lib/utils";
import type { User } from "@/types";

export default function SignupPage() {
  const router = useRouter();
  const { setCurrentUser } = useAppContext();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const validationError = validateSignupInputs(email, password, confirmPassword);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    setTimeout(() => {
      if (checkEmailExists(email)) {
        setError("Email already exists");
        setLoading(false);
        return;
      }

      const newUser: User = {
        id: generateId(),
        email,
        password,
        role: "earner",
        balance: 0,
        createdAt: new Date(),
      };

      saveNewUser(newUser);
      setCurrentUser(newUser);

      console.log("[Signup] User created:", email);
      router.push("/login");
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-red-600 mb-2">YubeEarn</h1>
          <p className="text-gray-600">Sign up as earner</p>
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

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
            {loading ? "Creating Account..." : "Create Account"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="text-red-600 font-bold hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}