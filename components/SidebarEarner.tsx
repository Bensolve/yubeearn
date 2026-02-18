'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function SidebarEarner() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen p-6 overflow-y-auto">
      <h1 className="text-2xl font-bold mb-2">YubeEarn</h1>
      <p className="text-xs text-blue-300 mb-8">💰 Earner Mode</p>

      <nav className="space-y-4">
        <Link
          href="/dashboard"
          className={`block px-4 py-3 rounded font-semibold transition text-sm md:text-base ${
            isActive('/dashboard')
              ? 'bg-red-600'
              : 'hover:bg-gray-800'
          }`}
        >
          📊 Dashboard
        </Link>

        <div className="border-t border-gray-700 pt-4 mt-4">
          <h3 className="text-xs font-bold text-gray-400 uppercase mb-3 px-4">Tasks & Earnings</h3>

          <Link
            href="/dashboard/tasks"
            className={`block px-4 py-3 rounded font-semibold transition text-sm md:text-base ${
              isActive('/dashboard/tasks') ? 'bg-red-600' : 'hover:bg-gray-800'
            }`}
          >
            🎥 Available Tasks
          </Link>

          <Link
            href="/dashboard/earnings"
            className={`block px-4 py-3 rounded font-semibold transition text-sm md:text-base ${
              isActive('/dashboard/earnings') ? 'bg-red-600' : 'hover:bg-gray-800'
            }`}
          >
            💰 My Earnings
          </Link>

          <Link
            href="/dashboard/withdraw"
            className={`block px-4 py-3 rounded font-semibold transition text-sm md:text-base ${
              isActive('/dashboard/withdraw') ? 'bg-red-600' : 'hover:bg-gray-800'
            }`}
          >
            🏦 Withdraw Money
          </Link>
        </div>

        <div className="border-t border-gray-700 pt-4 mt-4">
          <h3 className="text-xs font-bold text-gray-400 uppercase mb-3 px-4">Account</h3>

         
        </div>
      </nav>
    </aside>
  );
}