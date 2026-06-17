'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { AlertCircle, Zap, CreditCard, CheckCircle2 } from 'lucide-react';
import { verifyTopUpAction } from '@/lib/actions/billing';
import type { User } from '@/types';

interface BillingFormProps {
  user: User;
}

const PRESETS = [500, 1000, 2000, 5000];

export default function BillingForm({ user }: BillingFormProps) {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [paystackReady, setPaystackReady] = useState(false);

  // ✅ Load Paystack script properly on mount
  useEffect(() => {
    const existingScript = document.getElementById('paystack-script');
    if (existingScript) {
      setPaystackReady(true);
      return;
    }

    const script = document.createElement('script');
    script.id = 'paystack-script';
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    script.onload = () => setPaystackReady(true);
    script.onerror = () => setError('Failed to load payment system. Please refresh.');
    document.body.appendChild(script);
  }, []);

  const handleTopUp = (topUpAmount: number) => {
    setError('');
    setSuccess('');

    if (!paystackReady) {
      setError('Payment system still loading. Please wait a moment.');
      return;
    }

    setLoading(true);

    // @ts-expect-error Paystack loaded via script tag
    const handler = window.PaystackPop.setup({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
      email: user.email,
      amount: topUpAmount * 100, // pesewas
      currency: 'GHS',
      ref: `topup-${user.id}-${Date.now()}`,
      metadata: { userId: user.id },
      callback: async (response: { reference: string }) => {
        const result = await verifyTopUpAction(user.id, response.reference, topUpAmount);
        if (result.success) {
          setSuccess(`GHS ${topUpAmount} added to your balance!`);
          setTimeout(() => window.location.reload(), 1500);
        } else {
          setError(result.error || 'Top up failed. Contact support.');
        }
        setLoading(false);
      },
      onClose: () => setLoading(false),
    });

    handler.openIframe();
  };

  const handleCustom = () => {
    const parsed = parseFloat(amount);
    if (!parsed || parsed < 10) {
      setError('Minimum top up is GHS 10');
      return;
    }
    handleTopUp(parsed);
  };

  return (
    <div className="space-y-6">
      {/* Balance Card */}
      <Card className="bg-trust/10 border-trust/20 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground font-bold mb-1">Current Balance</p>
            <p className="text-4xl font-bold text-trust">GHS {user.balance || 0}</p>
            <p className="text-xs text-muted-foreground mt-2">
              Each campaign costs GHS 100 minimum
            </p>
          </div>
          <Badge className={user.balance > 0 ? 'bg-earn/20 text-earn' : 'bg-caution/20 text-caution'}>
            {user.balance > 0 ? 'Ready' : 'Top Up Needed'}
          </Badge>
        </div>
      </Card>

      {/* Success */}
      {success && (
        <Card className="bg-earn/10 border-earn/30 p-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-earn shrink-0" />
            <p className="text-sm font-bold text-earn">{success}</p>
          </div>
        </Card>
      )}

      {/* Error */}
      {error && (
        <Card className="bg-caution/10 border-caution/30 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-caution shrink-0 mt-0.5" />
            <p className="text-sm font-bold text-caution">{error}</p>
          </div>
        </Card>
      )}

      {/* Preset Amounts */}
      <Card className="bg-card border-border p-6">
        <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-trust" />
          Quick Top Up
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {PRESETS.map((preset) => (
            <button
              key={preset}
              onClick={() => handleTopUp(preset)}
              disabled={loading || !paystackReady}
              className="p-4 rounded-lg border-2 border-trust/30 hover:border-trust hover:bg-trust/5 transition font-bold text-trust disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <p className="text-lg">GHS {preset}</p>
              <p className="text-xs text-muted-foreground font-normal mt-1">
                ~{Math.floor(preset / 100)} campaigns
              </p>
            </button>
          ))}
        </div>

        {/* Custom Amount */}
        <div className="border-t border-border pt-4">
          <p className="text-sm font-bold text-foreground mb-3">Custom Amount</p>
          <div className="flex gap-3">
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount (min GHS 10)"
              className="h-10 border-border bg-background"
              disabled={loading}
            />
            <Button
              onClick={handleCustom}
              disabled={loading || !amount || !paystackReady}
              className="bg-trust hover:bg-trust/90 text-white font-bold shrink-0"
            >
              {loading ? '⚙️...' : 'Top Up'}
            </Button>
          </div>
        </div>

        {/* Paystack loading indicator */}
        {!paystackReady && (
          <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1">
            <Zap className="w-3 h-3 animate-spin" />
            Loading payment system...
          </p>
        )}
      </Card>

      {/* How It Works */}
      <Card className="bg-card border-border p-6">
        <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-trust" />
          How Billing Works
        </h3>
        <div className="space-y-3">
          {[
            'Top up using Paystack — card or mobile money',
            'Each campaign costs GHS 100 per viewer minimum',
            'Balance is deducted when you create a campaign',
            'Unused balance can be withdrawn anytime',
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-earn shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">{item}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}