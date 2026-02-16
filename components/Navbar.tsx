'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { NavbarProps } from '@/types';

export default function Navbar({
  logo = '🇬🇭 YubeEarn Ghana',
  loginHref = '/login',
  signupHref = '/signup',
}: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-red-600 text-white p-4 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/">
          <h1 className="text-2xl md:text-3xl font-bold cursor-pointer hover:opacity-90 transition">
            {logo}
          </h1>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-4">
          <Link href={loginHref}>
            <button className="bg-white text-red-600 px-4 py-2 rounded font-bold hover:bg-gray-100 transition">
              Login
            </button>
          </Link>
          <Link href={signupHref}>
            <button className="bg-transparent border-2 border-white text-white px-4 py-2 rounded font-bold hover:bg-white hover:text-red-600 transition">
              Join Now
            </button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-2xl font-bold"
        >
          {isOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden mt-4 space-y-3 border-t border-red-500 pt-4">
          <Link href={loginHref} onClick={() => setIsOpen(false)}>
            <button className="w-full bg-white text-red-600 px-4 py-2 rounded font-bold hover:bg-gray-100 transition">
              Login
            </button>
          </Link>
          <Link href={signupHref} onClick={() => setIsOpen(false)}>
            <button className="w-full bg-transparent border-2 border-white text-white px-4 py-2 rounded font-bold hover:bg-white hover:text-red-600 transition">
              Join Now
            </button>
          </Link>
        </div>
      )}
    </nav>
  );
}