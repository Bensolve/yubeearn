import { getLoggedInUserAction } from '@/lib/auth';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { formatAmount } from '@/lib/utils';
import { mockTasks } from '@/constants/tasks';
import { redirect } from 'next/navigation';
import TaskCard from '@/components/task-card';
import { Zap, TrendingUp } from 'lucide-react';

export default async function TasksPage() {
  const user = await getLoggedInUserAction();

  if (!user) {
    redirect('/login');
  }

  const completedTasks = user.completedTasks || [];
  const availableTasks = mockTasks.filter(task => !completedTasks.includes(task.id));

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                Available Tasks
              </h1>
              <p className="text-muted-foreground flex items-center gap-2">
                <Zap className="w-4 h-4 text-success" />
                Watch YouTube videos and earn <span className="font-bold text-success ml-1">GHS 85</span> per task
              </p>
            </div>
            <Badge className="bg-success text-white">
              {availableTasks.length} Available
            </Badge>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Card className="bg-primary/10 border-primary/20 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-bold mb-1">Total Available</p>
                <p className="text-2xl font-bold text-primary">{availableTasks.length} tasks</p>
              </div>
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
            </div>
          </Card>

          <Card className="bg-success/10 border-success/20 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-bold mb-1">Earnings Per Task</p>
                <p className="text-2xl font-bold text-success">GHS 85</p>
              </div>
              <div className="w-10 h-10 bg-success rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
            </div>
          </Card>
        </div>

        {/* Tasks Grid */}
        {availableTasks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {availableTasks.map((task) => {
              const isCompleted = completedTasks.includes(task.id);
              return (
                <TaskCard
                  key={task.id}
                  task={task}
                  isCompleted={isCompleted}
                  userId={user.id}
                />
              );
            })}
          </div>
        ) : (
          <Card className="bg-card border-border p-12 text-center">
            <div className="text-5xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold text-foreground mb-2">
              You&apos;ve completed all available tasks!
            </h3>
            <p className="text-muted-foreground mb-6">
              Check back later for more tasks to earn from
            </p>
            <Link href="/dashboard/earner">
              <button className="text-primary hover:underline font-bold">
                Return to Dashboard
              </button>
            </Link>
          </Card>
        )}

        {/* Completed Tasks Info */}
        {completedTasks.length > 0 && (
          <div className="mt-8 bg-muted/50 border border-border rounded-lg p-6">
            <p className="text-sm text-muted-foreground">
              <span className="font-bold text-foreground">{completedTasks.length}</span> task{completedTasks.length !== 1 ? 's' : ''} completed • 
              <span className="font-bold text-success ml-2">GHS {formatAmount(completedTasks.length * 85)}</span> earned
            </p>
          </div>
        )}
      </div>
    </div>
  );
}