import { getLoggedInUserAction } from '@/lib/auth';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { redirect } from 'next/navigation';
import WithdrawForm from '@/components/withdraw-form';
import { formatAmount } from '@/lib/utils';
import { Wallet, AlertCircle, Clock, Zap } from 'lucide-react';

export default async function WithdrawPage() {
  const user = await getLoggedInUserAction();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2 flex items-center gap-2">
            <Wallet className="w-8 h-8 text-success" />
            Withdraw Earnings
          </h1>
          <p className="text-muted-foreground">
            Transfer money to your bank account or mobile money
          </p>
        </div>

        {/* Balance Card - SUCCESS (Green - money) */}
        <Card className="bg-gradient-to-r from-success/10 to-success/5 border-success/20 p-8 mb-8 hover:border-success/50 transition">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Wallet className="w-5 h-5 text-success" />
                <p className="text-sm text-muted-foreground font-bold">Available Balance</p>
              </div>
              <p className="text-5xl font-bold text-success">
                GHS {formatAmount(user.balance || 0)}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Ready to withdraw anytime
              </p>
            </div>
            {/* SUCCESS: Active badge (green) */}
            <Badge className="bg-success text-white shrink-0">Active</Badge>
          </div>
        </Card>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Processing Time - PRIMARY (Red - info) */}
          <Card className="bg-card border-border p-6 hover:border-primary/50 transition">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-foreground mb-1 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary" />
                  Processing Time
                </h3>
                <p className="text-sm text-muted-foreground">
                  Bank transfers: 1-2 working days
                </p>
                <p className="text-sm text-muted-foreground">
                  Mobile money: Instant
                </p>
              </div>
            </div>
          </Card>

          {/* Withdrawal Limits - ORANGE (Warning - limits) */}
          <Card className="bg-card border-border p-6 hover:border-orange-500/50 transition">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5 text-orange-500" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-foreground mb-1">Withdrawal Limits</h3>
                <p className="text-sm text-muted-foreground">
                  Minimum: <span className="font-bold text-foreground">GHS 10</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  Maximum: <span className="font-bold text-foreground">GHS 50,000</span>
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Withdraw Form Component */}
        <WithdrawForm user={user} />
      </div>
    </div>
  );
}