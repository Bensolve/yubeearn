'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-8">▶️ YubeEarn</h1>

      <nav className="space-y-4">
        <Link
          href="/dashboard"
          className={`block px-4 py-3 rounded font-semibold transition ${
            isActive('/dashboard')
              ? 'bg-red-600'
              : 'hover:bg-gray-800'
          }`}
        >
          📊 Dashboard
        </Link>

        <Link
          href="/dashboard/buy-points"
          className={`block px-4 py-3 rounded font-semibold transition ${
            isActive('/dashboard/buy-points')
              ? 'bg-red-600'
              : 'hover:bg-gray-800'
          }`}
        >
          💰 Buy Points
        </Link>

        <Link
          href="/dashboard/tasks"
          className={`block px-4 py-3 rounded font-semibold transition ${
            isActive('/dashboard/tasks') ? 'bg-red-600' : 'hover:bg-gray-800'
          }`}
        >
          🎥 Watch Videos
        </Link>

        <Link
          href="/dashboard/creator"
          className={`block px-4 py-3 rounded font-semibold transition ${
            isActive('/dashboard/creator') ? 'bg-red-600' : 'hover:bg-gray-800'
          }`}
        >
          🎬 Creator Mode
        </Link>
      </nav>
    </aside>
  );
}