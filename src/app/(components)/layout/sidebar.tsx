
"use client";
import { SidebarNav } from './sidebar-nav';
import { cn } from '@/lib/utils';

export default function Sidebar() {
  return (
    <aside className={cn(
      "fixed left-0 top-16 z-30 hidden h-[calc(100vh-4rem)] w-64 shrink-0 border-r bg-sidebar text-sidebar-foreground", // Ajout de bg-sidebar et text-sidebar-foreground
      "md:sticky md:block" // Show on md and up
    )}>
      <div className="h-full py-6">
        <SidebarNav />
      </div>
    </aside>
  );
}
