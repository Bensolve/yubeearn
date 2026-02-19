// components/AdminSidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminSidebar() {
  const pathname = usePathname();

  const menuItems = [
    { icon: '📊', label: 'Dashboard', href: '/dashboard' },
    { icon: '👥', label: 'Users', href: '/admin/users' },
    { icon: '🎬', label: 'Creators', href: '/admin/creators' },
    { icon: '💰', label: 'Earners', href: '/admin/earners' },
    { icon: '📑', label: 'Reports', href: '/admin/reports' },
    { icon: '🛡️', label: 'Moderation', href: '/admin/moderation' },
    { icon: '⚙️', label: 'Settings', href: '/admin/settings' },
  ];

  return (
    <aside className="w-64 bg-gradient-to-b from-gray-800 to-gray-900 text-white shadow-lg">
      {/* Logo */}
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-2xl font-bold">🔐 Admin</h1>
        <p className="text-gray-400 text-sm mt-1">Platform Control</p>
      </div>

      {/* Navigation */}
      <nav className="mt-8 px-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition duration-200 ${
                    isActive
                      ? 'bg-white text-gray-800 font-semibold'
                      : 'text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Help Section */}
      <div className="absolute bottom-0 left-0 right-0 bg-gray-700 p-4 border-t border-gray-600">
        <p className="text-gray-300 text-sm mb-3">Need help?</p>
        <Link
          href="/support"
          className="block w-full text-center bg-white text-gray-800 font-semibold py-2 rounded-lg hover:bg-gray-100 transition"
        >
          Contact Support
        </Link>
      </div>
    </aside>
  );
}