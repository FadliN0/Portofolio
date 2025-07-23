import './globals.css';
import { ReactNode } from 'react';
import { Inter } from 'next/font/google';
import type { Metadata, Viewport } from 'next';

// Load font dengan optimasi Next.js
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
});

// Metadata terpisah dari viewport
export const metadata: Metadata = {
  title: 'Fadli Nofrizal | Portfolio',
  description: '3D interactive developer portfolio showcasing creative web experiences',
  keywords: ['portfolio', '3D', 'web developer', 'interactive', 'animation'],
  authors: [{ name: 'Fadli Nofrizal' }],
  openGraph: {
    title: 'Fadli Nofrizal | Portfolio',
    description: '3D interactive developer portfolio showcasing creative web experiences',
    type: 'website',
  },
};

// Viewport terpisah sesuai Next.js 14+
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#000000',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Preload critical resources untuk performa */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossOrigin="" />
      </head>
      <body className={`${inter.className} antialiased`}>
        {/* Background base yang konsisten */}
        <div className="min-h-screen bg-black text-white">
          {children}
        </div>
      </body>
    </html>
  );
}