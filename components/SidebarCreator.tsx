'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function SidebarCreator() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen p-6 overflow-y-auto">
      <h1 className="text-2xl font-bold mb-2">YubeEarn</h1>
      <p className="text-xs text-red-300 mb-8">🎬 Creator Mode</p>

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
          <h3 className="text-xs font-bold text-gray-400 uppercase mb-3 px-4">Campaigns</h3>

          <Link
            href="/dashboard/creator/campaigns"
            className={`block px-4 py-3 rounded font-semibold transition text-sm md:text-base ${
              isActive('/dashboard/creator/campaigns') ? 'bg-red-600' : 'hover:bg-gray-800'
            }`}
          >
            🎬 My Campaigns
          </Link>

          <Link
            href="/dashboard/creator/campaigns/create"
            className={`block px-4 py-3 rounded font-semibold transition text-sm md:text-base ${
              isActive('/dashboard/creator/campaigns/create') ? 'bg-red-600' : 'hover:bg-gray-800'
            }`}
          >
            ➕ Create Campaign
          </Link>

          <Link
            href="/dashboard/creator/approvals"
            className={`block px-4 py-3 rounded font-semibold transition text-sm md:text-base ${
              isActive('/dashboard/creator/approvals') ? 'bg-red-600' : 'hover:bg-gray-800'
            }`}
          >
            ✓ Pending Approvals
          </Link>
        </div>

        <div className="border-t border-gray-700 pt-4 mt-4">
          <h3 className="text-xs font-bold text-gray-400 uppercase mb-3 px-4">Account</h3>

          <Link
            href="/dashboard/buy-points"
            className={`block px-4 py-3 rounded font-semibold transition text-sm md:text-base ${
              isActive('/dashboard/buy-points')
                ? 'bg-red-600'
                : 'hover:bg-gray-800'
            }`}
          >
            💳 Fund Account
          </Link>
        </div>
      </nav>
    </aside>
  );
}