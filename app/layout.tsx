import type {Metadata} from 'next';
import { Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'PEFLARMO Broker Dashboard | Premium Property Marketplace',
  description: 'Manage verified PG, Flat, Room, and Hostel inventory, instant bookings, customer inquiries, site visit schedules, and commission payouts.',
  openGraph: {
    title: 'PEFLARMO Broker Dashboard | Premium Property Marketplace',
    description: 'Manage verified PG, Flat, Room, and Hostel inventory, instant bookings, customer inquiries, site visit schedules, and commission payouts.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PEFLARMO Broker Dashboard | Premium Property Marketplace',
    description: 'Manage verified PG, Flat, Room, and Hostel inventory, instant bookings, customer inquiries, site visit schedules, and commission payouts.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`h-full bg-slate-50 ${plusJakartaSans.variable} ${jetbrainsMono.variable}`}>
      <body className="h-full font-sans text-slate-800 antialiased selection:bg-blue-600 selection:text-white" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
