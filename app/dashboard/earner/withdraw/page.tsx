'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useState } from 'react';
import { useAppContext } from '@/app/context/AppContext';

import { validateWithdrawAmount, validateWithdrawMethod } from '@/lib/validation';
import { formatAmount } from '@/lib/utils';
import { loadPaymentDetails } from '@/lib/storage';





export default function WithdrawPage() {
 const { balance, withdraw, notification, showNotification, currentUser } = useAppContext();

// ← load saved details once on mount, not in useEffect
const savedDetails = currentUser ? loadPaymentDetails(currentUser.id) : null;

const [amount, setAmount] = useState('');
const [method, setMethod] = useState<'bank' | 'momo'>(savedDetails?.paymentMethod || 'bank');
const [bankAccount, setBankAccount] = useState(savedDetails?.accountNumber || '');
const [bankName, setBankName] = useState(savedDetails?.bankName || '');
const [phone, setPhone] = useState(savedDetails?.phoneNumber || '');
const [loading, setLoading] = useState(false);





  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();

    const withdrawAmount = parseFloat(amount);

    const amountError = validateWithdrawAmount(withdrawAmount, balance);
    if (amountError) {
      showNotification(amountError, 'error');
      return;
    }

    const methodError = validateWithdrawMethod(method, bankAccount, bankName, phone);
    if (methodError) {
      showNotification(methodError, 'error');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      withdraw(withdrawAmount);
      setAmount('');
      setBankAccount('');
      setBankName('');
      setPhone('');
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-8">

        {notification && (
          <div className={`fixed top-4 right-4 p-4 rounded-lg border-l-4 ${
            notification.type === 'success'
              ? 'bg-green-100 border-green-600 text-green-800'
              : notification.type === 'error'
              ? 'bg-red-100 border-red-600 text-red-800'
              : 'bg-blue-100 border-blue-600 text-blue-800'
          }`}>
            <p className="font-bold">{notification.message}</p>
          </div>
        )}

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Withdraw Earnings</h1>
          <p className="text-gray-600">Transfer money to your bank or mobile money</p>
        </div>

        <div className="bg-linear-to-r from-green-50 to-green-100 rounded-lg shadow p-8 mb-8 border-l-4 border-green-600">
          <p className="text-gray-600 mb-2">Available Balance</p>
          <p className="text-5xl font-bold text-green-600">GHS {formatAmount(balance)}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-8 max-w-2xl">
          <form className="space-y-6" onSubmit={handleWithdraw}>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Amount to Withdraw (GHS)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="100"
                min="10"
                max="50000"
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
              />
              <p className="text-xs text-gray-500 mt-2">Min: GHS 10 | Max: GHS 50,000</p>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">Withdrawal Method</label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setMethod('bank')}
                  className={`flex-1 p-4 rounded-lg border-2 font-bold transition ${
                    method === 'bank'
                      ? 'border-red-600 bg-red-50 text-red-600'
                      : 'border-gray-300 text-gray-700'
                  }`}
                >
                  🏦 Bank Account
                </button>
                <button
                  type="button"
                  onClick={() => setMethod('momo')}
                  className={`flex-1 p-4 rounded-lg border-2 font-bold transition ${
                    method === 'momo'
                      ? 'border-red-600 bg-red-50 text-red-600'
                      : 'border-gray-300 text-gray-700'
                  }`}
                >
                  📱 Mobile Money
                </button>
              </div>
            </div>

            {method === 'bank' && (
              <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Bank Name</label>
                  <input
                    type="text"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    placeholder="e.g., GCB Bank"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Account Number</label>
                  <input
                    type="text"
                    value={bankAccount}
                    onChange={(e) => setBankAccount(e.target.value)}
                    placeholder="Your account number"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>
              </div>
            )}

            {method === 'momo' && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0541234567"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>
            )}

            <Button type="submit" className="w-full text-lg py-6" disabled={loading}>
              {loading ? 'Processing...' : 'Withdraw Now'}
            </Button>
          </form>

          <div className="mt-8 bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
            <p className="text-sm text-gray-700">
              <strong>Processing time:</strong> Bank transfers take 1-2 business days. Mobile money is instant.
            </p>
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          <Link href="/dashboard/earner/tasks">
            <Button variant="outline">Browse More Tasks</Button>
          </Link>
          <Link href="/dashboard/earner/earnings">
            <Button variant="outline">View Earnings</Button>
          </Link>
        </div>

      </div>
    </div>
  );
}