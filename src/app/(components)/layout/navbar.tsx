
"use client";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Scissors } from 'lucide-react'; // Changed SewingPin to Scissors
import { SidebarNav } from './sidebar-nav'; // We'll create this for nav items
import { useIsMobile } from '@/hooks/use-mobile';

export default function Navbar() {
  const isMobile = useIsMobile();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Scissors className="h-7 w-7 text-primary" /> {/* Changed SewingPin to Scissors */}
          <span className="text-xl font-bold">Mesuette</span>
        </Link>
        
        {isMobile && (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0 pt-8">
              <SidebarNav isMobile={true} />
            </SheetContent>
          </Sheet>
        )}
      </div>
    </header>
  );
}
