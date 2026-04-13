// ============================================
// CORE TYPES
// ============================================

export type UserRole = 'creator' | 'earner' | 'admin';



export interface User {
  id: string;
  email: string;
  password?: string;
  role: UserRole;
  balance: number;
  totalEarned?: number;
  completedTasks?: string[];
  earningsHistory?: Earning[];
  createdAt: Date;
  // ← add these
  paymentMethod?: 'bank' | 'momo';
  bankName?: string;
  accountNumber?: string;
  phoneNumber?: string;
}

export interface Task {
  id: string;
  campaignId: string;
  title: string;
  description?: string;
  videoUrl: string;
  reward: number;
  duration: number;
  completions: number;
  status: 'active' | 'expired' | 'cancelled';
  createdAt: Date;
}

// ============================================
// CONTEXT & STATE TYPES
// ============================================

export interface Earning {
  id: string;
  taskTitle: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending';
}

export interface Notification {
  message: string;
  type: 'success' | 'error' | 'info';
  id: string;
}

export interface AppContextType {
  // User
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;

  // Balance & Earnings
  balance: number;
  setBalance: (balance: number) => void;
  totalEarned: number;
  setTotalEarned: (amount: number) => void;

  // Tasks
  allTasks: Task[];
  setAllTasks: (tasks: Task[]) => void;
  completedTasks: string[];
  setCompletedTasks: (taskIds: string[]) => void;

  // Earnings History
  earningsHistory: Earning[];
  setEarningsHistory: (earnings: Earning[]) => void;

  // Notifications
  notification: Notification | null;
  showNotification: (message: string, type: 'success' | 'error' | 'info') => void;
  hideNotification: () => void;

  // Actions
  completeTask: (taskId: string, amount: number) => void;
  withdraw: (amount: number) => void;
  logout: () => void;
}