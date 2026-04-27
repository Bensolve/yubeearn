'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, increment, setDoc } from 'firebase/firestore';
import { verifyAccountNumberAction } from '@/lib/actions/paystack';
import type { Withdrawal } from '@/types';

interface WithdrawResult {
  success: boolean;
  message?: string;
  withdrawal?: Withdrawal;
  error?: string;
  fee?: number;
  netAmount?: number;
}

// ============================================
// CALCULATE FEE
// ============================================
function calculateFee(amount: number, method: 'bank' | 'momo'): number {
  if (method === 'momo' && amount < 50) {
    return 5;
  }
  return 0;
}

// ============================================
// VALIDATE WITHDRAWAL
// ============================================
function validateWithdrawal(
  amount: number,
  balance: number,
  method: 'bank' | 'momo',
  bankCode?: string,
  accountNumber?: string,
  phoneNumber?: string
): string | null {
  if (balance < amount) {
    return 'Insufficient balance';
  }

  if (amount < 10) {
    return 'Minimum withdrawal is GHS 10';
  }

  if (amount > 50000) {
    return 'Maximum withdrawal is GHS 50,000';
  }

  if (method === 'bank') {
    if (!bankCode || !accountNumber) {
      return 'Bank details required';
    }
    if (accountNumber.length !== 10) {
      return 'Invalid account number';
    }
  }

  if (method === 'momo') {
    if (!phoneNumber) {
      return 'Phone number required';
    }
    if (phoneNumber.length < 10) {
      return 'Invalid phone number';
    }
  }

  return null;
}

// ============================================
// SIMULATE PAYSTACK TRANSFER (Internal)
// ============================================
function simulatePaystackTransfer(
  amount: number,
  method: 'bank' | 'momo',
  accountNumber?: string,
  bankCode?: string,
  phoneNumber?: string
): { success: boolean; transferCode?: string; reference?: string; error?: string } {
  try {
    // Simulate random success/failure (90% success rate for testing)
    const randomSuccess = Math.random() < 0.9;

    if (!randomSuccess) {
      return {
        success: false,
        error: 'Simulated payment failure. Please try again.',
      };
    }

    // Generate fake Paystack transfer code
    const transferCode = `TRF_${Math.random().toString(36).substring(2, 11).toUpperCase()}`;
    const reference = `ybe_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    console.log('[Paystack Simulation] Transfer successful:', {
      transferCode,
      reference,
      amount,
      method,
      accountNumber,
      bankCode,
      phoneNumber,
    });

    return {
      success: true,
      transferCode,
      reference,
    };
  } catch (error) {
    return {
      success: false,
      error: 'Simulated transfer failed',
    };
  }
}

// ============================================
// INITIATE WITHDRAWAL
// ============================================
export async function initiateWithdrawalAction(
  userId: string,
  amount: number,
  method: 'bank' | 'momo',
  bankName?: string,
  accountNumber?: string,
  bankCode?: string,
  phoneNumber?: string
): Promise<WithdrawResult> {
  try {
    // 1. Get user from Firestore
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return { success: false, error: 'User not found' };
    }

    const userData = userSnap.data();
    const userBalance = userData.balance || 0;

    // 2. Validate withdrawal
    const validationError = validateWithdrawal(
      amount,
      userBalance,
      method,
      bankCode,
      accountNumber,
      phoneNumber
    );

    if (validationError) {
      return { success: false, error: validationError };
    }

    // 3. Calculate fee
    const fee = calculateFee(amount, method);
    const netAmount = amount - fee;

    // 4. For bank transfers, verify account
    if (method === 'bank' && bankCode && accountNumber) {
      const verified = await verifyAccountNumberAction(accountNumber, bankCode);
      if (!verified.success) {
        return { success: false, error: 'Account verification failed: ' + verified.error };
      }
    }

    // 5. Create withdrawal record
    const withdrawalId = `${userId}_${Date.now()}`;
    const withdrawalData: Withdrawal = {
      id: withdrawalId,
      userId,
      amount,
      method,
      paystackReference: `ybe_${withdrawalId}`,
      fee,
      netAmount,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    // Add bank fields only if bank method
    if (method === 'bank') {
      withdrawalData.bankName = bankName;
      withdrawalData.accountNumber = accountNumber;
      withdrawalData.bankCode = bankCode;
    }

    // Add mobile money fields only if momo method
    if (method === 'momo') {
      withdrawalData.phoneNumber = phoneNumber;
    }

    // 6. Save withdrawal to Firestore (status: pending)
    const withdrawalRef = doc(db, 'withdrawals', withdrawalId);
    await setDoc(withdrawalRef, withdrawalData);

    console.log('[Withdraw] Saved to Firestore:', withdrawalId);

    // 7. Deduct from user balance
    await updateDoc(userRef, {
      balance: increment(-amount),
    });

    console.log('[Withdraw] Balance deducted:', { userId, amount });

    // 8. SIMULATE PAYSTACK TRANSFER (Internal - no real API call)
    console.log('[Withdraw] Simulating Paystack Transfer...');
    
    const transfer = simulatePaystackTransfer(
      amount,
      method,
      accountNumber,
      bankCode,
      phoneNumber
    );

    if (!transfer.success) {
      console.error('[Withdraw] Simulated transfer failed:', transfer.error);
      // Update withdrawal status to failed
      await updateDoc(withdrawalRef, {
        status: 'failed',
        errorMessage: transfer.error,
      });
      return { success: false, error: 'Transfer failed: ' + transfer.error };
    }

    // Update withdrawal with simulated Paystack reference and mark as completed
    await updateDoc(withdrawalRef, {
      transferCode: transfer.transferCode,
      paystackReference: transfer.reference,
      status: 'completed',
      processedAt: new Date().toISOString(),
    });

    console.log('[Withdraw] Simulated transfer completed:', transfer.transferCode);

    // 9. Revalidate the page cache
    revalidatePath('/dashboard/earner');
    revalidatePath('/dashboard/earner/withdraw');

    console.log('[Withdraw] Initiated:', {
      userId,
      amount,
      method,
      fee,
      netAmount,
      withdrawalId,
      transferCode: transfer.transferCode,
      status: 'completed',
    });

    return {
      success: true,
      message: `Withdrawal of GHS ${amount} initiated. You'll receive GHS ${netAmount} within 1-2 working days.`,
      withdrawal: withdrawalData,
      fee,
      netAmount,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Withdrawal failed';
    console.error('[Withdraw] Error:', errorMessage);
    return {
      success: false,
      error: errorMessage,
    };
  }
}

// ============================================
// GET WITHDRAWAL HISTORY
// ============================================
export async function getWithdrawalHistoryAction(userId: string): Promise<Withdrawal[]> {
  try {
    const withdrawalRef = doc(db, 'withdrawals', userId);
    const withdrawalSnap = await getDoc(withdrawalRef);

    if (!withdrawalSnap.exists()) {
      return [];
    }

    return [withdrawalSnap.data() as Withdrawal];
  } catch (error) {
    console.error('[Withdraw] Error fetching history:', error);
    return [];
  }
}