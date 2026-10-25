import type { Metadata, Viewport } from 'next';
import { Noto_Sans_Bengali } from 'next/font/google';
import './globals.css';

const notoSansBengali = Noto_Sans_Bengali({
  subsets: ['bengali'],
  weight: ['400', '600', '700', '800'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ReliefRequest - Flood Emergency Help',
  description: 'Emergency SOS and real-time rescuer coordination platform.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn">
      <body className={`${notoSansBengali.className} antialiased bg-slate-100 text-slate-900 min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
