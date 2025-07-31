
"use client";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { SidebarNav } from './sidebar-nav';
import { useIsMobile } from '@/hooks/use-mobile';
import Image from 'next/image';

export default function Navbar() {
  const isMobile = useIsMobile();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex flex-col">
           <Link href="/" className="flex items-center gap-2">
            <Image 
              src="https://storage.googleapis.com/project-os-frontend/codellama-v1/images/mesuette/4252a160-c328-4f10-ad27-9c988b4ef84c.png"
              alt="Mesuette Logo"
              width={32}
              height={32}
              className="h-8 w-8"
            />
            <span className="text-xl font-bold text-foreground">Mesuette</span>
          </Link>
          <p className="text-xs text-muted-foreground ml-[2.75rem] -mt-1.5">
            Gestion de mesures client pour tailleurs.
          </p>
        </div>
        
        {isMobile && (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Ouvrir/Fermer le menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0 pt-8">
               <SheetTitle className="sr-only">Menu principal</SheetTitle>
               <SheetDescription className="sr-only">Naviguez à travers les différentes sections de l'application.</SheetDescription>
              <SidebarNav isMobile={true} />
            </SheetContent>
          </Sheet>
        )}
      </div>
    </header>
  );
}
