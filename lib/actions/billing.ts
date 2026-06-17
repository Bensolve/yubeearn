'use server';

import { db } from '@/lib/firebase';
import { doc, updateDoc, increment, addDoc, collection, Timestamp } from 'firebase/firestore';

// ============================================
// VERIFY TOP UP + ADD BALANCE
// Called after Paystack payment succeeds
// ============================================
export async function verifyTopUpAction(
  userId: string,
  reference: string,
  amount: number
): Promise<{ success: boolean; error?: string }> {
  try {
    // 1. Verify with Paystack API
    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const data = await response.json();

    if (!data.status || data.data.status !== 'success') {
      return { success: false, error: 'Payment not verified' };
    }

    const paidAmount = data.data.amount / 100; // Convert pesewas to GHS

    // 2. Add balance to creator
    await updateDoc(doc(db, 'users', userId), {
      balance: increment(paidAmount),
    });

    // 3. Save transaction record
    await addDoc(collection(db, 'transactions'), {
      userId,
      amount: paidAmount,
      type: 'purchase',
      direction: 'in',
      description: `Balance top up via Paystack`,
      paystackReference: reference,
      status: 'completed',
      createdAt: Timestamp.now(),
    });

    console.log('[Billing] Top up verified, added GHS', paidAmount);
    return { success: true };
  } catch (error) {
    console.error('[Billing] Verify error:', error);
    return { success: false, error: 'Verification failed' };
  }
}