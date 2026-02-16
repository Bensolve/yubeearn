import type { TestimonialCardProps } from '@/types';

export default function TestimonialCard({
  initial,
  name,
  location,
  quote,
  hoursGained,
  colorFrom,
  colorTo,
  borderColor,
  bgColor,
}: TestimonialCardProps) {
  return (
    <div className={`bg-gradient-to-br ${colorFrom} to-white border-l-4 ${borderColor} p-6 md:p-8 rounded-lg shadow-md hover:shadow-lg transition`}>
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-12 h-12 bg-gradient-to-br ${colorFrom} ${colorTo} rounded-full flex items-center justify-center text-white font-bold text-lg`}>
          {initial}
        </div>
        <div>
          <p className="font-bold text-lg text-gray-900">{name}</p>
          <p className="text-sm text-gray-600">{location}</p>
        </div>
      </div>
      <p className="mb-4 text-gray-700 leading-relaxed">{quote}</p>
      <div className="flex items-center justify-between">
        <span className={`font-bold ${bgColor} text-sm`}>{hoursGained}</span>
        <span className="text-yellow-400">⭐⭐⭐⭐⭐</span>
      </div>
    </div>
  );
}