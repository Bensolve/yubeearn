'use server';

import axios, { AxiosError } from 'axios';

const PAYSTACK_BASE_URL = 'https://api.paystack.co';
const SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

interface BankData {
  id: number;
  code: string;
  name: string;
}

interface PaystackResponse<T> {
  status: boolean;
  message: string;
  data: T;
}

interface TransferData {
  transfer_code: string;
  reference: string;
}

interface AccountVerifyData {
  account_name: string;
  account_number: string;
}

interface ErrorResponse {
  message?: string;
}

const paystackClient = axios.create({
  baseURL: PAYSTACK_BASE_URL,
  headers: {
    Authorization: `Bearer ${SECRET_KEY}`,
    'Content-Type': 'application/json',
  },
});

// ============================================
// GET BANKS IN GHANA
// ============================================
export async function getGhanaBanksAction(): Promise<BankData[]> {
  try {
    console.log('[Paystack] Fetching banks...');
    const response = await paystackClient.get<PaystackResponse<BankData[]>>('/bank?country=gh');
    console.log('[Paystack] Banks loaded:', response.data.data.length);
    return response.data.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    console.error('[Paystack] Banks error:', {
      message: axiosError.message,
      status: axiosError.status,
      data: axiosError.response?.data,
    });
    return [];
  }
}

// ============================================
// VERIFY ACCOUNT NUMBER
// ============================================
export async function verifyAccountNumberAction(
  accountNumber: string,
  bankCode: string
): Promise<{ success: boolean; accountName?: string; error?: string }> {
  try {
    console.log('[Paystack] Verifying account:', { accountNumber, bankCode });
    const response = await paystackClient.get<PaystackResponse<AccountVerifyData>>('/bank/resolve', {
      params: {
        account_number: accountNumber,
        bank_code: bankCode,
      },
    });

    console.log('[Paystack] Account verified:', response.data.data.account_name);
    return {
      success: true,
      accountName: response.data.data.account_name,
    };
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    const message = axiosError.response?.data?.message || 'Account not found';
    console.error('[Paystack] Verification error:', message);
    return {
      success: false,
      error: message,
    };
  }
}

// ============================================
// INITIALIZE TRANSFER (to bank or mobile money)
// ============================================
export async function initializeTransferAction(
  amount: number,
  accountNumber: string,
  bankCode: string,
  reason: string,
  reference: string
): Promise<{ success: boolean; transferCode?: string; reference?: string; error?: string }> {
  try {
    console.log('[Paystack] Initiating transfer:', { amount, accountNumber, bankCode });

    const response = await paystackClient.post<PaystackResponse<TransferData>>('/transfer', {
      source: 'balance',
      amount: amount * 100, // Convert to kobo
      recipient: `${accountNumber}_${bankCode}`,
      reason,
      reference,
    });

    console.log('[Paystack] Transfer initiated:', response.data.data);
    return {
      success: true,
      transferCode: response.data.data.transfer_code,
      reference: response.data.data.reference,
    };
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    const message = axiosError.response?.data?.message || 'Transfer failed';
    console.error('[Paystack] Transfer error:', message);
    return {
      success: false,
      error: message,
    };
  }
}

// ============================================
// CREATE TRANSFER RECIPIENT (for mobile money)
// ============================================
export async function createTransferRecipientAction(
  accountNumber: string,
  bankCode: string,
  accountName: string
): Promise<{ success: boolean; recipientCode?: string; error?: string }> {
  try {
    console.log('[Paystack] Creating transfer recipient:', { accountNumber, bankCode });

    const response = await paystackClient.post<PaystackResponse<{ recipient_code: string }>>('/transferrecipient', {
      type: 'nuban',
      account_number: accountNumber,
      bank_code: bankCode,
      name: accountName,
    });

    console.log('[Paystack] Recipient created:', response.data.data.recipient_code);
    return {
      success: true,
      recipientCode: response.data.data.recipient_code,
    };
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    const message = axiosError.response?.data?.message || 'Failed to create recipient';
    console.error('[Paystack] Recipient error:', message);
    return {
      success: false,
      error: message,
    };
  }
}