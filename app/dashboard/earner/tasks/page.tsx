import { getLoggedInUserAction } from '@/lib/auth';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatAmount } from "@/lib/utils";
import { mockTasks } from "@/constants/tasks";
import { redirect } from 'next/navigation';
import TaskCard from '@/components/task-card';

export default async function TasksPage() {
  const user = await getLoggedInUserAction();

  if (!user) {
    redirect('/login');
  }

  const completedTasks = user.completedTasks || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Available Tasks</h1>
          <p className="text-gray-600">Watch YouTube videos and earn GHS 85 per task</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {mockTasks.map((task) => {
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
      </div>
    </div>
  );
}