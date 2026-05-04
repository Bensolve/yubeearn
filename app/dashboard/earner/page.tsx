import { getLoggedInUserAction } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { formatAmount } from '@/lib/utils';
import { TrendingUp, Wallet, CheckCircle, Zap, ArrowRight } from 'lucide-react';

export default async function EarnerDashboard() {
  const currentUser = await getLoggedInUserAction();

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 max-w-md">
          <p className="text-muted-foreground text-center">Not logged in. Please log in to continue.</p>
        </Card>
      </div>
    );
  }

  const balance = currentUser.balance || 0;
  const totalEarned = currentUser.totalEarned || 0;
  const completedTasks = currentUser.completedTasks || [];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Welcome Card - GRADIENT (Primary + Success) */}
        <Card className="bg-gradient-to-r from-primary/10 to-success/10 border-primary/20 p-8 mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                Welcome back! 👋
              </h2>
              <p className="text-muted-foreground">
                Start earning money by completing video tasks
              </p>
            </div>
            {/* SUCCESS: Active status badge (green) */}
            <Badge className="bg-success text-white ml-4 shrink-0">Active</Badge>
          </div>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Available Balance - SUCCESS (Green - money) */}
          <Card className="bg-card border-border p-6 hover:border-success/50 transition">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                <Wallet className="w-6 h-6 text-success" />
              </div>
              <Badge className="bg-success/20 text-success border-success/30 shrink-0">Available</Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-2 font-bold">Available Balance</p>
            <p className="text-4xl font-bold text-success">GHS {formatAmount(balance)}</p>
          </Card>

          {/* Tasks Completed - PRIMARY (Red - progress) */}
          <Card className="bg-card border-border p-6 hover:border-primary/50 transition">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-primary" />
              </div>
              <Badge className="bg-primary/20 text-primary border-primary/30 shrink-0">Progress</Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-2 font-bold">Tasks Completed</p>
            <p className="text-4xl font-bold text-primary">{completedTasks.length}</p>
          </Card>

          {/* Total Earned - ORANGE (Warning - cumulative) */}
          <Card className="bg-card border-border p-6 hover:border-orange-500/50 transition">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-orange-500" />
              </div>
              <Badge className="bg-orange-500/20 text-orange-500 border-orange-500/30 shrink-0">Lifetime</Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-2 font-bold">Total Earned</p>
            <p className="text-4xl font-bold text-orange-500">GHS {formatAmount(totalEarned)}</p>
          </Card>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Browse Tasks - PRIMARY CTA */}
          <Link href="/dashboard/earner/tasks" className="group">
            <Card className="bg-card border-border p-8 hover:border-primary/50 hover:shadow-lg transition cursor-pointer h-full">
              <div className="flex items-start justify-between mb-6">
                <div className="text-5xl group-hover:scale-110 transition">📋</div>
                <Badge className="bg-primary/10 text-primary shrink-0">Get Started</Badge>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">Browse Tasks</h3>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Discover available video tasks and earn{' '}
                <span className="font-bold text-success">GHS 85</span> per completion
              </p>
              {/* PRIMARY: Main CTA button (red) */}
              <Button className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-10 transition">
                <Zap className="w-4 h-4 mr-2" />
                View Available Tasks
                <ArrowRight className="w-4 h-4 ml-auto" />
              </Button>
            </Card>
          </Link>

          {/* Withdraw Earnings - SUCCESS CTA */}
          <Link href="/dashboard/earner/withdraw" className="group">
            <Card className="bg-card border-border p-8 hover:border-success/50 hover:shadow-lg transition cursor-pointer h-full">
              <div className="flex items-start justify-between mb-6">
                <div className="text-5xl group-hover:scale-110 transition">🏦</div>
                <Badge className="bg-success/10 text-success shrink-0">Safe</Badge>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">Withdraw Earnings</h3>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Transfer your money to bank account or mobile money anytime
              </p>
              {/* SUCCESS: Secondary CTA (green outline) */}
              <Button
                variant="outline"
                className="w-full border-success text-success hover:bg-success/5 font-bold h-10 transition"
              >
                <Wallet className="w-4 h-4 mr-2" />
                Withdraw Now
                <ArrowRight className="w-4 h-4 ml-auto" />
              </Button>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}