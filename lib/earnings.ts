import { Earning } from "@/types";

export type EarningsFilter = 'all' | 'week' | 'month';

export function filterEarnings(
  earnings: Earning[],
  filter: EarningsFilter
): Earning[] {
  if (filter === 'all') return earnings;

  const now = new Date();
  const cutoffDate = new Date();

  if (filter === 'week') {
    cutoffDate.setDate(now.getDate() - 7);
  } else if (filter === 'month') {
    cutoffDate.setMonth(now.getMonth() - 1);
  }

  return earnings.filter(e => new Date(e.date) >= cutoffDate);
}

export function sumEarnings(earnings: Earning[]): number {
  return earnings.reduce((sum, e) => sum + e.amount, 0);
}

export function getFilterLabel(filter: EarningsFilter): string {
  if (filter === 'week') return 'This Week';
  if (filter === 'month') return 'This Month';
  return 'Filtered Total';
}