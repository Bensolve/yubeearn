'use client';

import { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { collection, getDocs, query, where, addDoc, Timestamp, doc, getDoc } from 'firebase/firestore';
import type { User, Task } from '@/types';

export default function Tasks() {
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchTasks = async () => {
    try {
      const tasksRef = collection(db, 'tasks');
      const q = query(tasksRef, where('status', '==', 'active'));
      const snapshot = await getDocs(q);
      const tasksData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      } as Task));
      setTasks(tasksData);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (!currentUser) {
        router.push('/login');
      } else {
        // Get userType from Firestore
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        const userData = userDoc.data();

        setUser({
          email: currentUser.email || '',
          uid: currentUser.uid,
          userType: (userData?.userType as 'earner' | 'creator') || 'earner',
        });
        fetchTasks();
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleCompleteTask = async (task: Task) => {
    if (!user) return;

    try {
      await addDoc(collection(db, 'completions'), {
        userId: user.uid,
        taskId: task.id,
        ownerId: task.ownerId,
        pointsEarned: task.rewardPoints,
        completedAt: Timestamp.now(),
      });

      alert(`Task completed! You earned ${task.rewardPoints} points!`);
      fetchTasks();
    } catch {
      alert('Error completing task');
    }
  };

  if (loading) {
    return <div className="text-center mt-20 text-2xl">Loading...</div>;
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-8">Available Tasks</h2>

      {tasks.length === 0 ? (
        <div className="bg-white p-8 md:p-12 rounded-lg shadow-lg text-center">
          <p className="text-gray-600 text-lg md:text-xl">No tasks available right now</p>
          <p className="text-gray-500 text-sm md:text-base">Check back later!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <div key={task.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
              <div className="bg-gray-900 h-40 flex items-center justify-center">
                <span className="text-white text-5xl">▶️</span>
              </div>

              <div className="p-6">
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">{task.title}</h3>
                <p className="text-gray-600 mb-4 text-sm md:text-base">{task.description}</p>

                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs md:text-sm text-gray-500">⏱️ {task.duration} min</span>
                  <span className="text-base md:text-lg font-bold text-red-600">+{task.rewardPoints} pts</span>
                </div>

                <button
                  onClick={() => window.open(task.videoUrl, '_blank')}
                  className="block w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700 text-center mb-2 text-sm md:text-base cursor-pointer"
                >
                  Watch Video
                </button>

                <button
                  onClick={() => handleCompleteTask(task)}
                  className="w-full bg-red-600 text-white py-2 rounded font-bold hover:bg-red-700 transition text-sm md:text-base"
                >
                  ✓ Complete Task
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}