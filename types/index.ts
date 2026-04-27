// ============================================
// USER & AUTH
// ============================================

export type UserRole = 'creator' | 'earner' | 'admin';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  balance: number;
  totalEarned: number;
  completedTasks: string[];
  earningsHistory: Earning[];
  createdAt: Date;
  
}

// ============================================
// TASKS & EARNINGS
// ============================================

export interface Task {
  id: string;
  title: string;
  description: string;
  duration: number;
  completions: number;
  reward: number;
  youtubeUrl: string;
}

export interface Earning {
  id: string;
  taskTitle: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending';
}

// ============================================
// WITHDRAWALS
// ============================================

export interface Withdrawal {
  id: string;
  userId: string;
  amount: number;
  method: 'bank' | 'momo';
  
  // Bank details (only for bank transfers)
  bankName?: string;
  accountNumber?: string;
  bankCode?: string;
  
  // Mobile money details (only for momo)
  phoneNumber?: string;
  
  // Paystack details
  paystackReference: string;
  transferCode?: string;
  
  // Fees & amounts
  fee: number;
  netAmount: number;
  
  // Status
  status: 'pending' | 'completed' | 'failed';
  errorMessage?: string;
  
  // Timestamps
  createdAt: string;
  processedAt?: string;
}
// ============================================
// UI/NOTIFICATIONS
// ============================================

export interface Notification {
  message: string;
  type: 'success' | 'error' | 'info';
  id: string;
}