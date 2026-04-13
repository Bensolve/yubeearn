"use client";

import { Button } from "@/components/ui/button";
import { useAppContext } from "@/app/context/AppContext";

import { mockTasks } from "@/constants/tasks";

// remove the hardcoded mockTasks array from the file

export default function TasksPage() {
  const { completeTask, completedTasks, notification } = useAppContext();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Notification */}
        {notification && (
          <div
            className={`fixed top-4 right-4 max-w-md p-4 rounded-lg border-l-4 shadow-lg z-50 ${
              notification.type === "success"
                ? "bg-green-100 border-green-600 text-green-800"
                : notification.type === "error"
                  ? "bg-red-100 border-red-600 text-red-800"
                  : "bg-blue-100 border-blue-600 text-blue-800"
            }`}
          >
            <p className="font-bold">{notification.message}</p>
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Available Tasks
          </h1>
          <p className="text-gray-600">
            Complete tasks and earn GHS 85 per video
          </p>
        </div>

        {/* Tasks Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {mockTasks.map((task) => {
            const isCompleted = completedTasks.includes(task.id);

            return (
              <div
                key={task.id}
                className={`rounded-lg shadow p-6 ${
                  isCompleted
                    ? "bg-gray-100"
                    : "bg-white hover:shadow-lg transition"
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {task.title}
                    </h3>
                    <p className="text-gray-600">{task.description}</p>
                  </div>
                  {isCompleted && (
                    <span className="bg-green-200 text-green-800 px-3 py-1 rounded-full text-sm font-bold">
                      ✓ Completed
                    </span>
                  )}
                </div>

                <div className="mb-6 space-y-2 text-sm text-gray-600">
                  <p>⏱️ Duration: {task.duration} minutes</p>
                  <p>👥 {task.completions} people completed</p>
                </div>

                <div className="bg-green-50 rounded p-3 mb-6 border-l-4 border-green-600">
                  <p className="text-gray-600 text-sm mb-1">You ll earn</p>
                  <p className="text-2xl font-bold text-green-600">
                    GHS {task.reward}
                  </p>
                </div>

                <Button
                  className="w-full"
                  onClick={() =>
                    !isCompleted && completeTask(task.id, task.reward)
                  }
                  disabled={isCompleted}
                >
                  {isCompleted
                    ? "Already Completed"
                    : `Watch & Earn GHS ${task.reward}`}
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
