import type { Metadata } from 'next';
import { AppProvider } from '@/app/context/AppContext';
import './globals.css';

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
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}