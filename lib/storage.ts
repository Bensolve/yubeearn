import { User } from "@/types"; // ← was AppUser, correct name is User

export function loadCurrentUser(): User | null {
  try {
    const savedUsers = localStorage.getItem("yubeearn_users");
    if (!savedUsers) return null;

    const users = JSON.parse(savedUsers);
    const user = users[0];
    if (!user) return null;

    console.log("[Storage] Loaded user:", user.email);

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      balance: user.balance,
      createdAt: new Date(user.createdAt),
      completedTasks: user.completedTasks || [],      // ← add this
      totalEarned: user.totalEarned || 0,             // ← add this
      earningsHistory: user.earningsHistory || [],    // ← add this
    };
  } catch (error) {
    console.error("[Storage] Failed to load user:", error);
    return null;
  }
}



export function findUserByCredentials(email: string, password: string): User | null {
  try {
    const savedUsers = localStorage.getItem("yubeearn_users");
    if (!savedUsers) return null;

    const users: User[] = JSON.parse(savedUsers);
    const user = users.find((u) => u.email === email && u.password === password);

    return user || null;
  } catch (error) {
    console.error("[Storage] Failed to find user:", error);
    return null;
  }
}


export function checkEmailExists(email: string): boolean {
  try {
    const savedUsers = localStorage.getItem("yubeearn_users");
    if (!savedUsers) return false;

    const users: User[] = JSON.parse(savedUsers);
    return users.some((u) => u.email === email);
  } catch (error) {
    console.error("[Storage] Failed to check email:", error);
    return false;
  }
}

export function saveNewUser(user: User): void {
  try {
    const savedUsers = localStorage.getItem("yubeearn_users");
    const users: User[] = savedUsers ? JSON.parse(savedUsers) : [];

    users.push(user);
    localStorage.setItem("yubeearn_users", JSON.stringify(users));

    console.log("[Storage] New user saved:", user.email);
  } catch (error) {
    console.error("[Storage] Failed to save user:", error);
  }
}


export function savePaymentDetails(
  userId: string,
  paymentMethod: 'bank' | 'momo',
  details: { bankName?: string; accountNumber?: string; phoneNumber?: string }
): void {
  try {
    const savedUsers = localStorage.getItem('yubeearn_users');
    if (!savedUsers) return;

    const users: User[] = JSON.parse(savedUsers);
    const updatedUsers = users.map((u) =>
      u.id === userId
        ? { ...u, paymentMethod, ...details }
        : u
    );

    localStorage.setItem('yubeearn_users', JSON.stringify(updatedUsers));
    console.log('[Storage] Payment details saved for:', userId);
  } catch (error) {
    console.error('[Storage] Failed to save payment details:', error);
  }
}

export function changePassword(
  userId: string,
  currentPassword: string,
  newPassword: string
): boolean {
  try {
    const savedUsers = localStorage.getItem('yubeearn_users');
    if (!savedUsers) return false;

    const users: User[] = JSON.parse(savedUsers);
    const user = users.find((u) => u.id === userId);

    if (!user || user.password !== currentPassword) {
      console.log('[Storage] Password change failed - wrong current password');
      return false;  // ← returns false if current password is wrong
    }

    const updatedUsers = users.map((u) =>
      u.id === userId ? { ...u, password: newPassword } : u
    );

    localStorage.setItem('yubeearn_users', JSON.stringify(updatedUsers));
    console.log('[Storage] Password changed for:', userId);
    return true;
  } catch (error) {
    console.error('[Storage] Failed to change password:', error);
    return false;
  }
}

export function loadPaymentDetails(userId: string): {
  paymentMethod: 'bank' | 'momo';
  bankName: string;
  accountNumber: string;
  phoneNumber: string;
} | null {
  try {
    const savedUsers = localStorage.getItem('yubeearn_users');
    if (!savedUsers) return null;

    const users: User[] = JSON.parse(savedUsers);
    const user = users.find((u) => u.id === userId);
    if (!user) return null;

    return {
      paymentMethod: user.paymentMethod || 'bank',
      bankName: user.bankName || '',
      accountNumber: user.accountNumber || '',
      phoneNumber: user.phoneNumber || '',
    };
  } catch (error) {
    console.error('[Storage] Failed to load payment details:', error);
    return null;
  }
}