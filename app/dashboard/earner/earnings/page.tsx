import { getLoggedInUserAction } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { formatAmount, formatDate } from '@/lib/utils';
import { TrendingUp, Calendar, Wallet, CheckCircle } from 'lucide-react';

export default async function EarningsPage() {
  const user = await getLoggedInUserAction();

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 max-w-md">
          <p className="text-muted-foreground text-center">Not logged in. Please log in to continue.</p>
        </Card>
      </div>
    );
  }

  const earningsHistory = user.earningsHistory || [];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Earnings History
          </h1>
          <p className="text-muted-foreground">
            Track all your completed tasks and earnings
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Earned */}
          <Card className="bg-card border-border p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-success" />
              </div>
              <Badge className="bg-success/20 text-success border-success/30">Lifetime</Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-2 font-bold">Total Earned</p>
            <p className="text-4xl font-bold text-success">
              GHS {formatAmount(user.totalEarned || 0)}
            </p>
            <p className="text-xs text-muted-foreground mt-3">
              {earningsHistory.length} task{earningsHistory.length !== 1 ? 's' : ''} completed
            </p>
          </Card>

          {/* All Time */}
          <Card className="bg-card border-border p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <Badge className="bg-primary/20 text-primary border-primary/30">Stats</Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-2 font-bold">All Time</p>
            <p className="text-4xl font-bold text-primary">
              GHS {formatAmount(user.totalEarned || 0)}
            </p>
            <p className="text-xs text-muted-foreground mt-3">
              {earningsHistory.length} completed task{earningsHistory.length !== 1 ? 's' : ''}
            </p>
          </Card>

          {/* Available Balance */}
          <Card className="bg-card border-border p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center">
                <Wallet className="w-6 h-6 text-orange-500" />
              </div>
              <Badge className="bg-orange-500/20 text-orange-500 border-orange-500/30">Action</Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-2 font-bold">Available Balance</p>
            <p className="text-4xl font-bold text-orange-500">
              GHS {formatAmount(user.balance || 0)}
            </p>
            <p className="text-xs text-muted-foreground mt-3">Ready to withdraw</p>
          </Card>
        </div>

        {/* Earnings Table or Empty State */}
        {earningsHistory.length === 0 ? (
          <Card className="bg-card border-border p-12 text-center">
            <div className="text-5xl mb-4">📊</div>
            <h3 className="text-2xl font-bold text-foreground mb-2">
              No earnings yet
            </h3>
            <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
              Complete tasks to start earning money and see your earnings history here
            </p>
            <Link href="/dashboard/earner/tasks">
              <Button className="bg-success hover:bg-success/90 text-white">
                <CheckCircle className="w-4 h-4 mr-2" />
                Browse Available Tasks
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-muted border-b border-border p-6 font-bold text-foreground">
              <div>Task</div>
              <div>Amount</div>
              <div>Date</div>
              <div>Status</div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-border">
              {earningsHistory.map((earning) => (
                <div
                  key={earning.id}
                  className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 hover:bg-muted/50 transition items-center"
                >
                  <div className="text-foreground font-medium text-sm md:text-base">
                    {earning.taskTitle}
                  </div>
                  <div className="text-success font-bold text-sm md:text-base">
                    GHS {formatAmount(earning.amount)}
                  </div>
                  <div className="text-muted-foreground text-sm md:text-base">
                    {formatDate(earning.date)}
                  </div>
                  <div>
                    <Badge className="bg-success/20 text-success border-success/30">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {earning.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <Link href="/dashboard/earner/tasks" className="flex-1 sm:flex-none">
            <Button className="w-full bg-primary hover:bg-primary/90 text-white">
              Browse More Tasks
            </Button>
          </Link>
          <Link href="/dashboard/earner/withdraw" className="flex-1 sm:flex-none">
            <Button variant="outline" className="w-full border-success text-success hover:bg-success/5">
              Withdraw Earnings
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}