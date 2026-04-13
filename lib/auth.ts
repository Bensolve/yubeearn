import { User, Earning } from "@/types";

export interface SessionSetters {
  setCurrentUser: (user: User) => void;
  setBalance: (balance: number) => void;
  setTotalEarned: (amount: number) => void;
  setCompletedTasks: (tasks: string[]) => void;
  setEarningsHistory: (earnings: Earning[]) => void;
}

export function buildUserSession(user: User, setters: SessionSetters): void {
  setters.setCurrentUser({
    id: user.id,
    email: user.email,
    role: user.role,        // ← not hardcoded this time
    balance: user.balance,
    createdAt: new Date(user.createdAt),
  });
  setters.setBalance(user.balance || 0);
  setters.setTotalEarned(user.totalEarned || 0);
  setters.setCompletedTasks(user.completedTasks || []);
  setters.setEarningsHistory(user.earningsHistory || []);

  console.log("[Auth] Session built for:", user.email);
}


export function logoutAndRedirect(
  logout: () => void,
  redirect: (path: string) => void
) {
  console.log("[Auth] Logging out user");
  logout();
  redirect("/login");
}