import type { Metadata } from 'next';
import { Providers } from '@/components/Providers';
import '../index.css';

export const metadata: Metadata = {
  title: 'CSS Windify',
  description: 'Convert CSS to Tailwind CSS classes',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
