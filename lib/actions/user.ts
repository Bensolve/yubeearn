'use server';

import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import type { User } from '@/types';

export async function fetchUserData(userId: string): Promise<User | null> {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (!userDoc.exists()) return null;

    const data = userDoc.data();
    return {
      id: userId,
      email: data.email,
      role: data.role,
      balance: data.balance,
      totalEarned: data.totalEarned || 0,
      completedTasks: data.completedTasks || [],
      earningsHistory: data.earningsHistory || [],
      createdAt: new Date(data.createdAt),
    };
  } catch (error) {
    console.error('[User] Error fetching data:', error);
    return null;
  }
}