
import type React from 'react';
import Navbar from './navbar';
import Sidebar from './sidebar';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <ScrollArea className="flex-1">
          <main className="container mx-auto max-w-7xl flex-1 p-4 md:p-8">
            {children}
          </main>
        </ScrollArea>
      </div>
    </div>
  );
}
