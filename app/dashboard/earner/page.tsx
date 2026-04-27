import {  getLoggedInUserAction } from '@/lib/auth';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatAmount } from "@/lib/utils";

export default async function EarnerDashboard() {
  const currentUser = await getLoggedInUserAction();

  if (!currentUser) {
    return <div className="p-8">Not logged in  a guest user</div>;
  }

  const balance = currentUser.balance || 0;
  const totalEarned = currentUser.totalEarned || 0;
  const completedTasks = currentUser.completedTasks || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-8">

        <div className="bg-white rounded-lg shadow p-8 mb-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">Welcome back! 👋</h2>
          <p className="text-gray-600">Start earning money by completing tasks</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-600">
            <p className="text-gray-600 text-sm mb-2">Available Balance</p>
            <p className="text-4xl font-bold text-green-600">GHS {formatAmount(balance)}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-600">
            <p className="text-gray-600 text-sm mb-2">Tasks Completed</p>
            <p className="text-4xl font-bold text-blue-600">{completedTasks.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-600">
            <p className="text-gray-600 text-sm mb-2">Total Earned</p>
            <p className="text-4xl font-bold text-purple-600">GHS {formatAmount(totalEarned)}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Link href="/dashboard/earner/tasks">
            <div className="bg-white rounded-lg shadow p-8 hover:shadow-lg transition cursor-pointer">
              <div className="text-5xl mb-4">📋</div>
              <h3 className="text-2xl font-bold mb-3">Browse Tasks</h3>
              <p className="text-gray-600 mb-6">Find video tasks and earn GHS 85 per completion</p>
              <Button className="w-full">View Available Tasks</Button>
            </div>
          </Link>

          <Link href="/dashboard/earner/withdraw">
            <div className="bg-white rounded-lg shadow p-8 hover:shadow-lg transition cursor-pointer">
              <div className="text-5xl mb-4">🏦</div>
              <h3 className="text-2xl font-bold mb-3">Withdraw Earnings</h3>
              <p className="text-gray-600 mb-6">Transfer your money to bank or mobile money</p>
              <Button className="w-full" variant="outline">Withdraw Now</Button>
            </div>
          </Link>
        </div>

      </div>
    </div>
  );
}