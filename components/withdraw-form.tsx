'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { formatAmount } from '@/lib/utils';
import { initiateWithdrawalAction } from '@/lib/actions/withdraw';
import { getGhanaBanksAction, verifyAccountNumberAction } from '@/lib/actions/paystack';
import type { User } from '@/types';

interface Bank {
  id: number;
  code: string;
  name: string;
}

interface WithdrawFormProps {
  user: User;
}

interface Message {
  type: 'success' | 'error';
  text: string;
}

interface VerifyResult {
  success: boolean;
  accountName?: string;
  error?: string;
}

export default function WithdrawForm({ user }: WithdrawFormProps) {
  const router = useRouter();
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState<'bank' | 'momo'>('bank');
  const [banks, setBanks] = useState<Bank[]>([]);
  const [selectedBank, setSelectedBank] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [message, setMessage] = useState<Message | null>(null);
  const [fee, setFee] = useState(0);
  const [netAmount, setNetAmount] = useState(0);

  // Load banks on mount
  useEffect(() => {
    const loadBanks = async (): Promise<void> => {
      const banksData = await getGhanaBanksAction();
      setBanks(banksData);
    };
    loadBanks();
  }, []);

  // Calculate fee when amount or method changes
  useEffect(() => {
    const withdrawAmount = parseFloat(amount) || 0;
    
    let calculatedFee = 0;
    if (method === 'momo' && withdrawAmount > 0 && withdrawAmount < 50) {
      calculatedFee = 5;
    }
    
    setFee(calculatedFee);
    setNetAmount(Math.max(0, withdrawAmount - calculatedFee));
  }, [amount, method]);

  // Verify account when account number changes
  useEffect(() => {
    if (accountNumber.length === 10 && selectedBank) {
      const verifyAccount = async (): Promise<void> => {
        setVerifying(true);
        const result: VerifyResult = await verifyAccountNumberAction(accountNumber, selectedBank);
        if (result.success) {
          setAccountName(result.accountName || '');
          setMessage(null);
        } else {
          setAccountName('');
          setMessage({ type: 'error', text: 'Account verification failed: ' + result.error });
        }
        setVerifying(false);
      };
      verifyAccount();
    } else {
      setAccountName('');
    }
  }, [accountNumber, selectedBank]);

  const handleWithdraw = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setMessage(null);

    const withdrawAmount = parseFloat(amount);

    if (!amount || withdrawAmount <= 0) {
      setMessage({ type: 'error', text: 'Enter a valid amount' });
      return;
    }

    if (withdrawAmount < 10) {
      setMessage({ type: 'error', text: 'Minimum withdrawal is GHS 10' });
      return;
    }

    if (withdrawAmount > 50000) {
      setMessage({ type: 'error', text: 'Maximum withdrawal is GHS 50,000' });
      return;
    }

    if (withdrawAmount > user.balance) {
      setMessage({ type: 'error', text: 'Insufficient balance' });
      return;
    }

    if (method === 'bank') {
      if (!selectedBank || !accountNumber || !accountName) {
        setMessage({ type: 'error', text: 'Please verify your account first' });
        return;
      }
    }

    if (method === 'momo') {
      if (!phoneNumber || phoneNumber.length < 10) {
        setMessage({ type: 'error', text: 'Enter a valid phone number' });
        return;
      }
    }

    setLoading(true);
    try {
      const bankName = banks.find(b => b.code === selectedBank)?.name;
      
      const result = await initiateWithdrawalAction(
        user.id,
        withdrawAmount,
        method,
        method === 'bank' ? bankName : undefined,
        method === 'bank' ? accountNumber : undefined,
        method === 'bank' ? selectedBank : undefined,
        method === 'momo' ? phoneNumber : undefined
      );

      if (result.success) {
        setMessage({
          type: 'success',
          text: `✓ GHS ${withdrawAmount} withdrawal initiated. You'll receive GHS ${result.netAmount} ${method === 'momo' && fee > 0 ? `(after GHS ${fee} fee)` : ''}. Processing...`,
        });
        
        setAmount('');
        setSelectedBank('');
        setAccountNumber('');
        setAccountName('');
        setPhoneNumber('');
        
        setTimeout(() => {
          router.refresh();
        }, 1500);
      } else {
        setMessage({ type: 'error', text: result.error || 'Withdrawal failed' });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Withdrawal failed';
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {message && (
        <div
          className={`mb-6 p-4 rounded-lg border-l-4 ${
            message.type === 'success'
              ? 'bg-green-100 border-green-600 text-green-800'
              : 'bg-red-100 border-red-600 text-red-800'
          }`}
        >
          <p className="font-bold">{message.text}</p>
        </div>
      )}

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
            
            {amount && (
              <div className="mt-3 bg-gray-50 p-3 rounded">
                <p className="text-sm text-gray-600">
                  You requested: <span className="font-bold">GHS {formatAmount(parseFloat(amount))}</span>
                </p>
                {fee > 0 && (
                  <>
                    <p className="text-sm text-gray-600">
                      Processing fee: <span className="font-bold text-red-600">GHS {fee}</span>
                    </p>
                    <p className="text-sm text-gray-900 font-bold">
                      You&apos;ll receive: <span className="text-green-600">GHS {formatAmount(netAmount)}</span>
                    </p>
                  </>
                )}
              </div>
            )}
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
              <h3 className="font-bold text-gray-900">Bank Account Details</h3>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Select Bank</label>
                <select
                  value={selectedBank}
                  onChange={(e) => setSelectedBank(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                >
                  <option value="">
                    {banks.length === 0 ? 'Loading banks...' : 'Choose a bank...'}
                  </option>
                  {banks.map((bank) => (
                    <option key={bank.code} value={bank.code}>
                      {bank.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Account Number</label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value.slice(0, 10))}
                  placeholder="1234567890"
                  maxLength={10}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                />
                {verifying && <p className="text-xs text-blue-600 mt-2">Verifying...</p>}
                {accountName && (
                  <p className="text-xs text-green-600 mt-2">✓ {accountName}</p>
                )}
              </div>
            </div>
          )}

          {method === 'momo' && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-bold text-gray-900 mb-4">Mobile Money Details</h3>
              <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="0541234567"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
              />
              {amount && parseFloat(amount) < 50 && (
                <p className="text-xs text-orange-600 mt-2">
                  ⚠️ GHS 5 processing fee applies for amounts below GHS 50
                </p>
              )}
            </div>
          )}

          <Button
            type="submit"
            className="w-full text-lg py-6"
            disabled={loading || (method === 'bank' && !accountName)}
          >
            {loading ? 'Processing...' : 'Withdraw Now'}
          </Button>
        </form>

        <div className="mt-8 bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
          <p className="text-sm text-gray-700">
            <strong>Processing:</strong> Bank transfers are next working day. Mobile money is faster.
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
    </>
  );
}