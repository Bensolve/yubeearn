'use server';

import { db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

// ============================================
// TEMP: Give creator balance for testing
// Call this ONCE from browser console or a test button
// DELETE after real Paystack top-up is built
// ============================================
export async function giveCreatorBalanceAction(userId: string): Promise<void> {
  await updateDoc(doc(db, 'users', userId), {
    balance: 1000, // GHS 1000 test balance
  });
  console.log('[Test] Gave GHS 1000 balance to:', userId);
}