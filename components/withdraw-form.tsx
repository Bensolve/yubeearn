'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { formatAmount } from '@/lib/utils';
import { initiateWithdrawalAction } from '@/lib/actions/withdraw';
import { getGhanaBanksAction, verifyAccountNumberAction } from '@/lib/actions/paystack';
import type { User } from '@/types';
import { AlertCircle, CheckCircle2, Zap, Smartphone, ArrowRight, Wallet } from 'lucide-react';

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
      {/* Message Alert - SUCCESS (Green) or WARNING (Red) */}
      {message && (
        <Card
          className={`mb-6 p-4 border-l-4 ${
            message.type === 'success'
              ? 'bg-success/10 border-success text-success'
              : 'bg-red-100 dark:bg-red-900/30 border-red-600 text-red-800 dark:text-red-200'
          }`}
        >
          <div className="flex items-start gap-3">
            {message.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            )}
            <p className="font-bold text-sm">{message.text}</p>
          </div>
        </Card>
      )}

      {/* Withdraw Form Card */}
      <Card className="bg-card border-border p-8 max-w-2xl">
        <form className="space-y-6" onSubmit={handleWithdraw}>
          {/* Amount Input */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-foreground flex items-center gap-2">
              <Wallet className="w-4 h-4 text-muted-foreground" />
              Amount to Withdraw (GHS)
            </label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="100"
              min="10"
              max="50000"
              step="0.01"
              className="h-10 border-border bg-background focus:ring-primary"
              disabled={loading}
            />
            <p className="text-xs text-muted-foreground">Min: GHS 10 | Max: GHS 50,000</p>
            
            {/* Amount Preview - SUCCESS (Green) */}
            {amount && (
              <Card className="bg-success/10 border-success/20 p-4 mt-3">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">You requested:</p>
                    <p className="font-bold text-foreground">GHS {formatAmount(parseFloat(amount))}</p>
                  </div>
                  {fee > 0 && (
                    <>
                      <div className="flex justify-between items-center pt-2 border-t border-success/20">
                        <p className="text-sm text-muted-foreground">Processing fee:</p>
                        <p className="font-bold text-orange-600">-GHS {fee}</p>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-success/20">
                        <p className="text-sm font-bold text-foreground">You&apos;ll receive:</p>
                        <p className="font-bold text-success">GHS {formatAmount(netAmount)}</p>
                      </div>
                    </>
                  )}
                </div>
              </Card>
            )}
          </div>

          {/* Method Selection - PRIMARY (Red) */}
          <div className="space-y-3">
            <label className="block text-sm font-bold text-foreground">Withdrawal Method</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setMethod('bank')}
                className={`p-4 rounded-lg border-2 font-bold transition ${
                  method === 'bank'
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-border text-muted-foreground hover:border-primary/50'
                }`}
                disabled={loading}
              >
                🏦 Bank Account
              </button>
              <button
                type="button"
                onClick={() => setMethod('momo')}
                className={`p-4 rounded-lg border-2 font-bold transition ${
                  method === 'momo'
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-border text-muted-foreground hover:border-primary/50'
                }`}
                disabled={loading}
              >
                📱 Mobile Money
              </button>
            </div>
          </div>

          {/* Bank Method */}
          {method === 'bank' && (
            <Card className="bg-muted/50 border-border p-6 space-y-4">
              <h3 className="font-bold text-foreground flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" />
                Bank Account Details
              </h3>
              
              <div className="space-y-2">
                <label className="block text-sm font-bold text-foreground">Select Bank</label>
                <select
                  value={selectedBank}
                  onChange={(e) => setSelectedBank(e.target.value)}
                  className="w-full px-4 py-2 h-10 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                  disabled={loading}
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

              <div className="space-y-2">
                <label className="block text-sm font-bold text-foreground">Account Number</label>
                <Input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value.slice(0, 10))}
                  placeholder="1234567890"
                  maxLength={10}
                  className="h-10 border-border bg-background focus:ring-primary"
                  disabled={loading}
                />
                {verifying && (
                  <p className="text-xs text-primary font-bold flex items-center gap-1 mt-2">
                    <Zap className="w-3 h-3 animate-spin" /> Verifying...
                  </p>
                )}
                {accountName && (
                  <p className="text-xs text-success font-bold flex items-center gap-1 mt-2">
                    <CheckCircle2 className="w-3 h-3 shrink-0" /> {accountName}
                  </p>
                )}
              </div>
            </Card>
          )}

          {/* Mobile Money Method */}
          {method === 'momo' && (
            <Card className="bg-muted/50 border-border p-6 space-y-4">
              <h3 className="font-bold text-foreground flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-primary" />
                Mobile Money Details
              </h3>
              <div className="space-y-2">
                <label className="block text-sm font-bold text-foreground">Phone Number</label>
                <Input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="0541234567"
                  className="h-10 border-border bg-background focus:ring-primary"
                  disabled={loading}
                />
              </div>
              {amount && parseFloat(amount) < 50 && (
                <div className="flex items-start gap-2 p-3 bg-orange-500/10 border border-orange-500/20 rounded">
                  <AlertCircle className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-orange-700 dark:text-orange-300 font-bold">
                    GHS 5 processing fee applies for amounts below GHS 50
                  </p>
                </div>
              )}
            </Card>
          )}

          {/* Submit Button - PRIMARY (Red) */}
          <Button
            type="submit"
            className="w-full h-11 bg-primary hover:bg-primary/90 text-white font-bold transition"
            disabled={loading || (method === 'bank' && !accountName)}
          >
            {loading ? (
              <>
                <span className="inline-block animate-spin mr-2">⚙️</span>
                Processing...
              </>
            ) : (
              <>
                <Wallet className="w-4 h-4 mr-2" />
                Withdraw Now
                <ArrowRight className="w-4 h-4 ml-auto" />
              </>
            )}
          </Button>
        </form>

        {/* Info Box - PRIMARY (Red) */}
        <div className="mt-8 bg-primary/10 border border-primary/20 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-foreground">Processing Time</p>
              <p className="text-xs text-muted-foreground mt-1">
                Bank transfers: 1-2 working days • Mobile money: Instant
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Action Links */}
      <div className="mt-8 flex flex-col sm:flex-row gap-4">
        <Link href="/dashboard/earner/tasks" className="flex-1 sm:flex-none">
          <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/5 font-bold">
            <Zap className="w-4 h-4 mr-2" />
            Browse More Tasks
            <ArrowRight className="w-4 h-4 ml-auto" />
          </Button>
        </Link>
        <Link href="/dashboard/earner/earnings" className="flex-1 sm:flex-none">
          <Button variant="outline" className="w-full border-success text-success hover:bg-success/5 font-bold">
            <CheckCircle2 className="w-4 h-4 mr-2" />
            View Earnings
            <ArrowRight className="w-4 h-4 ml-auto" />
          </Button>
        </Link>
      </div>
    </>
  );
}