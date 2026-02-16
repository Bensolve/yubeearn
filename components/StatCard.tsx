import type { StatCardProps } from '@/types';

export default function StatCard({
  number,
  label,
  colorFrom,
  colorTo,
  textColor,
}: StatCardProps) {
  return (
    <div className={`text-center p-8 bg-gradient-to-br ${colorFrom} ${colorTo} rounded-lg`}>
      <p className={`text-5xl md:text-6xl font-bold ${textColor} mb-3`}>{number}</p>
      <p className="text-lg text-gray-700 font-semibold">{label}</p>
    </div>
  );
}