import type { StepCardProps } from '@/types';

export default function StepCard({ number, title, description }: StepCardProps) {
  return (
    <div className="flex gap-4 bg-white p-6 rounded-lg shadow-md">
      <div className="flex-shrink-0">
        <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-red-600 text-white font-bold text-lg">
          {number}
        </div>
      </div>
      <div>
        <h4 className="text-lg font-bold text-gray-900 mb-2">{title}</h4>
        <p className="text-gray-700">{description}</p>
      </div>
    </div>
  );
}