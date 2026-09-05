import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Instant Mechanic | Live Vehicle Service Operations Dashboard',
  description: 'Production-grade live vehicle operations SaaS dashboard for tracking bookings, mechanics, revenue, and real-time fleet GPS.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 antialiased selection:bg-blue-600 selection:text-white min-h-screen">
        {children}
      </body>
    </html>
  );
}
