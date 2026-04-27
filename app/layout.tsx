
import type { Metadata } from 'next';
import { TooltipProvider } from '@/components/ui/tooltip';
import './globals.css';
import '@/lib/firebase'; // ← add this line

export const metadata: Metadata = {
  title: 'YubeEarn',
  description: 'Earn money watching videos',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        
          <TooltipProvider>
            {children}
          </TooltipProvider>
        
      </body>
    </html>
  );
}