import { getLoggedInUserAction } from '@/lib/auth';
import { redirect } from 'next/navigation';
import WithdrawForm from '@/components/withdraw-form';

export default async function WithdrawPage() {
  const user = await getLoggedInUserAction();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Withdraw Earnings</h1>
          <p className="text-gray-600">Transfer money to your bank or mobile money</p>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg shadow p-8 mb-8 border-l-4 border-green-600">
          <p className="text-gray-600 mb-2">Available Balance</p>
          <p className="text-5xl font-bold text-green-600">GHS {user.balance}</p>
        </div>

        <WithdrawForm user={user} />
      </div>
    </div>
  );
}