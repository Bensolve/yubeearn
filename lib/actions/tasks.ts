'use server';

import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, increment, arrayUnion } from 'firebase/firestore';

export async function completeTaskAction(
  userId: string,
  taskId: string,
  amount: number
) {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      return { success: false, error: 'User not found' };
    }

    const userData = userSnap.data();
    if (userData.completedTasks?.includes(taskId)) {
      return { success: false, error: 'You already completed this task' };
    }

    // Update user balance and completed tasks
    await updateDoc(userRef, {
      balance: increment(amount),
      totalEarned: increment(amount),
      completedTasks: arrayUnion(taskId),
    });

    console.log('[Tasks] Reward claimed:', { userId, taskId, amount });
    return { success: true, newBalance: userData.balance + amount };
  } catch (error) {
    console.error('[Tasks] Error claiming reward:', error);
    return { success: false, error: 'Failed to claim reward' };
  }
}