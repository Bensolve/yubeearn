'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { User, Earning, Notification, AppContextType } from '@/types';
import { mockTasks } from "@/constants/tasks";

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [balance, setBalance] = useState(0);
  const [totalEarned, setTotalEarned] = useState(0);
  const [allTasks, setAllTasks] = useState(mockTasks); // ← mockTasks here inside component
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [earningsHistory, setEarningsHistory] = useState<Earning[]>([]);
  const [notification, setNotification] = useState<Notification | null>(null);

  const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotification({ message, type, id });
    setTimeout(() => setNotification(null), 3000);
  };

  const hideNotification = () => setNotification(null);

  const completeTask = (taskId: string, amount: number) => {
    if (!completedTasks.includes(taskId)) {
      const newCompletedTasks = [...completedTasks, taskId];
      const newBalance = balance + amount;
      const newTotalEarned = totalEarned + amount;

      setCompletedTasks(newCompletedTasks);
      setBalance(newBalance);
      setTotalEarned(newTotalEarned);

      const earning: Earning = {
        id: Math.random().toString(36).substr(2, 9),
        taskTitle: allTasks.find(t => t.id === taskId)?.title || 'Unknown Task',
        amount,
        date: new Date().toISOString().split('T')[0],
        status: 'completed',
      };

      setEarningsHistory([earning, ...earningsHistory]);

      if (currentUser) {
        const savedUsers = localStorage.getItem('yubeearn_users');
        const users = savedUsers ? JSON.parse(savedUsers) : [];
        const updatedUsers = users.map((u: User) =>
          u.id === currentUser.id
            ? { ...u, balance: newBalance, totalEarned: newTotalEarned, completedTasks: newCompletedTasks, earningsHistory: [earning, ...earningsHistory] }
            : u
        );
        localStorage.setItem('yubeearn_users', JSON.stringify(updatedUsers));
      }

      showNotification(`✓ Earned GHS ${amount}!`, 'success');
      console.log('[AppContext] Task completed:', { taskId, amount, newBalance });
    }
  };

  const withdraw = (amount: number) => {
    if (balance >= amount) {
      const newBalance = balance - amount;
      setBalance(newBalance);

      if (currentUser) {
        const savedUsers = localStorage.getItem('yubeearn_users');
        const users = savedUsers ? JSON.parse(savedUsers) : [];
        const updatedUsers = users.map((u: User) =>
          u.id === currentUser.id
            ? { ...u, balance: newBalance }
            : u
        );
        localStorage.setItem('yubeearn_users', JSON.stringify(updatedUsers));
      }

      showNotification(`✓ Withdrawal of GHS ${amount} processed!`, 'success');
      console.log('[AppContext] Withdrawal:', { amount, newBalance });
    } else {
      showNotification('Insufficient balance', 'error');
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setBalance(0);
    setTotalEarned(0);
    setCompletedTasks([]);
    setEarningsHistory([]);
    showNotification('Logged out', 'info');
    console.log('[AppContext] User logged out');
  };

  const value: AppContextType = {
    currentUser,
    setCurrentUser,
    balance,
    setBalance,
    totalEarned,
    setTotalEarned,
    allTasks,
    setAllTasks,
    completedTasks,
    setCompletedTasks,
    earningsHistory,
    setEarningsHistory,
    notification,
    showNotification,
    hideNotification,
    completeTask,
    withdraw,
    logout,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
}