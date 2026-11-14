import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#14213D',
};

export const metadata: Metadata = {
  title: 'Companion — Personal Companion Booking Platform',
  description:
    'Modern, secure personal companion platform for hospital visits, shopping assistance, dining, travel, fitness, and social events. Verified companions with real-time GPS tracking and in-person PIN verification.',
  keywords: [
    'personal companion',
    'companion booking',
    'hospital accompaniment',
    'elderly care assistant',
    'fitness partner',
    'event companion',
    'verified companions India',
  ],
  authors: [{ name: 'Companion Platform Team' }],
  openGraph: {
    title: 'Companion — Personal Companion Booking Platform',
    description:
      'Book background-checked, verified companions for social outings, fitness sessions, travel accompaniment, and hospital appointments.',
    url: 'https://companion-platform.vercel.app',
    siteName: 'Companion Platform',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Companion — Personal Companion Booking Platform',
    description:
      'Book background-checked, verified companions for social outings, fitness sessions, travel accompaniment, and hospital appointments.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#F7F8FA] text-[#20242C] font-sans antialiased selection:bg-[#14213D] selection:text-white">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
