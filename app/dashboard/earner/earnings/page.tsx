import {  getLoggedInUserAction } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatAmount, formatDate } from "@/lib/utils";

export default async function EarningsPage() {
  const user = await getLoggedInUserAction();

  if (!user) {
    return <div className="p-8">Not logged in</div>;
  }

  const earningsHistory = user.earningsHistory || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Earnings History
          </h1>
          <p className="text-gray-600">
            Track all your completed tasks and earnings
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-600">
            <p className="text-gray-600 text-sm mb-2">Total Earned</p>
            <p className="text-4xl font-bold text-green-600">
              GHS {formatAmount(user.totalEarned || 0)}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              {earningsHistory.length} tasks completed
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-600">
            <p className="text-gray-600 text-sm mb-2">All Time</p>
            <p className="text-4xl font-bold text-blue-600">
              GHS {formatAmount(user.totalEarned || 0)}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              {earningsHistory.length} tasks
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-600">
            <p className="text-gray-600 text-sm mb-2">Available Balance</p>
            <p className="text-4xl font-bold text-purple-600">
              GHS {formatAmount(user.balance || 0)}
            </p>
            <p className="text-xs text-gray-500 mt-2">Ready to withdraw</p>
          </div>
        </div>

        {earningsHistory.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600 text-lg mb-4">No earnings yet</p>
            <p className="text-gray-500 mb-6">
              Complete tasks to start earning money!
            </p>
            <Link href="/dashboard/earner/tasks">
              <Button>Browse Tasks</Button>
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-4 text-left font-bold text-gray-900">
                    Task
                  </th>
                  <th className="px-6 py-4 text-left font-bold text-gray-900">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left font-bold text-gray-900">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left font-bold text-gray-900">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {earningsHistory.map((earning) => (
                  <tr key={earning.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-900 font-medium">
                      {earning.taskTitle}
                    </td>
                    <td className="px-6 py-4 text-green-600 font-bold">
                      GHS {formatAmount(earning.amount)}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {formatDate(earning.date)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold">
                        ✓ {earning.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-8 flex gap-4">
          <Link href="/dashboard/earner/tasks">
            <Button>Browse More Tasks</Button>
          </Link>
          <Link href="/dashboard/earner/withdraw">
            <Button variant="outline">Withdraw Earnings</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
