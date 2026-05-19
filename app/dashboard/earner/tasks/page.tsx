import { getLoggedInUserAction } from '@/lib/auth';
import { getActiveCampaignsAction } from '@/lib/actions/campaigns';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { formatAmount } from '@/lib/utils';
import { redirect } from 'next/navigation';
import TaskCard from '@/components/task-card';
import { Zap, TrendingUp, ArrowRight, CheckCircle } from 'lucide-react';

export default async function TasksPage() {
  const user = await getLoggedInUserAction();

  if (!user) {
    redirect('/login');
  }

  const completedTasks = user.completedTasks || [];

  // ✅ NOW reads from Firebase (real campaigns creators made)
  const allCampaigns = await getActiveCampaignsAction();

  // Filter out tasks this user already completed
  const availableTasks = allCampaigns.filter(
    (task) => !completedTasks.includes(task.id)
  );

  const totalEarned = completedTasks.length * 85;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2 flex items-center gap-2">
                <Zap className="w-8 h-8 text-primary" />
                Available Tasks
              </h1>
              <p className="text-muted-foreground flex items-center gap-2">
                Watch YouTube videos and earn{' '}
                <span className="font-bold text-success ml-1">GHS 85</span> per task
              </p>
            </div>
            <Badge className="bg-success text-white shrink-0">
              {availableTasks.length} Available
            </Badge>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Card className="bg-primary/10 border-primary/20 p-4 hover:border-primary/50 transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-bold mb-1">Total Available</p>
                <p className="text-2xl font-bold text-primary">{availableTasks.length} tasks</p>
              </div>
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5 text-white" />
              </div>
            </div>
          </Card>

          <Card className="bg-success/10 border-success/20 p-4 hover:border-success/50 transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-bold mb-1">Earnings Per Task</p>
                <p className="text-2xl font-bold text-success">GHS 85</p>
              </div>
              <div className="w-10 h-10 bg-success rounded-lg flex items-center justify-center shrink-0">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
            </div>
          </Card>
        </div>

        {/* Tasks Grid */}
        {availableTasks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {availableTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                isCompleted={completedTasks.includes(task.id)}
                userId={user.id}
              />
            ))}
          </div>
        ) : (
          <Card className="bg-gradient-to-r from-success/10 to-primary/10 border-success/20 p-12 text-center">
            <div className="text-5xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold text-foreground mb-2">
              No tasks available right now
            </h3>
            <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
              Check back later — new campaigns are added by creators daily!
            </p>
            <Link href="/dashboard/earner">
              <Button className="bg-primary hover:bg-primary/90 text-white font-bold">
                <ArrowRight className="w-4 h-4 mr-2" />
                Return to Dashboard
              </Button>
            </Link>
          </Card>
        )}

        {/* Completed Tasks Summary */}
        {completedTasks.length > 0 && (
          <div className="mt-8 bg-success/10 border border-success/20 rounded-lg p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center shrink-0">
                <CheckCircle className="w-5 h-5 text-success" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">
                  <span className="font-bold text-foreground">{completedTasks.length}</span> task
                  {completedTasks.length !== 1 ? 's' : ''} completed
                </p>
                <p className="text-sm font-bold text-success">
                  GHS {formatAmount(totalEarned)} earned so far
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs text-muted-foreground mb-1">Potential earnings</p>
                <p className="text-xl font-bold text-success">
                  GHS {formatAmount(availableTasks.length * 85)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}