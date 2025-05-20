
"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Users, LayoutDashboard, PlusCircle } from 'lucide-react';

interface SidebarNavProps {
  isMobile?: boolean;
  onLinkClick?: () => void;
}

const navItems = [
  { href: '/clients', label: 'Clients', icon: Users },
  { href: '/clients/add', label: 'Add Client', icon: PlusCircle },
  // Add more items here later, e.g. Dashboard
  // { href: '/', label: 'Dashboard', icon: LayoutDashboard },
];

export function SidebarNav({ isMobile = false, onLinkClick }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav className={cn('flex flex-col gap-2 px-4', isMobile ? 'mt-4' : 'mt-8')}>
      {navItems.map((item) => (
        <Button
          key={item.href}
          asChild
          variant={pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href)) ? 'default' : 'ghost'}
          className="justify-start"
          onClick={onLinkClick}
        >
          <Link href={item.href} className="flex items-center gap-3">
            <item.icon className="h-5 w-5" />
            {item.label}
          </Link>
        </Button>
      ))}
    </nav>
  );
}
