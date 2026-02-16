import type { FAQItemProps } from '@/types';

export default function FAQItem({ question, answer }: FAQItemProps) {
  return (
    <details className="bg-white p-6 rounded-lg shadow-md cursor-pointer group">
      <summary className="font-bold text-lg text-gray-900 flex justify-between items-center hover:text-red-600">
        {question}
        <span className="text-2xl group-open:rotate-180 transition text-red-600">▼</span>
      </summary>
      <p className="mt-4 text-gray-700 leading-relaxed">{answer}</p>
    </details>
  );
}