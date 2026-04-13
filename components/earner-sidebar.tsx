"use client";

import Link from "next/link";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/app/context/AppContext";
import { EARNER_MENU_ITEMS } from "@/constants/navigation";
import { loadCurrentUser } from "@/lib/storage";
import { logoutAndRedirect } from "@/lib/auth";

export default function EarnerSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, setCurrentUser, logout  , setBalance,        // ← from useAppContext(), not an import
  setTotalEarned,
  setCompletedTasks,
  setEarningsHistory,} = useAppContext();

 useEffect(() => {
  if (!currentUser) {
    const user = loadCurrentUser();
    if (user) {
      setCurrentUser(user);
      setBalance(user.balance || 0);                        // ← add
      setTotalEarned(user.totalEarned || 0);               // ← add
      setCompletedTasks(user.completedTasks || []);        // ← add
      setEarningsHistory(user.earningsHistory || []);      // ← add
    }
  }
  console.log("[Sidebar] currentUser:", currentUser?.email);
}, [currentUser, setBalance, setCompletedTasks, setCurrentUser, setEarningsHistory, setTotalEarned]);


  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-gray-900 text-white p-6 overflow-y-auto">
      <Link href="/" className="text-2xl font-bold text-red-600 mb-8 block">
        YubeEarn
      </Link>

      <nav className="space-y-2 mb-8">
        {EARNER_MENU_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition ${
                isActive
                  ? "bg-red-600 text-white"
                  : "text-gray-300 hover:bg-gray-800"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-gray-700 my-6" />

      <div className="bg-gray-800 rounded-lg p-4 mb-6">
        <p className="text-xs text-gray-400 mb-2">Logged in as</p>
        <p className="text-sm font-bold text-white truncate">
          {currentUser?.email}
        </p>
      </div>

      <Button
        className="w-full text-white bg-red-600 hover:bg-red-700"
        onClick={() => logoutAndRedirect(logout, router.push)}
      >
        Logout
      </Button>
    </div>
  );
}
