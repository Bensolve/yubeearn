'use server';

import { auth, db } from '@/lib/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  getAuth,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { cookies } from 'next/headers';
import type { User, UserRole } from '@/types';

// ============================================
// SIGNUP (Server Action)
// ============================================
export async function signUpAction(
  email: string,
  password: string,
  role: UserRole
): Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    const newUser: User = {
      id: firebaseUser.uid,
      email: firebaseUser.email!,
      role,
      balance: 0,
      createdAt: new Date(),
      totalEarned: 0,
      completedTasks: [],
      earningsHistory: [],
    };

    await setDoc(doc(db, 'users', firebaseUser.uid), {
      ...newUser,
      createdAt: newUser.createdAt.toISOString(),
    });

    // Store userId in secure cookie
    const cookieStore = await cookies();
    cookieStore.set('userId', firebaseUser.uid, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    console.log('[Auth] Signed up:', email);
    return { success: true, user: newUser };
  } catch (error: any) {
    console.error('[Auth] Signup error:', error.message);
    return {
      success: false,
      error: error.message.includes('email-already-in-use')
        ? 'Email already exists'
        : 'Signup failed',
    };
  }
}

// ============================================
// LOGIN (Server Action)
// ============================================
export async function loginAction(
  email: string,
  password: string
): Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
    if (!userDoc.exists()) {
      return { success: false, error: 'User data not found' };
    }

    const data = userDoc.data();
    const user: User = {
      id: firebaseUser.uid,
      email: firebaseUser.email!,
      role: data.role,
      balance: data.balance,
      createdAt: new Date(data.createdAt),
      totalEarned: data.totalEarned || 0,
      completedTasks: data.completedTasks || [],
      earningsHistory: data.earningsHistory || [],
    };

    // Store userId in secure cookie
    const cookieStore = await cookies();
    cookieStore.set('userId', firebaseUser.uid, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    console.log('[Auth] Logged in:', email);
    return { success: true, user };
  } catch (error: any) {
    console.error('[Auth] Login error:', error.message);
    return {
      success: false,
      error: 'Invalid email or password',
    };
  }
}

// ============================================
// GET LOGGED IN USER (Server Action)
// ============================================
export async function getLoggedInUserAction(): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('userId')?.value;

    if (!userId) return null;

    const userDoc = await getDoc(doc(db, 'users', userId));
    if (!userDoc.exists()) return null;

    const data = userDoc.data();
    return {
      id: userId,
      email: data.email,
      role: data.role,
      balance: data.balance,
      createdAt: new Date(data.createdAt),
      totalEarned: data.totalEarned || 0,
      completedTasks: data.completedTasks || [],
      earningsHistory: data.earningsHistory || [],
    };
  } catch (error) {
    console.error('[Auth] Error getting user:', error);
    return null;
  }
}

// ============================================
// LOGOUT (Server Action)
// ============================================
export async function logoutAction(): Promise<void> {
  try {
    await signOut(auth);
    const cookieStore = await cookies();
    cookieStore.delete('userId');
    console.log('[Auth] Logged out');
  } catch (error) {
    console.error('[Auth] Logout error:', error);
  }
}