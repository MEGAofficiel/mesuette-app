
"use client";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Users, Ruler, History, ArrowRight } from 'lucide-react';
import Image from 'next/image';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center h-full p-4 md:p-8 text-center">
      <main className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Image 
            src="https://placehold.co/150x150.png" // Replace with a more fitting logo or illustration
            alt="Mesuette App Illustration" 
            width={120} 
            height={120}
            className="mx-auto mb-6 rounded-full shadow-lg"
            data-ai-hint="tailor logo"
          />
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-4 tracking-tight">
            Bienvenue sur Mesuette
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-10">
            Votre solution élégante et précise pour la gestion des mesures de vos clients. Simplifiez votre travail de tailleur avec des outils intuitifs.
          </p>
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-shadow">
            <Link href="/clients">
              Commencer la gestion des clients
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 pt-8 border-t">
          <div className="flex flex-col items-center p-4">
            <div className="p-3 bg-primary/20 rounded-full mb-3">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-md font-semibold text-foreground mb-1">Gestion Clients</h3>
            <p className="text-sm text-muted-foreground">
              Ajoutez, visualisez et organisez facilement tous vos contacts clients.
            </p>
          </div>
          <div className="flex flex-col items-center p-4">
            <div className="p-3 bg-primary/20 rounded-full mb-3">
             <Ruler className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-md font-semibold text-foreground mb-1">Prise de Mesures Détaillée</h3>
            <p className="text-sm text-muted-foreground">
              Saisissez des mesures précises pour différents types de vêtements.
            </p>
          </div>
          <div className="flex flex-col items-center p-4">
            <div className="p-3 bg-primary/20 rounded-full mb-3">
              <History className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-md font-semibold text-foreground mb-1">Historique Complet</h3>
            <p className="text-sm text-muted-foreground">
              Consultez l'historique des mesures pour chaque client, à tout moment.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
