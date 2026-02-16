import type { SectionContainerProps } from '@/types';

export default function SectionContainer({
  children,
  bgColor = 'bg-white',
  title,
  subtitle,
}: SectionContainerProps) {
  return (
    <div className={`${bgColor} py-16 md:py-24`}>
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {title && (
          <>
            <h3 className="text-3xl md:text-4xl font-bold mb-4 text-center text-gray-900">
              {title}
            </h3>
            {subtitle && (
              <p className="text-center text-gray-600 mb-12 text-lg">{subtitle}</p>
            )}
          </>
        )}
        {children}
      </div>
    </div>
  );
}