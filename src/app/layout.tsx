import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { AppProvider } from '@/context/app-context';
import MainLayout from '@/app/(components)/layout/main-layout';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Mesuette',
  description: 'Gestion des mesures client pour tailleurs.',
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: '#f4f6f8', // Correspond à notre fond gris perle
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AppProvider>
          <MainLayout>{children}</MainLayout>
          <Toaster />
        </AppProvider>
      </body>
    </html>
  );
}
